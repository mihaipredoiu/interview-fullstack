from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from inventory.models import Application, Device, Tenant

APP_NAMES = [
    ('nginx', Application.AppType.WEB, 'https', 443),
    ('apache2', Application.AppType.WEB, 'http', 80),
    ('postgresql', Application.AppType.DATABASE, 'postgres', 5432),
    ('mysqld', Application.AppType.DATABASE, 'mysql', 3306),
    ('redis-server', Application.AppType.SERVICE, 'redis', 6379),
    ('sshd', Application.AppType.SERVICE, 'ssh', 22),
    ('rabbitmq', Application.AppType.SERVICE, 'amqp', 5672),
    ('elasticsearch', Application.AppType.SERVICE, 'http', 9200),
    ('grafana', Application.AppType.WEB, 'http', 3000),
    ('legacy-crm', Application.AppType.WEB, '', None),
]

STATUSES = Application.StatusType.values
RISK_LEVELS = Application.RiskLevelType.values
SCAN_SOURCES = Application.ScanType.values


class Command(BaseCommand):
    """Seed the database with deterministic demo data."""

    help = 'Reset and seed tenants, devices and applications.'

    def handle(self, *args, **options) -> None:
        Tenant.objects.all().delete()

        acme = Tenant.objects.create(id=1, name='Acme Industries')
        globex = Tenant.objects.create(id=2, name='Globex')

        # Acme is deliberately large: Exercise 4 needs enough rows that a lazy
        # query per device is visible from the browser, not just in a profiler.
        self._seed_tenant(tenant=acme, devices_count=2400, hostname_prefix='acme')
        self._seed_tenant(tenant=globex, devices_count=5, hostname_prefix='globex')

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeded {Tenant.objects.count()} tenants, '
                f'{Device.objects.count()} devices, '
                f'{Application.objects.count()} applications.'
            )
        )

    def _seed_tenant(self, tenant: Tenant, devices_count: int, hostname_prefix: str) -> None:
        """Create devices and their applications for a tenant."""
        now = timezone.now()

        devices = Device.objects.bulk_create(
            Device(
                tenant=tenant,
                hostname=f'{hostname_prefix}-srv-{device_index + 1:03d}',
                ip_address=f'10.{device_index // 250}.{device_index % 250}.10',
                # One device per tenant is non-billable: its applications must not be listed.
                is_billable=device_index != devices_count - 1,
            )
            for device_index in range(devices_count)
        )

        applications = []
        for device_index, device in enumerate(devices):
            for app_index, (name, app_type, protocol, port) in enumerate(APP_NAMES):
                offset = device_index * len(APP_NAMES) + app_index
                is_scanned = offset % 3 != 0

                applications.append(
                    Application(
                        tenant=tenant,
                        device=device,
                        name=name,
                        type=app_type,
                        status=STATUSES[offset % len(STATUSES)],
                        risk_level=RISK_LEVELS[offset % len(RISK_LEVELS)],
                        port=port,
                        protocol=protocol,
                        transport_protocol='' if port is None else Application.TransportProtocol.TCP,
                        scan_source=SCAN_SOURCES[offset % len(SCAN_SOURCES)],
                        is_scanned=is_scanned,
                        # Every 11th application is disabled: it must not be listed.
                        is_enabled=offset % 11 != 0,
                        discovered_on=now - timedelta(hours=offset * 2, minutes=17),
                        last_seen=now - timedelta(minutes=offset * 7),
                        last_scanned=now - timedelta(minutes=offset * 7) if is_scanned else None,
                    )
                )

        Application.objects.bulk_create(applications, batch_size=500)
