from decimal import Decimal

from django.core.management.base import BaseCommand

from loads.pricing_models import PricingSettings, VehiclePricingTier


class Command(BaseCommand):
    help = 'Seed default vehicle pricing tiers (admin-editable after seed).'

    def handle(self, *args, **options):
        tiers = [
            {
                'slug': 'light_truck',
                'name': 'Light Truck / Bakkie',
                'capacity_label': '1–3 Tons',
                'min_tonnage': Decimal('1'),
                'max_tonnage': Decimal('3'),
                'rate_min_per_km': Decimal('0.50'),
                'rate_max_per_km': Decimal('1.00'),
                'currency': VehiclePricingTier.Currency.USD,
                'match_keywords': 'bakkie,light,1-ton,3-ton,any truck',
                'sort_order': 10,
            },
            {
                'slug': 'medium_truck',
                'name': 'Medium Truck',
                'capacity_label': '4–8 Tons',
                'min_tonnage': Decimal('4'),
                'max_tonnage': Decimal('8'),
                'rate_min_per_km': Decimal('1.36'),
                'rate_max_per_km': Decimal('1.50'),
                'currency': VehiclePricingTier.Currency.USD,
                'match_keywords': 'medium,4-ton,8-ton',
                'sort_order': 20,
            },
            {
                'slug': 'heavy_tri_axle',
                'name': 'Heavy Tri-Axle',
                'capacity_label': '28–34 Tons',
                'min_tonnage': Decimal('15'),
                'max_tonnage': Decimal('34'),
                'rate_min_per_km': Decimal('1.80'),
                'rate_max_per_km': Decimal('2.20'),
                'currency': VehiclePricingTier.Currency.USD,
                'weight_premium_per_tonne': Decimal('0.015'),
                'match_keywords': '15-ton,20-ton,tautliner,refrigerated,tri-axle,heavy',
                'sort_order': 30,
            },
            {
                'slug': 'abnormal_lowbed',
                'name': 'Abnormal / Lowbed',
                'capacity_label': '30+ Tons',
                'min_tonnage': Decimal('30'),
                'max_tonnage': None,
                'rate_min_per_km': Decimal('2.50'),
                'rate_max_per_km': Decimal('3.50'),
                'currency': VehiclePricingTier.Currency.USD,
                'weight_premium_per_tonne': Decimal('0.02'),
                'match_keywords': '30-ton,flatbed,lowbed,abnormal',
                'sort_order': 40,
            },
            {
                'slug': 'cross_border_sa_zim',
                'name': 'Cross-Border (SA ↔ Zimbabwe)',
                'capacity_label': 'International corridor',
                'min_tonnage': None,
                'max_tonnage': None,
                'rate_min_per_km': Decimal('45'),
                'rate_max_per_km': Decimal('65'),
                'currency': VehiclePricingTier.Currency.ZAR,
                'is_cross_border': True,
                'match_keywords': 'cross-border,cross border,sa,zimbabwe,beitbridge',
                'sort_order': 50,
            },
        ]

        for data in tiers:
            slug = data.pop('slug')
            VehiclePricingTier.objects.update_or_create(slug=slug, defaults=data)
            self.stdout.write(self.style.SUCCESS(f'  tier: {slug}'))

        PricingSettings.get_solo()
        self.stdout.write(self.style.SUCCESS('Pricing tiers and settings ready.'))
