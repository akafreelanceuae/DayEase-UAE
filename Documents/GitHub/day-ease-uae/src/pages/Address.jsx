import React, { useState } from 'react'
import { dict } from '../i18n'

export default function Address(){
  const [lang] = useState(localStorage.getItem('lang')||'en')
  const t = (k,...a)=>{ const v=dict[lang][k]; return typeof v==='function'?v(...a):(v??k) }
  const [coords,setCoords]=useState(null)
  const [w3w,setW3W]=useState('')
  const [note,setNote]=useState('English: Gate X, call on arrival.\nالعربية: البوابة X، الاتصال عند الوصول.')

  const getLoc=()=>navigator.geolocation?.getCurrentPosition((pos)=>{
    setCoords({lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6)})
  },()=>alert('Location unavailable'))

  const share=async()=>{
    const lines=[]
    if (coords) lines.push(`Maps: https://maps.google.com/?q=${coords.lat},${coords.lon}`)
    if (w3w) lines.push(`what3words: https://what3words.com/closed.gear.used${w3w}`)
    lines.push(note)
    const text=lines.join('\n')
    try{ if(navigator.share) await navigator.share({text}); else await navigator.clipboard?.writeText(text) }catch{}
  }

  return (
    <section className="card">
      <h2>{t('address_title')}</h2>
      <div className="row"><button className="btn" onClick={getLoc}>📍 {t('get_location')}</button></div>
      <div className="note">{coords? (<div><div>Lat/Lon: <b>{coords.lat}, {coords.lon}</b></div><a target="_blank" rel="noopener" href={`https://maps.google.com/?q=${coords.lat},${coords.lon}`}>Google Maps</a></div>): '—'}</div>
      <div className="row">
        <div className="field"><label>what3words</label><input value={w3w} onChange={e=>setW3W(e.target.value)} placeholder="word.word.word" /></div>
      </div>
      <div className="field"><label>{t('driver_note')}</label><textarea value={note} onChange={e=>setNote(e.target.value)} /></div>
      <button className="btn ok" onClick={share}>🔗 {t('copy_card')}</button>
    </section>
  )
}

