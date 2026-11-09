import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function getPage(path) {
  const response = await fetch(new URL(path, baseUrl));
  return { response, html: await response.text() };
}

function catalogIsUnavailable(html) {
  return /Katalog belum dapat dimuat|Detail paket belum tersedia/.test(html);
}

test("shared document metadata and skip navigation are present", async () => {
  const { response, html } = await getPage("/");

  assert.equal(response.status, 200);
  assert.match(html, /<html lang="id"/);
  assert.match(html, /name="description"/);
  assert.match(html, /property="og:site_name" content="Credo Store"/);
  assert.match(html, /name="twitter:card" content="summary"/);
  assert.match(html, /rel="icon"/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /id="main-content"/);
});

test("site header is a separate landmark before main content on all routes", async () => {
  for (const path of ["/", "/paket", "/paket/epic"]) {
    const { response, html } = await getPage(path);
    assert.equal(response.status, 200);
    const headerEnd = html.indexOf("</header>");
    const mainStart = html.indexOf('<main id="main-content"');
    assert.ok(headerEnd >= 0 && mainStart > headerEnd, `Expected the site header before main content on ${path}`);
  }
});

test("home page introduces the store and links to the catalog", async () => {
  const { response, html } = await getPage("/");

  assert.equal(response.status, 200);
  assert.match(html, /Credo Store/i);
  assert.match(html, /Push rank bersama/);
  assert.match(html, /href="\/paket"/);
});

test("catalog page renders its heading and either active services or an explicit unavailable state", async () => {
  const { response, html } = await getPage("/paket");

  assert.equal(response.status, 200);
  assert.match(html, /Pilihan Paket/);
  if (catalogIsUnavailable(html)) {
    assert.match(html, /Katalog belum dapat dimuat/);
  } else {
    assert.match(html, /aria-labelledby="group-/);
    assert.match(html, /href="\/paket\//);
  }
});

test("package detail renders the selected service or an explicit unavailable state", async () => {
  const { response, html } = await getPage("/paket/epic");

  assert.equal(response.status, 200);
  if (catalogIsUnavailable(html)) {
    assert.match(html, /Detail paket belum tersedia/);
    assert.match(html, /Kembali ke pilihan paket/);
  } else {
    assert.match(html, /Detail layanan Epic/i);
    assert.match(html, /Jumlah star/);
    assert.match(html, /Validasi pesanan/);
    assert.match(html, /aria-labelledby="package-title"/);
    assert.match(html, /aria-labelledby="order-form-title"/);
    assert.match(html, /Jangan masukkan password atau kode verifikasi/i);
    assert.doesNotMatch(html, /Lanjutkan ke WhatsApp/);
    assert.doesNotMatch(html, /type="password"/);
  }
});

test("unknown package ids return not-found when the catalog is available", async () => {
  const { response, html } = await getPage("/paket/not-a-real-package");

  if (catalogIsUnavailable(html)) {
    // Without a catalog connection, the application cannot distinguish an unknown
    // slug from a temporarily unavailable catalog. It must show the unavailable state.
    assert.equal(response.status, 200);
    assert.match(html, /Detail paket belum tersedia/);
  } else {
    assert.equal(response.status, 404);
  }
});
