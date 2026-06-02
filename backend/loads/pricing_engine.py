import math
import re
from decimal import Decimal
from typing import Any, Dict, List, Optional, Tuple

from .pricing_models import PricingSettings, VehiclePricingTier


def parse_weight_tonnes(weight_raw: str) -> Optional[float]:
    """Parse user weight input such as '12', '12 tonnes', '12.5t'."""
    if not weight_raw or not str(weight_raw).strip():
        return None
    text = str(weight_raw).lower().strip()
    match = re.search(r'(\d+(?:\.\d+)?)', text.replace(',', '.'))
    if not match:
        return None
    value = float(match.group(1))
    if 'kg' in text and 'ton' not in text and value > 100:
        value = value / 1000.0
    return round(value, 3)


def _decimal(v: Any) -> Decimal:
    return Decimal(str(v))


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlng / 2) ** 2
    return round(r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)


def _tier_matches_truck_label(tier: VehiclePricingTier, truck_type: str) -> bool:
    if not truck_type or not tier.match_keywords:
        return False
    label = truck_type.lower()
    for kw in tier.match_keywords.split(','):
        kw = kw.strip().lower()
        if kw and kw in label:
            return True
    return False


def _tier_fits_weight(tier: VehiclePricingTier, weight_tonnes: Optional[float]) -> bool:
    if weight_tonnes is None:
        return True
    w = _decimal(weight_tonnes)
    if tier.min_tonnage is not None and w < tier.min_tonnage:
        return False
    if tier.max_tonnage is not None and w > tier.max_tonnage:
        return False
    return True


def resolve_pricing_tier(
    truck_type: str = '',
    weight_tonnes: Optional[float] = None,
    is_cross_border: bool = False,
) -> Optional[VehiclePricingTier]:
    tiers = list(
        VehiclePricingTier.objects.filter(is_active=True, is_cross_border=is_cross_border)
    )
    if not tiers:
        return None

    if truck_type and truck_type.strip().lower() not in ('', 'any truck'):
        for tier in tiers:
            if _tier_matches_truck_label(tier, truck_type):
                return tier

    if weight_tonnes is not None:
        fitting = [t for t in tiers if _tier_fits_weight(t, weight_tonnes)]
        if fitting:
            # Prefer the tightest max_tonnage band (most specific tier).
            fitting.sort(
                key=lambda t: (
                    float(t.max_tonnage) if t.max_tonnage is not None else 9999,
                    t.sort_order,
                )
            )
            return fitting[0]

        # Weight exceeds all caps — pick highest capacity tier.
        open_ended = [t for t in tiers if t.max_tonnage is None]
        if open_ended:
            return sorted(open_ended, key=lambda t: t.sort_order)[-1]
        return sorted(tiers, key=lambda t: float(t.max_tonnage or 0))[-1]

    # Default: first domestic tier that is not cross-border, or first overall.
    domestic = [t for t in tiers if not t.is_cross_border]
    return (domestic or tiers)[0]


def weight_multiplier(tier: VehiclePricingTier, weight_tonnes: Optional[float]) -> Decimal:
    if weight_tonnes is None or not tier.weight_premium_per_tonne:
        return Decimal('1')
    if tier.min_tonnage is None:
        return Decimal('1')
    excess = max(Decimal('0'), _decimal(weight_tonnes) - tier.min_tonnage)
    if excess <= 0:
        return Decimal('1')
    premium = tier.weight_premium_per_tonne * excess
    return Decimal('1') + min(premium, Decimal('0.35'))


def calculate_quote(
    distance_km: float,
    truck_type: str = '',
    weight_raw: str = '',
    weight_tonnes: Optional[float] = None,
    is_cross_border: bool = False,
    pickup_lat: Optional[float] = None,
    pickup_lng: Optional[float] = None,
    destination_lat: Optional[float] = None,
    destination_lng: Optional[float] = None,
) -> Dict[str, Any]:
    settings = PricingSettings.get_solo()

    if distance_km is None or distance_km <= 0:
        if None not in (pickup_lat, pickup_lng, destination_lat, destination_lng):
            distance_km = haversine_km(pickup_lat, pickup_lng, destination_lat, destination_lng)
        else:
            raise ValueError('distance_km is required (or provide coordinates).')

    distance_km = round(float(distance_km), 2)
    tonnes = weight_tonnes if weight_tonnes is not None else parse_weight_tonnes(weight_raw)

    tier = resolve_pricing_tier(
        truck_type=truck_type,
        weight_tonnes=tonnes,
        is_cross_border=is_cross_border,
    )
    if tier is None:
        raise ValueError('No active pricing tiers configured. Run seed_pricing or add tiers in admin.')

    dist = _decimal(distance_km)
    mult = weight_multiplier(tier, tonnes)

    price_min = (dist * tier.rate_min_per_km * mult).quantize(Decimal('0.01'))
    price_max = (dist * tier.rate_max_per_km * mult).quantize(Decimal('0.01'))

    if tier.currency == VehiclePricingTier.Currency.USD:
        floor = settings.minimum_charge_usd
    else:
        floor = settings.minimum_charge_zar
    price_min = max(price_min, floor)
    price_max = max(price_max, price_min)

    if settings.use_midpoint_for_suggestion:
        suggested = ((price_min + price_max) / 2).quantize(Decimal('0.01'))
    else:
        suggested = price_min

    usd_equivalent = None
    if tier.currency == VehiclePricingTier.Currency.ZAR and settings.zar_to_usd_rate:
        usd_equivalent = (suggested * settings.zar_to_usd_rate).quantize(Decimal('0.01'))

    return {
        'distance_km': distance_km,
        'weight_tonnes': tonnes,
        'truck_type': truck_type,
        'is_cross_border': is_cross_border,
        'tier': {
            'slug': tier.slug,
            'name': tier.name,
            'capacity_label': tier.capacity_label,
            'currency': tier.currency,
            'rate_min_per_km': float(tier.rate_min_per_km),
            'rate_max_per_km': float(tier.rate_max_per_km),
        },
        'weight_multiplier': float(mult),
        'price_min': float(price_min),
        'price_max': float(price_max),
        'suggested_price': float(suggested),
        'currency': tier.currency,
        'formatted': {
            'min': _format_money(price_min, tier.currency),
            'max': _format_money(price_max, tier.currency),
            'suggested': _format_money(suggested, tier.currency),
            'usd_equivalent': _format_money(usd_equivalent, 'USD') if usd_equivalent else None,
        },
        'breakdown': (
            f'{distance_km} km × {tier.rate_min_per_km}–{tier.rate_max_per_km} {tier.currency}/km '
            f'({tier.name})'
            + (f', weight factor ×{float(mult):.2f}' if mult > 1 else '')
        ),
    }


def _format_money(amount: Optional[Decimal], currency: str) -> str:
    if amount is None:
        return ''
    if currency == 'ZAR':
        return f'R {amount:,.2f}'
    return f'USD {amount:,.2f}'
