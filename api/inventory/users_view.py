"""Fake user directory backing Exercise 3 (frontend debugging / review).

This endpoint is NOT part of any backend exercise - every bug in Exercise 3
lives in `web/src/exercises/users/UsersList.tsx`. Treat this file as given.

The dataset is generated in memory (no model, no tenant) so the page works on
any database state. Latency is simulated on purpose: short queries are slower
than long ones, the way a real search backend scans more rows for `a` than for
`alexandra` - which makes out-of-order responses reproducible from the UI.
"""

import time

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

FIRST_NAMES = [
    'Alice', 'Brandon', 'Chloe', 'Daniel', 'Emily', 'Frank', 'Grace', 'Henry',
    'Isabella', 'Jacob', 'Katherine', 'Liam', 'Madison', 'Nathan', 'Olivia', 'Peter',
    'Rachel', 'Samuel', 'Tyler', 'Victoria',
]
LAST_NAMES = [
    'Anderson', 'Brooks', 'Carter', 'Davis', 'Evans', 'Foster', 'Griffin', 'Hayes',
    'Jenkins', 'Klein', 'Miller', 'Nelson', 'Parker', 'Sullivan', 'Walker',
]
TEAMS = ['Platform', 'Security', 'Support', 'Data', 'Infra', 'Design']
ROLES = ['Engineer', 'Senior Engineer', 'Staff Engineer', 'Manager', 'Analyst']


def _build_users() -> list[dict]:
    """900 deterministic fake users - long enough that rendering them all hurts."""
    users = []
    for suffix in range(1, 4):
        for first_name in FIRST_NAMES:
            for last_name in LAST_NAMES:
                user_id = len(users) + 1
                users.append(
                    {
                        'id': user_id,
                        'name': f'{first_name} {last_name}',
                        'email': f'{first_name.lower()}.{last_name.lower()}{suffix}@example.com',
                        'team': TEAMS[user_id % len(TEAMS)],
                        'role': ROLES[user_id % len(ROLES)],
                    }
                )

    # Deterministic pseudo-shuffle: directory order is deliberately not
    # alphabetical, so sorting client-side visibly reorders the list.
    users.sort(key=lambda user: (user['id'] * 37) % 101)
    return users


USERS = _build_users()


class UserListView(APIView):
    """`GET /api/users/?q=<text>` - returns a bare JSON array of users."""

    def get(self, request: Request) -> Response:
        query = request.query_params.get('q', '').strip().lower()

        items = USERS
        if query:
            items = [user for user in USERS if query in user['name'].lower() or query in user['email']]

        # Simulated latency, deliberately inverse to query length (see module docstring).
        time.sleep(min(0.4, 0.05 + 0.6 / (len(query) + 1)))

        return Response(items)
