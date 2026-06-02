import logging
from typing import Optional, Tuple

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'


def geocode_address(address: str, country: str = 'Zimbabwe') -> Optional[Tuple[float, float]]:
    """Resolve a place name to (lat, lng) using OpenStreetMap Nominatim (free)."""
    query = f'{address}, {country}'.strip(', ')
    try:
        response = requests.get(
            NOMINATIM_URL,
            params={'q': query, 'format': 'json', 'limit': 1},
            headers={'User-Agent': settings.NOMINATIM_USER_AGENT},
            timeout=12,
        )
        response.raise_for_status()
        results = response.json()
        if not results:
            return None
        return float(results[0]['lat']), float(results[0]['lon'])
    except Exception as exc:
        logger.warning('Geocode failed for %s: %s', query, exc)
        return None
