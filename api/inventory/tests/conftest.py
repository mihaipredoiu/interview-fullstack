from collections.abc import Callable
from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from inventory.models import Application, Device, Tenant

APPLICATIONS_URL = '/api/applications/'
DEVICES_URL = '/api/devices/'


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def tenant(db) -> Tenant:
    return Tenant.objects.create(name='Acme Industries')


@pytest.fixture
def other_tenant(db) -> Tenant:
    return Tenant.objects.create(name='Globex')


@pytest.fixture
def make_device(db) -> Callable[..., Device]:
    def _make_device(tenant: Tenant, hostname: str = 'srv-01', is_billable: bool = True) -> Device:
        return Device.objects.create(
            tenant=tenant,
            hostname=hostname,
            ip_address='10.0.0.1',
            is_billable=is_billable,
        )

    return _make_device


@pytest.fixture
def make_application(db, make_device) -> Callable[..., Application]:
    def _make_application(tenant: Tenant, device: Device | None = None, **kwargs) -> Application:
        device = device or make_device(tenant=tenant)
        now = timezone.now()
        defaults = {
            'name': 'nginx',
            'discovered_on': now - timedelta(days=1),
            'last_seen': now,
        }

        return Application.objects.create(tenant=tenant, device=device, **{**defaults, **kwargs})

    return _make_application
