import time

from rest_framework import serializers
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from inventory.models import Application, Device
from inventory.tenant import get_tenant_id


class DeviceListSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name')
    application_count = serializers.SerializerMethodField()
    online_count = serializers.SerializerMethodField()
    application_names = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = [
            'id',
            'hostname',
            'ip_address',
            'tenant_name',
            'application_count',
            'online_count',
            'application_names',
        ]

    def get_application_count(self, device: Device) -> int:
        return len(list(device.applications.all()))

    def get_online_count(self, device: Device) -> int:
        return Application.objects.filter(device=device, status=Application.StatusType.ONLINE).count()

    def get_application_names(self, device: Device) -> list[str]:
        return [application.name for application in list(device.applications.all())]


class DeviceListView(APIView):
    """
    Devices listing view.

    Make this view as fast as possible. This endpoint is functionally correct: every
    test in `api/inventory/tests/test_devices_api.py` passes except the query
    count one. It is also slow enough to be observed in
    http://localhost:5173/devices by looking  at the timing badges.
    """

    def get(self, request: Request) -> Response:
        started = time.perf_counter()

        tenant_id = get_tenant_id(request)
        devices = sorted(
            list(Device.objects.filter(tenant_id=tenant_id)), key=lambda device: device.hostname
        )

        items = DeviceListSerializer(devices, many=True).data
        elapsed_ms = round((time.perf_counter() - started) * 1000)

        return Response({'items': items, 'total_count': len(items), 'elapsed_ms': elapsed_ms})
