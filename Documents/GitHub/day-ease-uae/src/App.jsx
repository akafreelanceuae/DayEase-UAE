import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { dict } from './i18n'

export default function App({ children }){
  const [lang, setLang] = useState(localStorage.getItem('lang')||'en')
  const t = (k, ...a) => {
    const v = dict[lang][k]
    return typeof v === 'function'? v(...a) : (v ?? k)
  }
  useEffect(()=>{
    document.documentElement.lang = lang
    document.documentElement.dir = lang==='ar'?'rtl':'ltr'
    localStorage.setItem('lang', lang)
  },[lang])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <span>DayEase UAE</span>
          <small>{t('saved_counter', parseInt(localStorage.getItem('savedAED')||'0',10), parseInt(localStorage.getItem('savedMin')||'0',10))}</small>
        </div>
        <div className="lang-toggle">
          <button className={`pill ${lang==='en'?'active':''}`} onClick={()=>setLang('en')}>EN</button>
          <button className={`pill ${lang==='ar'?'active':''}`} onClick={()=>setLang('ar')}>العربية</button>
        </div>
      </header>

      <nav className="tabbar" role="navigation" aria-label="Primary">
        <NavLink to="/parking" className={({isActive})=>`tab ${isActive?'active':''}`}><span className="icon">🚗</span><span>{t('tab_parking')}</span></NavLink>
        <NavLink to="/nol" className={({isActive})=>`tab ${isActive?'active':''}`}><span className="icon">🚌</span><span>{t('tab_nol')}</span></NavLink>
        <NavLink to="/salik" className={({isActive})=>`tab ${isActive?'active':''}`}><span className="icon">🛣️</span><span>{t('tab_salik')}</span></NavLink>
        <NavLink to="/address" className={({isActive})=>`tab ${isActive?'active':''}`}><span className="icon">📍</span><span>{t('tab_address')}</span></NavLink>
        <NavLink to="/tip" className={({isActive})=>`tab ${isActive?'active':''}`}><span className="icon">💚</span><span>{t('tab_tip')}</span></NavLink>
        <NavLink to="/onboarding" className={({isActive})=>`tab ${isActive?'active':''}`}><span className="icon">🧭</span><span>{t('tab_onboarding')}</span></NavLink>
      </nav>

      <main className="app-main">{children}</main>

      <footer className="app-footer"><span className="muted">v0.2 React</span></footer>
    </div>
  )
}
