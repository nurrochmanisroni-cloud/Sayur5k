# Sayur5 React (Vite) — Katalog Serba 5 Ribu

Fitur:
- UI modern (Tailwind via CDN), responsif.
- Katalog dari `public/data/katalog.json`.
- Pencarian, filter kategori, sort A→Z/Z→A.
- Tombol pesan via WhatsApp per item.
- **Panel Admin** (PIN default `5151`) untuk tambah/edit/hapus, impor CSV, dan **Export katalog.json** siap publish.

## Jalankan Lokal
```bash
npm i
npm run dev
```
Buka `http://localhost:5173`.

## Deploy (Netlify/Vercel)
- Deploy seperti proyek React biasa (build command `vite build`, publish dir `dist`).
- Atau host sebagai static: jalankan `npm run build`, unggah folder `dist` ke hosting.

## Kustom
- Ubah nomor WA & PIN di `src/config.js`:
  - `WHATSAPP_NUMBER_DISPLAY` -> tampil di UI
  - `WHATSAPP_NUMBER_LINK` -> format 62xxxxxxxxxx (tanpa 0)
  - `ADMIN_PIN` -> PIN login admin
  - `TAGLINE`, `BRAND_NAME`
- Ubah logo di `public/assets/logo.png`.
- Update data melalui halaman `/admin` lalu **Export** dan ganti `public/data/katalog.json` di hosting.

> Catatan: Panel Admin ini **tidak menyimpan** ke server (tanpa backend). Untuk publish perubahan, download `katalog.json` melalui tombol Export dan **replace** file di hosting/repo.
