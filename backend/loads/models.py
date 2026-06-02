import secrets
import uuid
from typing import Optional

from django.conf import settings
from django.db import models
from django.utils import timezone


def generate_load_id() -> str:
    return f'TQ{secrets.randbelow(900_000) + 100_000}'


class ShipmentLoad(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        ASSIGNED = 'assigned', 'Assigned'
        EN_ROUTE_PICKUP = 'en_route_pickup', 'En route to pickup'
        AT_PICKUP = 'at_pickup', 'At pickup'
        IN_TRANSIT = 'in_transit', 'In transit'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    load_id = models.CharField(max_length=16, unique=True, db_index=True, blank=True)
    cargo_owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posted_shipment_loads',
    )
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_shipment_loads',
    )
    pickup_address = models.CharField(max_length=255)
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    destination_address = models.CharField(max_length=255)
    destination_lat = models.FloatField()
    destination_lng = models.FloatField()
    description = models.CharField(max_length=500, blank=True, default='')
    weight = models.CharField(max_length=64, blank=True, default='')
    truck_type = models.CharField(max_length=64, blank=True, default='')
    budget = models.CharField(max_length=64, blank=True, default='')
    pickup_when = models.CharField(max_length=128, blank=True, default='')
    distance_km = models.FloatField(null=True, blank=True)
    weight_tonnes = models.FloatField(null=True, blank=True)
    is_cross_border = models.BooleanField(default=False)
    suggested_price_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    suggested_price_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    suggested_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    suggested_price_currency = models.CharField(max_length=3, blank=True, default='')
    pricing_tier_slug = models.CharField(max_length=64, blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    truck_lat = models.FloatField(null=True, blank=True)
    truck_lng = models.FloatField(null=True, blank=True)
    truck_heading = models.FloatField(null=True, blank=True)
    truck_updated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['cargo_owner', 'status']),
            models.Index(fields=['driver', 'status']),
        ]

    def __str__(self):
        return self.load_id or str(self.id)

    def save(self, *args, **kwargs):
        if not self.load_id:
            self.load_id = generate_load_id()
        super().save(*args, **kwargs)

    def set_truck_location(self, lat: float, lng: float, heading: Optional[float] = None) -> None:
        self.truck_lat = lat
        self.truck_lng = lng
        if heading is not None:
            self.truck_heading = heading
        self.truck_updated_at = timezone.now()
        self.save(
            update_fields=['truck_lat', 'truck_lng', 'truck_heading', 'truck_updated_at', 'updated_at']
        )
