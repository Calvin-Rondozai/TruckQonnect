from django.db import models


class VehiclePricingTier(models.Model):
    """Admin-configurable per-km rates by vehicle capacity (market pricing table)."""

    class Currency(models.TextChoices):
        USD = 'USD', 'US Dollar (USD)'
        ZAR = 'ZAR', 'South African Rand (ZAR)'

    slug = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=160)
    capacity_label = models.CharField(
        max_length=120,
        blank=True,
        default='',
        help_text='e.g. "1–3 Tons" shown in admin and API',
    )
    min_tonnage = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Inclusive minimum cargo weight (tonnes). Leave empty if not applicable.',
    )
    max_tonnage = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Inclusive maximum cargo weight (tonnes). Leave empty for open-ended.',
    )
    rate_min_per_km = models.DecimalField(max_digits=10, decimal_places=2)
    rate_max_per_km = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.USD)
    is_cross_border = models.BooleanField(
        default=False,
        help_text='Cross-border corridor pricing (typically ZAR per km).',
    )
    weight_premium_per_tonne = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        default=0,
        help_text='Extra multiplier per tonne above tier minimum (0 = disabled). Example: 0.02 = +2% per tonne.',
    )
    match_keywords = models.TextField(
        blank=True,
        default='',
        help_text='Comma-separated keywords to match app truck type labels (e.g. tautliner, 15-ton).',
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'min_tonnage']
        verbose_name = 'vehicle pricing tier'
        verbose_name_plural = 'vehicle pricing tiers'

    def __str__(self):
        return f'{self.name} ({self.rate_min_per_km}–{self.rate_max_per_km} {self.currency}/km)'


class PricingSettings(models.Model):
    """Singleton-style global pricing knobs (edit one row in admin)."""

    label = models.CharField(max_length=64, default='Default', unique=True)
    zar_to_usd_rate = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=0.055,
        help_text='Used to show approximate USD equivalent for ZAR cross-border quotes.',
    )
    minimum_charge_usd = models.DecimalField(max_digits=10, decimal_places=2, default=35)
    minimum_charge_zar = models.DecimalField(max_digits=10, decimal_places=2, default=650)
    use_midpoint_for_suggestion = models.BooleanField(
        default=True,
        help_text='Suggested price uses midpoint of min/max rate band when true.',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'pricing settings'
        verbose_name_plural = 'pricing settings'

    def __str__(self):
        return self.label

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(label='Default')
        return obj
