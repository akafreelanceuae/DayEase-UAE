import React, { useMemo, useState } from 'react'
import { dict } from '../i18n'

function formatParking({emirate, plate, zone, duration}){
  const prefix = emirate && emirate!=='DXB' ? emirate+ ' ' : ''
  return `${prefix}${plate} ${zone} ${duration}`.trim()
}

export default function Parking(){
  const [lang] = useState(localStorage.getItem('lang')||'en')
  const t = (k,...a)=>{ const v = dict[lang][k]; return typeof v==='function'?v(...a):(v??k)}
  const [emirate,setEmirate]=useState(localStorage.getItem('pk_emirate')||'DXB')
  const [plate,setPlate]=useState(localStorage.getItem('pk_plate')||'')
  const [zone,setZone]=useState(localStorage.getItem('pk_zone')||'')
  const [dur,setDur]=useState(localStorage.getItem('pk_dur')||'1')
  const [channel,setChannel]=useState(localStorage.getItem('pk_channel')||'wa')
  const msg = useMemo(()=>formatParking({emirate,plate,zone,duration:dur}),[emirate,plate,zone,dur])

  const waNum = '971588009090'
  const link = channel==='wa' ? `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}` : `sms:7275?&body=${encodeURIComponent(msg)}`

  return (
    <section className="card">
      <h2>{t('parking_title')}</h2>
      <div className="row">
        <div className="field"><label>Emirate</label>
          <select value={emirate} onChange={e=>{setEmirate(e.target.value); localStorage.setItem('pk_emirate', e.target.value)}}>
            {['DXB','SHJ','AJM','AD','RAK','UAQ','FUJ'].map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Plate</label><input value={plate} onChange={e=>{setPlate(e.target.value); localStorage.setItem('pk_plate', e.target.value)}} placeholder="A12345" /></div>
      </div>
      <div className="row">
        <div className="field"><label>Zone</label><input value={zone} onChange={e=>{setZone(e.target.value); localStorage.setItem('pk_zone', e.target.value)}} placeholder="123A" /></div>
        <div className="field"><label>Duration (h)</label><input type="number" min="0.5" step="0.5" value={dur} onChange={e=>{setDur(e.target.value); localStorage.setItem('pk_dur', e.target.value)}} /></div>
      </div>
      <div className="note">{msg}</div>
      <div className="row">
        <a className="btn" target="_blank" rel="noopener" href={link}>Copy/Send</a>
        <select value={channel} onChange={e=>{setChannel(e.target.value); localStorage.setItem('pk_channel', e.target.value)}}>
          <option value="wa">WhatsApp</option>
          <option value="sms">SMS</option>
        </select>
      </div>
    </section>
  )
}

