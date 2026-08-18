from django.db import models


class Tenant(models.Model):
    """A customer. Every row in this app belongs to exactly one tenant."""

    name = models.CharField(max_length=120)

    def __str__(self) -> str:
        return self.name


class Device(models.Model):
    """A machine discovered on a tenant's network."""

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='devices')
    hostname = models.CharField(max_length=255)
    ip_address = models.CharField(max_length=45)
    is_billable = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.hostname


class Application(models.Model):
    """An application/service found running on a device."""

    class AppType(models.TextChoices):
        WEB = 'web', 'Web'
        DATABASE = 'db', 'Database'
        SERVICE = 'svc', 'Service'

    class StatusType(models.TextChoices):
        ONLINE = 'online', 'Online'
        OFFLINE = 'offline', 'Offline'
        NOT_SEEN = 'not_seen', 'Not Seen on Last Scan'
        DECOMMISSIONED = 'decommissioned', 'Decommissioned'

    class RiskLevelType(models.TextChoices):
        CRITICAL = 'critical', 'Critical'
        HIGH = 'high', 'High'
        MEDIUM = 'medium', 'Medium'
        LOW = 'low', 'Low'
        NONE = 'none', 'None'

    class ScanType(models.TextChoices):
        AGENT = 'agent', 'Agent'
        NETWORK = 'network', 'Network'
        MANUAL = 'manual', 'Manual'

    class TransportProtocol(models.TextChoices):
        TCP = 'TCP', 'TCP'
        UDP = 'UDP', 'UDP'

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='applications')
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='applications')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=16, choices=AppType.choices, default=AppType.SERVICE)
    status = models.CharField(max_length=16, choices=StatusType.choices, default=StatusType.ONLINE)
    risk_level = models.CharField(max_length=16, choices=RiskLevelType.choices, default=RiskLevelType.NONE)
    port = models.PositiveIntegerField(null=True, blank=True)
    protocol = models.CharField(max_length=32, blank=True)
    transport_protocol = models.CharField(max_length=8, choices=TransportProtocol.choices, blank=True)
    scan_source = models.CharField(max_length=16, choices=ScanType.choices, default=ScanType.NETWORK)
    is_scanned = models.BooleanField(default=False)
    is_enabled = models.BooleanField(default=True)
    discovered_on = models.DateTimeField()
    last_seen = models.DateTimeField()
    last_scanned = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=['tenant', '-discovered_on'])]

    def __str__(self) -> str:
        return self.name
