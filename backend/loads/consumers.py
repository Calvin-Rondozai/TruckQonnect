import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import ShipmentLoad


class LoadTrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.load_id = self.scope['url_route']['kwargs']['load_id']
        self.group_name = f'load_{self.load_id}'

        load = await self._get_load()
        if load is None:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        if load.truck_lat is not None and load.truck_lng is not None:
            await self.send(
                text_data=json.dumps(
                    {
                        'type': 'location',
                        'load_id': load.load_id,
                        'lat': load.truck_lat,
                        'lng': load.truck_lng,
                        'heading': load.truck_heading,
                        'status': load.status,
                    }
                )
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        if data.get('type') != 'location':
            return

        lat = data.get('lat')
        lng = data.get('lng')
        if lat is None or lng is None:
            return

        load = await self._update_location(float(lat), float(lng), data.get('heading'))
        if load is None:
            return

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'location_update',
                'data': {
                    'load_id': load.load_id,
                    'lat': load.truck_lat,
                    'lng': load.truck_lng,
                    'heading': load.truck_heading,
                    'status': load.status,
                },
            },
        )

    async def location_update(self, event):
        await self.send(text_data=json.dumps({'type': 'location', **event['data']}))

    @database_sync_to_async
    def _get_load(self):
        return ShipmentLoad.objects.filter(load_id__iexact=self.load_id).first()

    @database_sync_to_async
    def _update_location(self, lat, lng, heading):
        load = ShipmentLoad.objects.filter(load_id__iexact=self.load_id).first()
        if load is None:
            return None
        load.set_truck_location(lat, lng, float(heading) if heading is not None else None)
        return load
