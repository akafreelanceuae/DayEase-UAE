import React, { useState } from 'react'
import { dict } from '../i18n'

export default function Tip(){
  const [lang] = useState(localStorage.getItem('lang')||'en')
  const t = (k,...a)=>{ const v=dict[lang][k]; return typeof v==='function'?v(...a):(v??k) }
  const [name,setName]=useState('')
  const [desc,setDesc]=useState('')
  const [url,setUrl]=useState('')
  const [qr,setQr]=useState('')

  function generate(){
    const payload = new URLSearchParams({ n:name, d:desc }).toString()
    const link = `${location.origin}/tip?${payload}`
    setUrl(link)
    const api = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(link)}`
    setQr(api)
  }

  async function share(){
    try{ if (navigator.share) await navigator.share({ title:'Tip', url }); else await navigator.clipboard?.writeText(url) }catch{}
  }

  return (
    <section className="card">
      <h2>{t('tip_title')}</h2>
      <div className="row">
        <div className="field"><label>{t('staff_name')}</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="field"><label>{t('staff_note')}</label><input value={desc} onChange={e=>setDesc(e.target.value)} /></div>
      </div>
      <div className="row">
        <button className="btn" onClick={generate}>{t('generate_link')}</button>
        <button className="btn secondary" onClick={share} disabled={!url}>{t('tip_share')}</button>
      </div>
      {url && <div className="note"><a href={url} target="_blank" rel="noopener">{url}</a></div>}
      {qr && <img className="qr" width="240" height="240" src={qr} alt="QR" />}
    </section>
  )
}

