import logging
from typing import Any, Dict, List, Optional, Tuple

import requests

logger = logging.getLogger(__name__)

OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'


def _decode_polyline6(encoded: str) -> List[Dict[str, float]]:
    """Decode OSRM GeoJSON polyline6 geometry to [{latitude, longitude}, ...]."""
    coordinates: List[Tuple[float, float]] = []
    index = 0
    lat = 0
    lng = 0
    length = len(encoded)

    while index < length:
        shift = result = 0
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlat = ~(result >> 1) if (result & 1) else (result >> 1)
        lat += dlat

        shift = result = 0
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlng = ~(result >> 1) if (result & 1) else (result >> 1)
        lng += dlng

        coordinates.append((lat / 1e6, lng / 1e6))

    return [{'latitude': lat, 'longitude': lng} for lat, lng in coordinates]


def fetch_route(waypoints: List[Tuple[float, float]]) -> Optional[Dict[str, Any]]:
    """
    waypoints: list of (lat, lng) in visit order — truck → pickup → destination.
    Returns route payload with legs and combined polyline coordinates.
    """
    if len(waypoints) < 2:
        return None

    coord_str = ';'.join(f'{lng},{lat}' for lat, lng in waypoints)
    url = f'{OSRM_BASE}/{coord_str}'
    params = {'overview': 'full', 'geometries': 'polyline6', 'steps': 'false'}

    try:
        response = requests.get(url, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        if data.get('code') != 'Ok' or not data.get('routes'):
            logger.warning('OSRM error: %s', data.get('message'))
            return None

        route = data['routes'][0]
        geometry = route.get('geometry', '')
        polyline = _decode_polyline6(geometry) if geometry else []

        legs = []
        for leg in route.get('legs', []):
            legs.append(
                {
                    'distance_m': leg.get('distance'),
                    'duration_s': leg.get('duration'),
                }
            )

        return {
            'distance_m': route.get('distance'),
            'duration_s': route.get('duration'),
            'polyline': polyline,
            'legs': legs,
            'waypoints': [
                {'latitude': lat, 'longitude': lng, 'order': i}
                for i, (lat, lng) in enumerate(waypoints)
            ],
        }
    except Exception as exc:
        logger.exception('OSRM request failed: %s', exc)
        return None


def build_tracking_route(load) -> Optional[Dict[str, Any]]:
    """Build OSRM route: truck (if known) → pickup → destination."""
    points: List[Tuple[float, float]] = []

    if load.truck_lat is not None and load.truck_lng is not None:
        points.append((load.truck_lat, load.truck_lng))

    points.append((load.pickup_lat, load.pickup_lng))
    points.append((load.destination_lat, load.destination_lng))

    if len(points) < 2:
        return None

    return fetch_route(points)
