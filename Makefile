.PHONY: setup setup-api setup-web dev dev-api dev-web migrate seed reset-db test test-api lint clean

PIP := api/.venv/bin/pip

# ---------------------------------------------------------------------------- #
# Setup - run once
# ---------------------------------------------------------------------------- #

setup: setup-api setup-web
	@echo ""
	@echo "Done. Run 'make dev' and open http://localhost:5173"

setup-api:
	@python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)' \
		|| (echo "Python 3.10+ required, found $$(python3 -V). Install a newer python3 and retry."; exit 1)
	python3 -m venv api/.venv
	$(PIP) install --quiet --upgrade pip
	$(PIP) install --quiet -r api/requirements.txt
	$(MAKE) seed

setup-web:
	cd web && npm install

# ---------------------------------------------------------------------------- #
# Run
# ---------------------------------------------------------------------------- #

# Starts the API on :8000 and the app on :5173. Ctrl-C stops both.
dev:
	$(MAKE) -j2 dev-api dev-web

dev-api:
	cd api && .venv/bin/python manage.py runserver 8000

dev-web:
	cd web && npm run dev

migrate:
	cd api && .venv/bin/python manage.py migrate

# Wipes and re-creates the demo data. Creates the tables first if they are gone,
# so this works on an empty or deleted database too.
seed: migrate
	cd api && .venv/bin/python manage.py seed

# Throws the database away and rebuilds it from scratch.
reset-db:
	rm -f api/db.sqlite3
	$(MAKE) seed

# ---------------------------------------------------------------------------- #
# Tests - these are the spec. Green means done.
# ---------------------------------------------------------------------------- #

test: test-api

test-api:
	cd api && .venv/bin/python -m pytest

# ---------------------------------------------------------------------------- #
# Quality
# ---------------------------------------------------------------------------- #

lint:
	cd web && npm run typecheck

clean:
	rm -rf api/.venv api/db.sqlite3 web/node_modules
