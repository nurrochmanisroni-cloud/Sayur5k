import React, { useEffect, useMemo, useState } from 'react'
import { WHATSAPP_NUMBER_DISPLAY, WHATSAPP_NUMBER_LINK, BRAND_NAME, TAGLINE } from './config'

export default function App() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('')
  const [sortBy, setSortBy] = useState('a-z')

  useEffect(() => {
    fetch('/data/katalog.json').then(r => r.json()).then(setItems)
  }, [])

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(x => x.Kategori).filter(Boolean))).sort()
  }, [items])

  const filtered = useMemo(() => {
    let arr = items.filter(x => {
      const name = (x['Nama Menu'] || '').toLowerCase()
      const isi = (x['Isi'] || '').toLowerCase()
      const q = query.toLowerCase().trim()
      return (!q || name.includes(q) || isi.includes(q)) && (!cat || x.Kategori === cat)
    })
    arr.sort((a,b) => sortBy === 'a-z' ? ((a['Nama Menu']>b['Nama Menu'])?1:-1) : ((a['Nama Menu']<b['Nama Menu'])?1:-1))
    return arr
  }, [items, query, cat, sortBy])

  const waLink = (name) => `https://wa.me/${WHATSAPP_NUMBER_LINK}?text=${encodeURIComponent('Halo Sayur5, saya tertarik: ' + name)}`

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/assets/logo.png" alt="Sayur5" className="w-9 h-9 rounded-md" />
          <div className="font-semibold text-xl tracking-tight">Sayur5</div>
          <nav className="ml-auto flex items-center gap-3">
            <a href="#katalog" className="px-3 py-2 rounded-lg hover:bg-emerald-50">Katalog</a>
            <a href="/admin" className="px-3 py-2 rounded-lg hover:bg-emerald-50">Admin</a>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-10 pb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Belanja Sayur Serba <span className="text-emerald-600">Rp 5.000</span></h1>
            <p className="mt-4 text-lg text-slate-600">{TAGLINE}</p>
            <div className="mt-6 flex gap-3">
              <a href="#katalog" className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700">Lihat Katalog</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER_LINK}`} target="_blank" rel="noopener" className="px-5 py-3 rounded-xl border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50">Chat WhatsApp</a>
            </div>
            <p className="mt-3 text-sm text-slate-500">WA: {WHATSAPP_NUMBER_DISPLAY}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-200">
            <img src="/assets/logo.png" alt="Logo Sayur5" className="w-full h-auto" />
          </div>
        </div>
      </section>

      <section id="katalog" className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Katalog</h2>
          <div className="flex flex-1 md:flex-initial gap-3 items-center">
            <input value={query} onChange={e=>setQuery(e.target.value)} type="search" placeholder="Cari sayur..." className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={cat} onChange={e=>setCat(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Semua Kategori</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((x,idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex-1">
                <div className="h-28 w-full bg-emerald-50 rounded-xl mb-3 flex items-center justify-center text-emerald-700 font-bold">
                  {x['Nama Menu']}
                </div>
                <div className="font-semibold text-slate-900">{x['Nama Menu']}</div>
                <div className="text-sm text-slate-500 mt-0.5">{x['Isi'] || ''}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-emerald-700">{x['Harga'] || 'Rp 5.000'}</span>
                <a href={waLink(x['Nama Menu'])} target="_blank" rel="noopener"
                   className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Pesan</a>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="mt-8 text-center text-slate-500">Tidak ada item yang cocok.</p>}
      </section>

      <a href={`https://wa.me/${WHATSAPP_NUMBER_LINK}`} target="_blank" rel="noopener"
         className="fixed bottom-5 right-5 inline-flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.94 11.94 0 0 0 12.03 0C5.44 0 .09 5.35.09 11.94c0 2.1.55 4.16 1.59 5.98L0 24l6.25-1.63a11.9 11.9 0 0 0 5.77 1.47h.01c6.59 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.19-3.49-8.42zM12.03 21.5h-.01a9.56 9.56 0 0 1-4.88-1.33l-.35-.2-3.71.97.99-3.62-.23-.37a9.53 9.53 0 0 1-1.49-5.02c0-5.29 4.31-9.6 9.61-9.6 2.56 0 4.97.99 6.79 2.81a9.55 9.55 0 0 1 2.82 6.79c0 5.3-4.32 9.61-9.61 9.61z"/></svg>
        <span>Chat WhatsApp</span>
      </a>

      <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} Sayur5</footer>
    </>
  )
}
