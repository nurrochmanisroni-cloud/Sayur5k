import React, { useEffect, useMemo, useState } from 'react'
import { ADMIN_PIN, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_NUMBER_LINK } from '../config'

function download(filename, text) {
  const el = document.createElement('a')
  el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text))
  el.setAttribute('download', filename)
  el.style.display = 'none'
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pin, setPin] = useState('')
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null) // index
  const [form, setForm] = useState({ 'Nama Menu': '', 'Isi': '', 'Harga': 'Rp 5.000', 'Kategori': '' })

  useEffect(() => {
    fetch('/data/katalog.json').then(r => r.json()).then(setItems)
  }, [])

  const categories = useMemo(() => Array.from(new Set(items.map(x => x.Kategori).filter(Boolean))).sort(), [items])

  const onSave = () => {
    const clean = { ...form }
    if (editing === null) setItems(prev => [...prev, clean])
    else setItems(prev => prev.map((x,i)=> i===editing ? clean : x))
    setForm({ 'Nama Menu': '', 'Isi': '', 'Harga': 'Rp 5.000', 'Kategori': '' })
    setEditing(null)
  }

  const onEdit = (idx) => {
    setEditing(idx)
    setForm(items[idx])
  }

  const onDelete = (idx) => {
    if (!confirm('Hapus item ini?')) return
    setItems(prev => prev.filter((_,i)=>i!==idx))
  }

  const onExport = () => {
    // add HargaNumber for sorting in app
    const withNum = items.map(x => ({
      ...x,
      HargaNumber: parseInt(String(x.Harga).replace(/\D/g,'')) || 5000
    }))
    download('katalog.json', JSON.stringify(withNum, null, 2))
    alert('File katalog.json terunduh. Ganti file di /public/data/ pada hosting kamu untuk publish perubahan.')
  }

  const onImportCSV = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result
      // Very simple CSV parsing (expects headers Nama Menu, Isi, Harga, Kategori)
      const rows = text.trim().split(/\r?\n/)
      const headers = rows.shift().split(',').map(s=>s.trim())
      const idxNama = headers.findIndex(h=>h.toLowerCase().includes('nama'))
      const idxIsi = headers.findIndex(h=>h.toLowerCase()==='isi')
      const idxHarga = headers.findIndex(h=>h.toLowerCase().includes('harga'))
      const idxKat = headers.findIndex(h=>h.toLowerCase().includes('kategori'))
      const list = rows.map(line => {
        const cols = line.split(',')
        return {
          'Nama Menu': cols[idxNama]?.trim() || '',
          'Isi': cols[idxIsi]?.trim() || '',
          'Harga': cols[idxHarga]?.trim() || 'Rp 5.000',
          'Kategori': cols[idxKat]?.trim() || ''
        }
      })
      setItems(list)
    }
    reader.readAsText(file)
  }

  if (!auth) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-50">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow w-[420px] max-w-[92vw]">
          <h1 className="text-xl font-semibold">Login Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Masukkan PIN untuk mengelola katalog.</p>
          <input value={pin} onChange={e=>setPin(e.target.value)} type="password" placeholder="PIN"
                 className="mt-4 w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <button onClick={()=> setAuth(pin===ADMIN_PIN)} className="mt-4 w-full px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
            Masuk
          </button>
          <a href="/" className="block text-center text-sm text-slate-500 mt-4 hover:underline">← Kembali</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/assets/logo.png" alt="Sayur5" className="w-8 h-8 rounded-md" />
          <div className="font-semibold text-lg">Panel Admin</div>
          <a href="/" className="ml-auto text-sm px-3 py-2 rounded-lg hover:bg-emerald-50">← Lihat Situs</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-600">Impor CSV</label>
            <input type="file" accept=".csv" onChange={e=>e.target.files[0] && onImportCSV(e.target.files[0])} />
            <button onClick={onExport} className="ml-auto px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Export katalog.json</button>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">{editing===null ? 'Tambah Item' : 'Edit Item'}</h2>
              <div className="space-y-3">
                {['Nama Menu','Isi','Harga','Kategori'].map(k => (
                  <div key={k}>
                    <label className="text-sm text-slate-600">{k}</label>
                    <input value={form[k] || ''} onChange={e=>setForm({...form, [k]: e.target.value})}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={onSave} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                    {editing===null ? 'Tambah' : 'Simpan'}
                  </button>
                  {editing!==null && <button onClick={()=>{setEditing(null); setForm({'Nama Menu':'','Isi':'','Harga':'Rp 5.000','Kategori':''})}} className="px-4 py-2 rounded-lg border">Batal</button>}
                </div>
                <p className="text-xs text-slate-500">Perubahan tidak langsung tersimpan ke server. Tekan <b>Export</b> lalu ganti file <code>public/data/katalog.json</code> di hosting.</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Katalog ({items.length})</h2>
              <div className="max-h-[480px] overflow-auto border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-2 text-left">Nama</th>
                      <th className="p-2 text-left">Isi</th>
                      <th className="p-2 text-left">Harga</th>
                      <th className="p-2 text-left">Kategori</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((x,idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{x['Nama Menu']}</td>
                        <td className="p-2">{x['Isi']}</td>
                        <td className="p-2">{x['Harga']}</td>
                        <td className="p-2">{x['Kategori']}</td>
                        <td className="p-2 text-right space-x-1">
                          <button onClick={()=>onEdit(idx)} className="px-2 py-1 rounded border">Edit</button>
                          <button onClick={()=>onDelete(idx)} className="px-2 py-1 rounded border text-red-600">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
