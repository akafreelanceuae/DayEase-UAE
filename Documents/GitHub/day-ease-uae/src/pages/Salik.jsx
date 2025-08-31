import React, { useState } from 'react'
import { dict } from '../i18n'

export default function Salik(){
  const [lang] = useState(localStorage.getItem('lang')||'en')
  const t = (k,...a)=>{ const v=dict[lang][k]; return typeof v==='function'?v(...a):(v??k) }
  const [bal,setBal]=useState(10)
  const [route,setRoute]=useState('none')
  let msg = bal<10? 'Low balance. ':'Balance OK. '
  if (route==='marina') msg += 'Likely Al Safa/Al Barsha gates.'
  if (route==='oldtown') msg += 'Likely Al Garhoud/Al Maktoum gates.'
  return (
    <section className="card">
      <h2>{t('salik_title')}</h2>
      <div className="row">
        <div className="field"><label>Plate</label><input placeholder="A 12345" /></div>
        <div className="field"><label>{t('salik_balance')}</label><input type="number" value={bal} onChange={e=>setBal(parseFloat(e.target.value||'0'))} /></div>
      </div>
      <div className="note">{t('salik_new')}</div>
      <div className="row">
        <div className="field"><label>{t('warn_gate')}</label>
          <select value={route} onChange={e=>setRoute(e.target.value)}>
            <option value="none">—</option>
            <option value="marina">Marina/JLT ↔ SZR</option>
            <option value="oldtown">SZR ↔ Deira</option>
          </select>
        </div>
      </div>
      <div className="note">{msg}</div>
      <div className="row">
        <a className="btn secondary" target="_blank" rel="noopener" href="https://www.salik.ae/en/Top-Up">Top up</a>
        <a className="btn secondary" target="_blank" rel="noopener" href="https://www.salik.ae/en/FAQ">FAQ</a>
      </div>
    </section>
  )
}

