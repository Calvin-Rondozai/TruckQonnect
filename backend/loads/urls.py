from django.urls import path

from .views import (
    ShipmentLoadAssignView,
    ShipmentLoadDetailView,
    ShipmentLoadListCreateView,
    ShipmentLoadLocationView,
    ShipmentLoadRouteView,
)

urlpatterns = [
    path('loads/', ShipmentLoadListCreateView.as_view(), name='loads-list-create'),
    path('loads/<str:load_id>/', ShipmentLoadDetailView.as_view(), name='loads-detail'),
    path('loads/<str:load_id>/route/', ShipmentLoadRouteView.as_view(), name='loads-route'),
    path('loads/<str:load_id>/location/', ShipmentLoadLocationView.as_view(), name='loads-location'),
    path('loads/<str:load_id>/assign/', ShipmentLoadAssignView.as_view(), name='loads-assign'),
]
