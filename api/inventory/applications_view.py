from rest_framework import serializers
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from inventory.tenant import get_tenant_id

# Everything you need is already here - it is just not wired up:
# from inventory.filters import ApplicationFilter
# from inventory.models import Application


class ApplicationListSerializer(serializers.Serializer):
    """Applications listing serializer.

    Exercise 2 - the response shape. Each item must expose:

        id, name, type, hostname, device_id, status, risk_level, port, protocol,
        transport_protocol, discovered_on, last_seen, last_scanned, scan_type,
        scan_source

    Rules the tests check:
      * `type`, `status`, `risk_level` and `scan_source` are the human readable
        labels, not the raw DB values.
      * `hostname` is the related device's hostname.
      * `port`, `protocol` and `transport_protocol` fall back to 'N/A' when empty.
      * `scan_type` is 'Scanned' when the application was scanned, else 'Discovered'.
    """


class ApplicationListView(GenericAPIView):
    """Applications listing view.

    Exercise 2. Implement the listing this endpoint is supposed to serve.
    `api/inventory/tests/test_applications_api.py` is the spec, and the given
    frontend (web/src/exercises/applications/) is the consumer - once this
    endpoint honours the contract, the page works.

    TODO(1): Return the envelope the frontend expects:
             {'items': [...], 'page': int, 'total_pages': int, 'total_count': int}
    TODO(2): Scope every query to the tenant from `get_tenant_id(request)`, and
             list only enabled applications running on billable devices.
    TODO(3): Paginate with `page` / `size`. Cap `size` at settings.API_MAX_PAGE_SIZE
             and default it to settings.API_PAGE_SIZE.
    TODO(4): Support filtering (`ApplicationFilter` already exists), free-text
             `search` over name + device hostname, and `ordering`.
             Default ordering: newest discovered first.
    TODO(5): Serialize with `ApplicationListSerializer` above and do not run one
             query per row - the device hostname is on a related table.
    """

    def get(self, request: Request, *args, **kwargs) -> Response:
        # Rename once you actually use it.
        _tenant_id = get_tenant_id(request)

        return Response({'items': []})
