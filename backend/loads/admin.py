from django.contrib import admin

from .models import ShipmentLoad


@admin.register(ShipmentLoad)
class ShipmentLoadAdmin(admin.ModelAdmin):
    list_display = ('load_id', 'cargo_owner', 'driver', 'status', 'pickup_address', 'destination_address', 'created_at')
    list_filter = ('status',)
    search_fields = ('load_id', 'pickup_address', 'destination_address')
