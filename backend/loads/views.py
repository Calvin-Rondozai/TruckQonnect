from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserRole

from .models import ShipmentLoad
from .routing_osrm import build_tracking_route
from .serializers import (
    CreateShipmentLoadSerializer,
    ShipmentLoadSerializer,
    TruckLocationSerializer,
)


def broadcast_location(load: ShipmentLoad) -> None:
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return
    payload = {
        'type': 'location_update',
        'data': {
            'load_id': load.load_id,
            'lat': load.truck_lat,
            'lng': load.truck_lng,
            'heading': load.truck_heading,
            'status': load.status,
            'updated_at': load.truck_updated_at.isoformat() if load.truck_updated_at else None,
        },
    }
    async_to_sync(channel_layer.group_send)(f'load_{load.load_id}', payload)


class ShipmentLoadListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == UserRole.CARGO:
            qs = ShipmentLoad.objects.filter(cargo_owner=request.user)
        elif request.user.role == UserRole.DRIVER:
            qs = ShipmentLoad.objects.filter(driver=request.user)
        else:
            qs = ShipmentLoad.objects.none()

        serializer = ShipmentLoadSerializer(qs[:100], many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateShipmentLoadSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        load = serializer.save()
        return Response(
            ShipmentLoadSerializer(load).data,
            status=status.HTTP_201_CREATED,
        )


class ShipmentLoadDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, load_id, user):
        load = get_object_or_404(ShipmentLoad, load_id__iexact=load_id)
        if user.role == UserRole.CARGO and load.cargo_owner_id != user.id:
            raise PermissionError
        if user.role == UserRole.DRIVER and load.driver_id not in (None, user.id):
            raise PermissionError
        return load

    def get(self, request, load_id):
        try:
            load = self.get_object(load_id, request.user)
        except PermissionError:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(ShipmentLoadSerializer(load).data)


class ShipmentLoadRouteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, load_id):
        load = get_object_or_404(ShipmentLoad, load_id__iexact=load_id)
        if request.user.role == UserRole.CARGO and load.cargo_owner_id != request.user.id:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role == UserRole.DRIVER and load.driver_id not in (None, request.user.id):
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        route = build_tracking_route(load)
        if route is None:
            return Response(
                {'detail': 'Could not calculate route. Try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                'load_id': load.load_id,
                'pickup': {'latitude': load.pickup_lat, 'longitude': load.pickup_lng},
                'destination': {'latitude': load.destination_lat, 'longitude': load.destination_lng},
                'truck': (
                    {'latitude': load.truck_lat, 'longitude': load.truck_lng}
                    if load.truck_lat is not None and load.truck_lng is not None
                    else None
                ),
                'route': route,
            }
        )


class ShipmentLoadLocationView(APIView):
    """Driver posts GPS updates (REST fallback; WebSocket preferred)."""

    permission_classes = [IsAuthenticated]

    def post(self, request, load_id):
        if request.user.role != UserRole.DRIVER:
            return Response({'detail': 'Only drivers can send location updates.'}, status=status.HTTP_403_FORBIDDEN)

        load = get_object_or_404(ShipmentLoad, load_id__iexact=load_id)
        if load.driver_id and load.driver_id != request.user.id:
            return Response({'detail': 'Not assigned to this load.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = TruckLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if load.driver_id is None:
            load.driver = request.user
            load.status = ShipmentLoad.Status.ASSIGNED
            load.save(update_fields=['driver', 'status', 'updated_at'])

        load.set_truck_location(
            serializer.validated_data['lat'],
            serializer.validated_data['lng'],
            serializer.validated_data.get('heading'),
        )

        if load.status == ShipmentLoad.Status.ASSIGNED:
            load.status = ShipmentLoad.Status.EN_ROUTE_PICKUP
            load.save(update_fields=['status', 'updated_at'])

        broadcast_location(load)

        return Response(ShipmentLoadSerializer(load).data)


class ShipmentLoadAssignView(APIView):
    """Driver claims / starts tracking a load (dev & MVP)."""

    permission_classes = [IsAuthenticated]

    def post(self, request, load_id):
        if request.user.role != UserRole.DRIVER:
            return Response({'detail': 'Only drivers can accept tracking.'}, status=status.HTTP_403_FORBIDDEN)

        load = get_object_or_404(ShipmentLoad, load_id__iexact=load_id)
        load.driver = request.user
        if load.status == ShipmentLoad.Status.OPEN:
            load.status = ShipmentLoad.Status.ASSIGNED
        load.save(update_fields=['driver', 'status', 'updated_at'])
        return Response(ShipmentLoadSerializer(load).data)
