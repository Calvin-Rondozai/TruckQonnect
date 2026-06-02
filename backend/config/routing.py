from django.urls import re_path

from loads.consumers import LoadTrackingConsumer

websocket_urlpatterns = [
    re_path(r'ws/tracking/(?P<load_id>[^/]+)/$', LoadTrackingConsumer.as_asgi()),
]
