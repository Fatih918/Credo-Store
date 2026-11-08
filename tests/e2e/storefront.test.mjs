import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function getPage(path) {
  const response = await fetch(new URL(path, baseUrl));
  return { response, html: await response.text() };
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
    assert.match(html, /<header[\\s\\S]*?<\\/header>[\\s\\S]*?<main id="main-content"/);
  }
});

test("home page introduces the store and links to the catalog", async () => {
  const { response, html } = await getPage("/");

  assert.equal(response.status, 200);
  assert.match(html, /Credo Store/i);
  assert.match(html, /Push rank bersama/);
  assert.match(html, /href="\/paket"/);
});

test("catalog page exposes all service categories and package detail links", async () => {
  const { response, html } = await getPage("/paket");

  assert.equal(response.status, 200);
  assert.match(html, /Layanan Per Star/);
  assert.match(html, /Paket Harga Tetap/);
  assert.match(html, /Tier Progression/);
  assert.match(html, /aria-labelledby="group-per-star"/);
  assert.match(html, /href="\/paket\/epic"/);
  assert.match(html, /href="\/paket\/epic-v-to-mythic"/);
});

test("package detail page renders the selected service and order form", async () => {
  const { response, html } = await getPage("/paket/epic");

  assert.equal(response.status, 200);
  assert.match(html, /Detail layanan Epic/i);
  assert.match(html, /Jumlah star/);
  assert.match(html, /Validasi pesanan/);
  assert.match(html, /aria-labelledby="package-title"/);
  assert.match(html, /aria-labelledby="order-form-title"/);
  assert.match(html, /Jangan masukkan password atau kode verifikasi/i);
  assert.doesNotMatch(html, /Lanjutkan ke WhatsApp/);
  assert.doesNotMatch(html, /type="password"/);
});

test("unknown package ids return a not-found response", async () => {
  const { response } = await getPage("/paket/not-a-real-package");
  assert.equal(response.status, 404);
});
