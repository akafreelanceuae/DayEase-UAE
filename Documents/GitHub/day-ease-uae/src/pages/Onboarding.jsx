import React from 'react'
import { dict } from '../i18n'

export default function Onboarding(){
  const lang = localStorage.getItem('lang')||'en'
  const t = (k,...a)=>{ const v=dict[lang][k]; return typeof v==='function'?v(...a):(v??k) }
  return (
    <section className="card">
      <h2>{t('onboarding_title')}</h2>
      <section className="card">
        <h3>DXB visitor eSIM</h3>
        <div className="list">
          <div className="item">1. Free 24h eSIM on arrival.</div>
          <div className="item">2. Scan QR and activate in Settings.</div>
          <div className="item">3. Upgrade plan after 24h.</div>
        </div>
        <div className="row">
          <a className="btn secondary" target="_blank" rel="noopener" href="https://www.du.ae/personal/mobile/esim">du eSIM</a>
          <a className="btn secondary" target="_blank" rel="noopener" href="https://www.etisalat.ae/en/c/mobile/esim.jsp">etisalat eSIM</a>
        </div>
      </section>
      <section className="card">
        <h3>Bank in-app approvals</h3>
        <div className="list">
          <div className="item">Enable notifications; allow in-app approvals.</div>
          <div className="item">Prefer app prompts over SMS-only OTP.</div>
          <div className="item">Whitelist bank app in battery saver.</div>
        </div>
      </section>
    </section>
  )
}

