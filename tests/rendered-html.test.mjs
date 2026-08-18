import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the ClearFlow reconciliation dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ClearFlow \| Reconciliation Dashboard<\/title>/i);
  assert.match(html, /Reconciliation dashboard/);
  assert.match(html, /Reconciliation queue/);
  assert.match(html, /PAY-849201/);
  assert.match(html, /98\.6%/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("ships finished product metadata and social preview", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /setStatus\("Unmatched"\)/);
  assert.match(page, /setSelected\(row\)/);
  assert.match(layout, /ClearFlow \| Reconciliation Dashboard/);
  assert.match(layout, /\/og-reconciliation\.png/);
  await access(new URL("../public/og-reconciliation.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
