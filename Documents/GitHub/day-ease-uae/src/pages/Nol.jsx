import React, { useEffect, useMemo, useState } from 'react'
import { dict } from '../i18n'

const isNFCSupported = () => 'NDEFReader' in window

function formatAED(n){
  return new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',minimumFractionDigits:0}).format(n||0)
}

export default function Nol(){
  const [lang] = useState(localStorage.getItem('lang')||'en')
  const t = (k,...a)=>{const v=dict[lang][k]; return typeof v==='function'?v(...a):(v??k)}
  const [cards, setCards] = useState(()=> JSON.parse(localStorage.getItem('nol_cards')||'[]'))
  const [selected, setSelected] = useState(localStorage.getItem('nol_selected_card')||null)
  const selectedCard = useMemo(()=> cards.find(c=>c.id===selected) || cards[0], [cards, selected])
  const [methods, setMethods] = useState(()=> JSON.parse(localStorage.getItem('pay_methods')||'[]'))
  const primaryMethod = useMemo(()=> methods.find(m=>m.primary) || methods[0], [methods])
  const [receipt, setReceipt] = useState(null)

  useEffect(()=> localStorage.setItem('nol_cards', JSON.stringify(cards)), [cards])
  useEffect(()=> localStorage.setItem('nol_selected_card', selected||''), [selected])
  useEffect(()=> localStorage.setItem('pay_methods', JSON.stringify(methods)), [methods])

  useEffect(()=>{
    if (!cards.length){
      const id = 'c_'+Date.now()
      const mock = { id, cardNumber:'**** **** **** 1234', balance: 26, lastUsed: new Date().toISOString(), history: [] }
      setCards([mock]); setSelected(id)
    }
  },[])

  async function scan(){
    if (!isNFCSupported()) return alert(t('nfc_not_supported'))
    try{
      const reader = new NDEFReader();
      await reader.scan();
      return new Promise((resolve, reject)=>{
        const to = setTimeout(()=>reject(new Error('timeout')), 10000)
        reader.addEventListener('reading', ({serialNumber})=>{
          clearTimeout(to)
          const id = selectedCard?.id || ('c_'+Date.now())
          const last4 = serialNumber?.slice(-4)||'1234'
          const newCard = selectedCard? { ...selectedCard, cardNumber:`**** **** **** ${last4}`, lastUsed:new Date().toISOString() } : { id, cardNumber:`**** **** **** ${last4}`, balance: 20, lastUsed: new Date().toISOString(), history:[] }
          setCards(prev=>{
            const idx = prev.findIndex(c=>c.id===id)
            if (idx>=0){ const cp=[...prev]; cp[idx]=newCard; return cp }
            setSelected(id); return [...prev, newCard]
          })
          resolve(true)
        })
        reader.addEventListener('readingerror', ()=>{ clearTimeout(to); reject(new Error(t('nfc_error'))) })
      })
    }catch(e){ alert(e.message||t('nfc_error')) }
  }

  function topup(amount){
    if (!selectedCard) return
    if (selectedCard.frozen) { alert(t('frozen')); return }
    if (selectedCard.lost) { alert(t('lost_reported')); return }
    setCards(prev=>{
      const idx = prev.findIndex(c=>c.id===selectedCard.id); if (idx<0) return prev
      const cp=[...prev]; cp[idx]={...cp[idx], balance:(cp[idx].balance||0)+amount, history:[...cp[idx].history,{type:'topup',amount, t: new Date().toISOString()}]}
      return cp
    })
    if ('Notification' in window && Notification.permission==='granted') new Notification('Top-up successful', { body: `Added ${formatAED(amount)}` })
  }

  function setCardAutoTopup(enabled){
    if (!selectedCard) return
    setCards(prev=>{
      const idx=prev.findIndex(c=>c.id===selectedCard.id); if(idx<0) return prev
      const card={...prev[idx], autoTopup:{ enabled, threshold: prev[idx].autoTopup?.threshold||10, amount: prev[idx].autoTopup?.amount||50 }}
      const cp=[...prev]; cp[idx]=card; return cp
    })
  }

  // Spending mock
  const journeys = useMemo(()=>{
    const base = selectedCard?.history?.filter(h=>h.type==='journey')||[]
    return base.length? base : Array.from({length:6}).map((_,i)=>({type:'journey', from:'Union', to:'BurJuman', fare: 5+i%3, t: new Date(Date.now()-i*86400000).toISOString()}))
  },[selectedCard])

  // Legacy manual sync
  const [topTime, setTopTime] = useState('')
  const left = useMemo(()=>{ const t = topTime? new Date(topTime).getTime(): Date.now(); const el = Math.max(0, Date.now()-t); return Math.max(0, 60 - Math.floor(el/60000)) },[topTime])

  return (
    <>
      <section className="card">
        <h2>{t('nol_title')}</h2>
        <div className="note">{t('nol_explain')}</div>

        {/* Card manager - horizontal carousel */}
        <div className="hscroll" style={{marginTop:8}}>
          {cards.map(c=> (
            <div key={c.id} className="card-chip" style={{outline: selected===c.id? '2px solid var(--accent)':'none'}} onClick={()=>setSelected(c.id)}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div><b>{c.name||'Nol'}</b></div>
                <div>
                  {c.lost && <span className="badge error">{t('lost_reported')}</span>}
                  {c.frozen && !c.lost && <span className="badge warn">{t('frozen')}</span>}
                </div>
              </div>
              <div className="muted" style={{marginTop:4}}>{c.cardNumber}</div>
              <div style={{marginTop:6, fontWeight:800}}>{formatAED(c.balance||0)}</div>
              <div className="row" style={{gap:6, marginTop:8}}>
                <button className={`btn small ${selected===c.id? 'ok':'secondary'}`}>{selected===c.id? t('selected'): t('select')}</button>
              </div>
            </div>
          ))}
          <button className="chip" onClick={()=>{
            const id='c_'+Date.now();
            const name=prompt(t('method_name'),'Nol')||'Nol';
            const last4=prompt(t('last4'),'1234')||'1234';
            setCards(prev=>[...prev,{id,name, cardNumber:`**** **** **** ${last4}`, balance:20, lastUsed:new Date().toISOString(), history:[], frozen:false, lost:false }]);
            setSelected(id);
          }}>+ {t('add_card')}</button>
        </div>

        {/* Card admin for selected */}
        {selectedCard && (
          <div className="list" style={{marginTop:8}}>
            <div className="item">
              <div className="row" style={{gap:8}}>
                <button className="btn small secondary" onClick={()=>{
                  const newName = prompt(t('rename'), selectedCard.name||'Nol'); if (!newName) return;
                  setCards(prev=>{ const idx=prev.findIndex(c=>c.id===selectedCard.id); const cp=[...prev]; cp[idx]={...cp[idx], name:newName}; return cp })
                }}>{t('rename')}</button>
                <button className={`btn small ${selectedCard.frozen? 'ok':'secondary'}`} onClick={()=>{
                  setCards(prev=>{ const idx=prev.findIndex(c=>c.id===selectedCard.id); const cp=[...prev]; cp[idx]={...cp[idx], frozen: !cp[idx].frozen}; return cp })
                }}>{t('freeze_card')}</button>
                <button className="btn small warn" onClick={()=>{
                  if (!confirm(t('report_lost'))) return;
                  setCards(prev=>{ const idx=prev.findIndex(c=>c.id===selectedCard.id); const cp=[...prev]; cp[idx]={...cp[idx], lost:true, frozen:true}; return cp })
                }}>{t('report_lost')}</button>
                <button className="btn small secondary" onClick={()=>{
                  if(!confirm(t('confirm_remove_card'))) return;
                  setCards(prev=>prev.filter(x=>x.id!==selectedCard.id)); setSelected(null)
                }}>{t('remove')}</button>
              </div>
            </div>
          </div>
        )}

        {/* Selected card overview */}
        {selectedCard && (
          <div className="nol-card-overview" style={{marginTop:10}}>
            <div className="balance-section">
              <div className="balance-label">{t('nol_balance')}</div>
              <div className="balance-amount">{formatAED(selectedCard.balance)}</div>
            </div>
            <div className="card-details">
              <div className="card-detail"><span className="muted">{t('nol_card_number')}:</span> {selectedCard.cardNumber}</div>
              <div className="card-detail"><span className="muted">{t('nol_last_used')}:</span> {new Date(selectedCard.lastUsed).toLocaleDateString()}</div>
            </div>
          </div>
        )}

        <div className="nfc-section">
          <button className={`btn ${isNFCSupported()? '':'secondary'}`} onClick={scan} disabled={!isNFCSupported()}>📱 {t('nfc_scan')}</button>
          {!isNFCSupported() && <div className="muted">{t('nfc_not_supported')}</div>}
        </div>
      </section>

      <section className="card">
        <h3>{t('quick_topup')}</h3>
        <div className="quick-amounts">
          {[10,20,50,100].map(a=> <button key={a} className="chip" onClick={()=>topup(a)}>AED {a}</button>)}
        </div>
        {primaryMethod && <div className="muted" style={{marginTop:6}}>{t('topup_via')}: {primaryMethod.name} ({primaryMethod.type})</div>}
      </section>

      {selectedCard && (
      <section className="card">
        <h3>{t('auto_topup')}</h3>
        <button className={`btn ${selectedCard.autoTopup?.enabled? 'ok':'secondary'}`} onClick={()=>setCardAutoTopup(!selectedCard.autoTopup?.enabled)}>{selectedCard.autoTopup?.enabled? 'On':'Off'}</button>
        {selectedCard.autoTopup?.enabled && (
          <div className="row" style={{marginTop:8}}>
            <div className="field"><label>{t('when_balance_below')}</label><input type="number" defaultValue={selectedCard.autoTopup?.threshold||10} onInput={e=>{
              const val=parseFloat(e.target.value||'0'); setCards(prev=>{ const idx=prev.findIndex(c=>c.id===selectedCard.id); const cp=[...prev]; cp[idx]={...cp[idx], autoTopup:{...cp[idx].autoTopup, enabled:true, threshold: val, amount: cp[idx].autoTopup?.amount||50}}; return cp })
            }} /></div>
            <div className="field"><label>{t('topup_amount')}</label><input type="number" defaultValue={selectedCard.autoTopup?.amount||50} onInput={e=>{
              const val=parseFloat(e.target.value||'0'); setCards(prev=>{ const idx=prev.findIndex(c=>c.id===selectedCard.id); const cp=[...prev]; cp[idx]={...cp[idx], autoTopup:{...cp[idx].autoTopup, enabled:true, threshold: cp[idx].autoTopup?.threshold||10, amount: val}}; return cp })
            }} /></div>
          </div>
        )}
      </section>)}

      {/* Payment Methods */}
      <section className="card">
        <h3>{t('payment_methods')}</h3>
        <div className="list">
          {methods.map((m,i)=> (
            <div key={i} className="item">
              <div>
                <b>{m.name}</b> • {m.type} {m.last4? `• **** ${m.last4}`: ''} {m.primary && <span className="badge" style={{marginLeft:6}}>{t('primary')}</span>}
              </div>
              <div className="row" style={{gap:6}}>
                {!m.primary && <button className="btn small secondary" onClick={()=>setMethods(prev=> prev.map((x,idx)=> ({...x, primary: idx===i})))}>{t('set_primary')}</button>}
                <button className="btn small secondary" onClick={()=>{ if(!confirm(t('delete'))) return; setMethods(prev=> prev.filter((_,idx)=> idx!==i)) }}>{t('delete')}</button>
              </div>
            </div>
          ))}
          <button className="btn small" onClick={()=>{
            const name = prompt(t('method_name'),'Visa'); if(!name) return;
            const type = prompt(`${t('choose_method')}: credit_card / debit_card / digital_wallet`,'credit_card')||'credit_card';
            const last4 = prompt(t('last4'),'1234')||'';
            setMethods(prev=> [...prev, { name, type, last4, primary: prev.length===0 }])
          }}>+ {t('add_payment_method')}</button>
        </div>
      </section>

      <section className="card">
        <h3>{t('spending')}</h3>
        <div className="spending-grid">
          <div className="spending-card"><div className="spend-title">{t('daily_spending')}</div><div className="spend-value">{formatAED(journeys.slice(0,1).reduce((s,j)=>s+j.fare,0))}</div></div>
          <div className="spending-card"><div className="spend-title">{t('weekly_spending')}</div><div className="spend-value">{formatAED(journeys.slice(0,5).reduce((s,j)=>s+j.fare,0))}</div></div>
          <div className="spending-card"><div className="spend-title">{t('monthly_spending')}</div><div className="spend-value">{formatAED(journeys.reduce((s,j)=>s+j.fare,0))}</div></div>
        </div>
        {/* Tiny daily bars (last 7 days mock from journeys) */}
        <div className="bars" style={{marginTop:10}}>
          {Array.from({length:7}).map((_,i)=>{ const amt = journeys[i]?.fare||0; const h = Math.min(100, amt*10); return <div key={i} className="bar" style={{height: `${h}%`}}></div> })}
        </div>
      </section>

      {/* History */}
      {selectedCard && (
      <section className="card">
        <h3>{t('history')}</h3>
        <div className="list">
          {[...(selectedCard.history||[])].slice(-10).reverse().map((h,i)=> (
            <div key={i} className="item" onClick={()=>setReceipt(h)}>
              <span>{new Date(h.t||h.timestamp||Date.now()).toLocaleString()} • {h.type==='topup'? '+':''}{h.amount? formatAED(h.amount): h.fare? formatAED(h.fare): ''}</span>
              <span className="muted">{h.type}</span>
            </div>
          ))}
        </div>
        <div className="row" style={{marginTop:8}}>
          <button className="btn small secondary" onClick={()=>{
            const from = prompt(t('from'),'Union')||'Union';
            const to = prompt(t('to'),'BurJuman')||'BurJuman';
            const fare = parseFloat(prompt(t('fare'),'5')||'0'); if (!fare) return;
            setCards(prev=>{ const idx=prev.findIndex(c=>c.id===selectedCard.id); const cp=[...prev]; const h=[...(cp[idx].history||[]), {type:'journey', from, to, fare, t:new Date().toISOString()}]; cp[idx] = {...cp[idx], history:h, balance: Math.max(0,(cp[idx].balance||0)-fare)}; return cp })
          }}>+ {t('add_ride')}</button>
          <button className="btn small secondary" onClick={()=>{
            const rows = [['time','type','amount/fare']].concat((selectedCard.history||[]).map(h=>[h.t||h.timestamp, h.type, h.amount||h.fare||'']))
            const csv = rows.map(r=>r.join(',')).join('\n');
            const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href=url; a.download='nol-history.csv'; a.click(); URL.revokeObjectURL(url);
          }}>{t('export_csv')}</button>
        </div>
      </section>)}

      {/* Services / links */}
      <section className="card">
        <h3>Services</h3>
        <div className="row">
          <a className="btn secondary" target="_blank" rel="noopener" href="https://www.rta.ae/wps/portal/rta/ae/public-transport/nol/cards">RTA Card Services</a>
          <a className="btn secondary" target="_blank" rel="noopener" href="https://www.rta.ae/wps/portal/rta/ae/public-transport/nol/topup">Top-up</a>
          <a className="btn secondary" target="_blank" rel="noopener" href="https://www.rta.ae/wps/portal/rta/ae/public-transport/nol/nolrechargeoutlets">Recharge Outlets</a>
        </div>
      </section>

      <section className="card legacy-sync">
        <h3>Manual Sync (Legacy)</h3>
        <div className="row">
          <div className="field"><label>{t('topup_time')}</label><input type="datetime-local" value={topTime} onChange={e=>setTopTime(e.target.value)} /></div>
        </div>
        <div className="kpi"><div className="badge">{t('minutes_left', left)}</div></div>
        <div className="list">
          <div className="item"><span>1. {t('step_topup')}</span> ✅</div>
          <div className="item"><span>2. {t('step_tap')}</span> ⏳</div>
          <div className="item"><span>3. {t('step_wait')}</span> ⏳</div>
        </div>
      </section>
      {isNFCSupported() && (<button className="fab" onClick={scan}>📱</button>)}

      {/* Receipt modal */}
      {receipt && (
        <div className="modal" onClick={()=>setReceipt(null)}>
          <div className="sheet" onClick={(e)=>e.stopPropagation()}>
            <h3>{t('receipt')}</h3>
            <div className="list">
              <div className="item"><span>{t('time')}</span><span>{new Date(receipt.t || receipt.timestamp).toLocaleString()}</span></div>
              <div className="item"><span>Type</span><span>{receipt.type}</span></div>
              {receipt.type==='journey' && <div className="item"><span>{t('from')}</span><span>{receipt.from||'-'}</span></div>}
              {receipt.type==='journey' && <div className="item"><span>{t('to')}</span><span>{receipt.to||'-'}</span></div>}
              {receipt.type==='topup' && <div className="item"><span>{t('topup')}</span><span>{formatAED(receipt.amount||0)}</span></div>}
              {receipt.type==='journey' && <div className="item"><span>{t('fare')}</span><span>{formatAED(receipt.fare||0)}</span></div>}
            </div>
            <div className="row" style={{marginTop:10}}>
              <button className="btn small secondary" onClick={async()=>{
                const lines = [
                  `${t('receipt')}`,
                  `${t('time')}: ${new Date(receipt.t||receipt.timestamp).toLocaleString()}`,
                  `Type: ${receipt.type}`,
                  receipt.from? `${t('from')}: ${receipt.from}`: '',
                  receipt.to? `${t('to')}: ${receipt.to}`: '',
                  receipt.amount? `${t('topup')}: ${formatAED(receipt.amount)}`: '',
                  receipt.fare? `${t('fare')}: ${formatAED(receipt.fare)}`: ''
                ].filter(Boolean).join('\n')
                try { if (navigator.share) await navigator.share({ text: lines }); else await navigator.clipboard?.writeText(lines) } catch{}
              }}>Share</button>
              <button className="btn small" onClick={()=>setReceipt(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
