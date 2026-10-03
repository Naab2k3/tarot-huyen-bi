"""Guards the two things that actually broke production.

1. backend/app/main.py serving the built SPA out of frontend/dist.
   This is the only thing that serves /assets/*.js on Vercel, because the
   FastAPI framework preset does not publish outputDirectory.

2. vercel.json wiring. This is plain config, so it regresses silently; a
   bad includeFiles or a rewrite that stops pointing at the function
   produces a blank page in production and nothing in CI.

No network, no database, no Vercel account required.
"""

import importlib
import json
import shutil
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = BACKEND_DIR.parent
VERCEL_JSON = REPO_ROOT / "vercel.json"

SAMPLE_JS = b"console.log('huyenbi');"
SAMPLE_HTML = b'<!DOCTYPE html><html><body><div id="root"></div></body></html>'


# --------------------------------------------------------------------------
# vercel.json contract
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def vercel_config() -> dict:
    return json.loads(VERCEL_JSON.read_text(encoding="utf-8"))


def test_include_files_is_a_string(vercel_config):
    """The Vercel schema requires a glob *string* here, not an array.

    Shipping an array fails the build with:
      functions.api/index.py.includeFiles should be string
    """
    include = vercel_config["functions"]["api/index.py"]["includeFiles"]
    assert isinstance(include, str), (
        f"includeFiles must be a glob string, got {type(include).__name__}: {include!r}"
    )


def test_include_files_ships_frontend_dist(vercel_config):
    """frontend/dist must be in the function, or main.py's FRONTEND_DIST
    check is always False and no asset is ever served."""
    include = vercel_config["functions"]["api/index.py"]["includeFiles"]
    assert "frontend/dist" in include, (
        f"includeFiles {include!r} does not cover frontend/dist; the function "
        "will not contain the built SPA and /assets/*.js will 404 or fall "
        "through to index.html"
    )


def test_include_files_still_covers_backend(vercel_config):
    include = vercel_config["functions"]["api/index.py"]["includeFiles"]
    assert "backend" in include, f"includeFiles {include!r} dropped the backend package"


def test_every_path_is_routed_to_the_function(vercel_config):
    """Vercel gives the filesystem precedence over rewrites, so a rewrite to
    /index.html is a fallback, not a delivery mechanism. Everything must be
    sent to the function, which owns both /api and the SPA."""
    rewrites = vercel_config["rewrites"]
    catch_all = [r for r in rewrites if r["source"] == "/(.*)"]
    assert catch_all, f"no catch-all rewrite in {rewrites}"
    assert catch_all[-1]["destination"] == "/api/index.py", (
        "the catch-all rewrite must target the function, otherwise asset "
        "requests resolve to a static index.html and the browser rejects the "
        "module script for MIME reasons"
    )


def test_no_rewrite_targets_index_html(vercel_config):
    """Rewriting to /index.html is what produced the text/html MIME bug."""
    for r in vercel_config.get("rewrites", []):
        assert r["destination"] != "/index.html", (
            "a rewrite to /index.html serves HTML for asset requests, which "
            "triggers 'Expected a JavaScript-or-Wasm module script'"
        )


# --------------------------------------------------------------------------
# The SPA the function actually serves
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def client(tmp_path_factory) -> TestClient:
    """Build a throwaway copy of the repo layout that main.py expects.

    main.py resolves FRONTEND_DIST relative to its own file, so the only way
    to exercise the real mount code is to give it a real tree to find.
    """
    root = tmp_path_factory.mktemp("layout")
    shutil.copytree(
        BACKEND_DIR / "app", root / "backend" / "app",
        ignore=shutil.ignore_patterns("__pycache__"),
    )

    dist = root / "frontend" / "dist"
    (dist / "assets").mkdir(parents=True)
    (dist / "logo").mkdir(parents=True)
    (dist / "assets" / "index-test.js").write_bytes(SAMPLE_JS)
    (dist / "assets" / "index-test.css").write_bytes(b"body{color:red}")
    (dist / "logo" / "favicon-32.png").write_bytes(b"\x89PNG\r\n\x1a\n" + b"\x00" * 8)
    (dist / "index.html").write_bytes(SAMPLE_HTML)

    sys.path.insert(0, str(root / "backend"))
    for name in [m for m in list(sys.modules) if m == "app" or m.startswith("app.")]:
        del sys.modules[name]
    app_module = importlib.import_module("app.main")

    with TestClient(app_module.app) as c:
        yield c

    sys.path.remove(str(root / "backend"))


def test_javascript_is_served_as_javascript(client):
    """The original production bug, verbatim.

    Returning text/html for a module script makes the browser throw
    "Expected a JavaScript-or-Wasm module script" and the app never boots.
    """
    r = client.get("/assets/index-test.js")
    assert r.status_code == 200
    assert "javascript" in r.headers["content-type"], (
        f"/assets/*.js came back as {r.headers['content-type']!r}"
    )
    assert r.content == SAMPLE_JS


def test_css_is_served_as_css(client):
    r = client.get("/assets/index-test.css")
    assert r.status_code == 200
    assert "css" in r.headers["content-type"]


def test_png_is_served_as_png(client):
    r = client.get("/logo/favicon-32.png")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("image/png")


def test_root_serves_the_spa_shell(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "text/html" in r.headers["content-type"]
    assert b'id="root"' in r.content


def test_client_side_route_falls_back_to_the_shell(client):
    r = client.get("/booking")
    assert r.status_code == 200
    assert b'id="root"' in r.content


def test_unknown_api_path_is_json_404_not_the_spa(client):
    r = client.get("/api/definitely-not-a-route")
    assert r.status_code == 404
    assert "application/json" in r.headers["content-type"]