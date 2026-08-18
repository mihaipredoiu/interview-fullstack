"""Stand-in for the real auth/tenant layer.

The production app resolves the tenant from the authenticated user's profile.
Here it comes from the `X-Tenant-Id` header so the exercise stays focused on the
listing endpoint, while still forcing you to scope every query by tenant.
"""

from rest_framework.request import Request

DEFAULT_TENANT_ID = 1


def get_tenant_id(request: Request) -> int:
    """Return the tenant id for the current request."""
    raw_tenant_id = request.headers.get('X-Tenant-Id')

    try:
        return int(raw_tenant_id)
    except (TypeError, ValueError):
        return DEFAULT_TENANT_ID
