from rest_framework import serializers

from accounts.models import UserRole

from .geocode import geocode_address
from .models import ShipmentLoad


class ShipmentLoadSerializer(serializers.ModelSerializer):
    load_id_display = serializers.CharField(source='load_id', read_only=True)

    class Meta:
        model = ShipmentLoad
        fields = (
            'id',
            'load_id',
            'load_id_display',
            'pickup_address',
            'pickup_lat',
            'pickup_lng',
            'destination_address',
            'destination_lat',
            'destination_lng',
            'description',
            'weight',
            'truck_type',
            'budget',
            'pickup_when',
            'distance_km',
            'status',
            'truck_lat',
            'truck_lng',
            'truck_heading',
            'truck_updated_at',
            'created_at',
            'updated_at',
            'driver',
        )
        read_only_fields = (
            'id',
            'load_id',
            'status',
            'truck_lat',
            'truck_lng',
            'truck_heading',
            'truck_updated_at',
            'created_at',
            'updated_at',
            'driver',
        )


class CreateShipmentLoadSerializer(serializers.Serializer):
    pickup_address = serializers.CharField(max_length=255)
    destination_address = serializers.CharField(max_length=255)
    pickup_lat = serializers.FloatField(required=False)
    pickup_lng = serializers.FloatField(required=False)
    destination_lat = serializers.FloatField(required=False)
    destination_lng = serializers.FloatField(required=False)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    weight = serializers.CharField(max_length=64, required=False, allow_blank=True, default='')
    truck_type = serializers.CharField(max_length=64, required=False, allow_blank=True, default='')
    budget = serializers.CharField(max_length=64, required=False, allow_blank=True, default='')
    pickup_when = serializers.CharField(max_length=128, required=False, allow_blank=True, default='')
    distance_km = serializers.FloatField(required=False, allow_null=True)

    def validate(self, attrs):
        pickup_lat = attrs.get('pickup_lat')
        pickup_lng = attrs.get('pickup_lng')
        if pickup_lat is None or pickup_lng is None:
            coords = geocode_address(attrs['pickup_address'])
            if coords is None:
                raise serializers.ValidationError(
                    {'pickup_address': 'Could not locate pickup on the map. Try a clearer address.'}
                )
            pickup_lat, pickup_lng = coords
            attrs['pickup_lat'] = pickup_lat
            attrs['pickup_lng'] = pickup_lng

        dest_lat = attrs.get('destination_lat')
        dest_lng = attrs.get('destination_lng')
        if dest_lat is None or dest_lng is None:
            coords = geocode_address(attrs['destination_address'])
            if coords is None:
                raise serializers.ValidationError(
                    {'destination_address': 'Could not locate delivery on the map. Try a clearer address.'}
                )
            dest_lat, dest_lng = coords
            attrs['destination_lat'] = dest_lat
            attrs['destination_lng'] = dest_lng

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        if user.role != UserRole.CARGO:
            raise serializers.ValidationError({'detail': 'Only cargo clients can post loads.'})

        return ShipmentLoad.objects.create(
            cargo_owner=user,
            pickup_address=validated_data['pickup_address'].strip(),
            pickup_lat=validated_data['pickup_lat'],
            pickup_lng=validated_data['pickup_lng'],
            destination_address=validated_data['destination_address'].strip(),
            destination_lat=validated_data['destination_lat'],
            destination_lng=validated_data['destination_lng'],
            description=validated_data.get('description', ''),
            weight=validated_data.get('weight', ''),
            truck_type=validated_data.get('truck_type', ''),
            budget=validated_data.get('budget', ''),
            pickup_when=validated_data.get('pickup_when', ''),
            distance_km=validated_data.get('distance_km'),
        )


class TruckLocationSerializer(serializers.Serializer):
    lat = serializers.FloatField()
    lng = serializers.FloatField()
    heading = serializers.FloatField(required=False, allow_null=True)

    def validate_lat(self, value):
        if not -90 <= value <= 90:
            raise serializers.ValidationError('Invalid latitude.')
        return value

    def validate_lng(self, value):
        if not -180 <= value <= 180:
            raise serializers.ValidationError('Invalid longitude.')
        return value


class AssignDriverSerializer(serializers.Serializer):
    """Assign current user (driver) to a load — used when bid accepted in a later phase."""

    pass
