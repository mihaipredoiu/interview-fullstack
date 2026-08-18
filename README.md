## Setup

Requirements: **Python 3.10+** and **Node 20+**. That's it - npm comes with Node,
and everything else is installed into the repo (`api/.venv`, `web/node_modules`).

```bash
make setup     # venv + pip install + migrate + seed, then npm install
make dev       # API on :8000, app on http://localhost:5173
```

No `make`? The same thing by hand:

```bash
cd api && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate && .venv/bin/python manage.py seed
.venv/bin/python manage.py runserver 8000
# in a second terminal
cd web && npm install && npm run dev
```

On Windows, `make` doesn't exist and the virtualenv puts its executables in
`api\.venv\Scripts\` rather than `api/.venv/bin/`. Option A avoids all of that -
use it unless you already have a working WSL or Git Bash setup.

The database is a gitignored `api/db.sqlite3` file, populated by a seed command:

```bash
make seed        # wipe and re-create the demo data (migrates first if needed)
make reset-db    # delete the database file and rebuild it from scratch
```

## Knowing when you're done

```bash
make test        # the API suite (the frontend exercises have no tests)
make test-api    # pytest
```

---

## Exercise 1 - Task list (frontend only)

Build a component that lists tasks, filters them and summarises them.

|         |                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------- |
| Work in | [web/src/exercises/task-list/TaskList.tsx](web/src/exercises/task-list/TaskList.tsx)           |
| Given   | `data.ts` (dataset + types), `ListItem.tsx`, `TaskList.module.scss`                            |
| Spec    | No tests. The requirements below, the page itself and your own judgement.                      |
| Route   | http://localhost:5173/tasks                                                                    |

1. Render the tasks using `<ListItem />`.
2. Filter the list by the status dropdown's selection.
3. Show a summary: total tasks, total shown, total estimated hours.
4. The X button on a row removes that task from the list.
5. The selected filter survives a page refresh.
6. Pressing Escape anywhere resets the filter to "all".

Do not change the shape of the data in `data.ts` - build the UI around it.

## Exercise 2 - Applications listing (backend)

The applications page needs a server-driven table: pagination, filtering, search
and sorting all happen in the API, not in the browser.

|          |                                                                                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Work in  | [api/inventory/applications_view.py](api/inventory/applications_view.py)                                                     |
| Given    | `models.py`, `filters.py`, `tenant.py`, the frontend page (done - do not change it)                                          |
| Spec     | [api/inventory/tests/test_applications_api.py](api/inventory/tests/test_applications_api.py)                                 |
| Contract | [web/src/exercises/applications/hooks.ts](web/src/exercises/applications/hooks.ts) - request params and response shape fixed |
| Route    | http://localhost:5173/applications                                                                                           |

`GET /api/applications/` currently returns `{"items": []}`. Make it return a
real page of applications for the request's tenant. The TODOs in
`applications_view.py` list what's expected.

The frontend is already wired to the endpoint: it sends `page`, `size`, `name`,
`search` and `ordering`, and expects the
`{items, page, total_pages, total_count}` envelope. Respect that contract and
the page just works - use it to check your endpoint in the browser.

Tenancy: there is no login. `src/api/client.ts` sends `X-Tenant-Id: 1`, and the
seed data contains a second tenant - the API must never leak across that line.

## Exercise 3 - User directory (frontend debugging)

This page shipped broken. Open it, open the console, and take it from there.

|         |                                                                                            |
| ------- | ------------------------------------------------------------------------------------------ |
| Work in | [web/src/exercises/users/UsersList.tsx](web/src/exercises/users/UsersList.tsx)             |
| Given   | `UsersRoute.tsx` (the shell), `GET /api/users?q=` (the backend is fine - do not change it) |
| Spec    | No tests. The console, the network tab and your own judgement are the spec.                |
| Route   | http://localhost:5173/users                                                                |

## Exercise 4 - Devices listing (backend performance)

The devices page is functionally correct and embarrassingly slow. The page
shows you exactly how slow.

|         |                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| Work in | [api/inventory/devices_view.py](api/inventory/devices_view.py)                                                            |
| Given   | the frontend page (done - do not change it), `models.py`, the seed data                                                   |
| Spec    | [api/inventory/tests/test_devices_api.py](api/inventory/tests/test_devices_api.py) - every test caps the whole listing at 3 queries |
| Route   | http://localhost:5173/devices - timing badges update on every request                                                     |

1. Reproduce it: `make seed`, open the page, note the numbers.

---

## Repo map

```
api/
  interview_api/          Django project (settings, urls)
  inventory/
    models.py             Tenant, Device, Application - given
    filters.py            ApplicationFilter - given
    tenant.py             X-Tenant-Id -> tenant id - given
    applications_view.py  <- exercise 2 (view + serializer)
    users_view.py         fake user directory - given (exercise 3's endpoint)
    devices_view.py       <- exercise 4
    tests/                the API spec (exercises 2 and 4)
web/
  src/components/         Table, Dropdown, TextInput, Placeholder, PageHeader - given
  src/api/                axios client + useFetch - given
  src/exercises/
    task-list/            <- exercise 1
    applications/         exercise 2's frontend - given
    users/                <- exercise 3
    devices/              exercise 4's frontend - given
```
