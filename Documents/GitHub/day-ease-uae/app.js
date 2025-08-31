// DayEase UAE - vanilla SPA

// -------------------- i18n --------------------
const i18n = {
  en: {
    tab_parking: 'Parking', tab_nol: 'Nol Guard', tab_salik: 'Salik', tab_address: 'Address', tab_tip: 'Tip', tab_onboarding: 'Onboard',
    saved_counter: (aeds, mins) => `Saved ~AED ${aeds} / ${mins}m`,
    parking_title: 'Parking Genius',
    plate_label: 'Plate number', emirate_label: 'Emirate', zone_label: 'Zone code', duration_label: 'Duration (hours)',
    channel_label: 'Channel', sms: 'SMS', whatsapp: 'WhatsApp',
    send_now: 'Copy/Send', renew_in: 'Renew in', start_parking: 'Start Parking', stop: 'Stop',
    examples: 'Examples', cross_emirate_hint: 'Sharjah/Ajman in Dubai: prefix with emirate',
    nol_title: 'Nol Second-Tap Guard',
    nol_explain: 'After online top-up, activation requires a second tap at a station gate/validator. Use this checklist and countdown.',
    topup_time: 'Top-up time', minutes_left: m => `${m} minutes left to sync`, checklist: 'Checklist',
    step_topup: 'Top up online', step_tap: 'Tap at gate/validator', step_wait: 'Allow up to 60 minutes',
    salik_title: 'Salik Shield', salik_plate: 'Plate', salik_balance: 'Balance (AED)', warn_gate: 'Warn for likely tolls',
    salik_new: 'New plate? Register URP first before driving through gates.',
    address_title: 'Address & Delivery Fix', share_card: 'Share my exact spot',
    get_location: 'Get my location',
    w3w_label: 'what3words (optional)', driver_note: 'Driver note (bilingual)', copy_card: 'Share/Copy Card',
    tip_title: 'Clean Cashless Tipping', staff_name: 'Your name', staff_note: 'Note (e.g., table/room)',
    generate_link: 'Generate Tip Link', tip_share: 'Share Tip Link',
    onboarding_title: 'Onboarding Concierge', esim_flow: 'DXB visitor eSIM wizard', bank_checklist: 'Bank in-app approvals checklist',
    install: 'Install App',
    timer_set: 'Renewal timer set', timer_done: 'Parking renewal due',
    copy: 'Copy', copied: 'Copied',
  },
  ar: {
    tab_parking: 'مواقف', tab_nol: 'نول', tab_salik: 'سالك', tab_address: 'العنوان', tab_tip: 'إكرامية', tab_onboarding: 'البدء',
    saved_counter: (aeds, mins) => `وفّرت ~${aeds} درهم / ${mins} د`,
    parking_title: 'عبقري المواقف',
    plate_label: 'رقم اللوحة', emirate_label: 'الإمارة', zone_label: 'رمز المنطقة', duration_label: 'المدة (ساعات)',
    channel_label: 'القناة', sms: 'رسالة', whatsapp: 'واتساب',
    send_now: 'نسخ/إرسال', renew_in: 'تجديد بعد', start_parking: 'ابدأ الوقوف', stop: 'إيقاف',
    examples: 'أمثلة', cross_emirate_hint: 'لوحات الشارقة/عجمان بدبي: أضف اسم الإمارة',
    nol_title: 'حارس نول (اللمسة الثانية)',
    nol_explain: 'بعد التعبئة عبر الإنترنت يلزم تفعيل باللمس عند بوابة/قارئ. استخدم قائمة التحقق والعد التنازلي.',
    topup_time: 'وقت التعبئة', minutes_left: m => `تبقى ${m} دقيقة للمزامنة`, checklist: 'قائمة التحقق',
    step_topup: 'تعبئة عبر الإنترنت', step_tap: 'لمس عند البوابة/القارئ', step_wait: 'انتظر حتى ٦٠ دقيقة',
    salik_title: 'درع سالك', salik_plate: 'رقم اللوحة', salik_balance: 'الرصيد (درهم)', warn_gate: 'تحذير قبل البوابات المحتملة',
    salik_new: 'لوحة جديدة؟ سجّل URP قبل المرور.',
    address_title: 'إصلاح العنوان والتوصيل', share_card: 'مشاركة موقعي الدقيق',
    get_location: 'احصل على موقعي',
    w3w_label: 'ثلاث كلمات (اختياري)', driver_note: 'ملاحظة للسائق (ثنائية)', copy_card: 'مشاركة/نسخ البطاقة',
    tip_title: 'إكرامية غير نقدية واضحة', staff_name: 'اسمك', staff_note: 'ملاحظة (طاولة/غرفة)',
    generate_link: 'إنشاء رابط إكرامية', tip_share: 'مشاركة رابط الإكرامية',
    onboarding_title: 'مساعد البداية', esim_flow: 'شريحة eSIM للسائح (مجانية ٢٤ ساعة)', bank_checklist: 'قائمة موافقات البنك داخل التطبيق',
    install: 'تثبيت التطبيق',
    timer_set: 'تم ضبط مؤقت التجديد', timer_done: 'حان تجديد الوقوف',
    copy: 'نسخ', copied: 'تم النسخ',
  }
};

const state = {
  lang: localStorage.getItem('lang') || 'en',
  savedAED: parseInt(localStorage.getItem('savedAED')||'0',10),
  savedMin: parseInt(localStorage.getItem('savedMin')||'0',10),
};

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function t(key, ...args){
  const v = i18n[state.lang][key];
  if (typeof v === 'function') return v(...args);
  return v || key;
}

function setLang(lang){
  state.lang = lang; localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  // apply i18n texts
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  updateSavedCounter();
  // re-render current route for deep copy
  route();
}

function updateSavedCounter(){
  $('#saved-counter').textContent = t('saved_counter', state.savedAED, state.savedMin);
}

// -------------------- Router --------------------
const routes = {
  '#/parking': renderParking,
  '#/nol': renderNol,
  '#/salik': renderSalik,
  '#/address': renderAddress,
  '#/tip': renderTip,
  '#/onboarding': renderOnboarding,
};

function route(){
  const hash = location.hash || '#/parking';
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.route===hash));
  const view = routes[hash] || renderParking;
  const container = $('#app');
  container.innerHTML = '';
  view(container);
  container.focus();
}

// -------------------- Utilities --------------------
function c(tag, opts={}){
  const el = document.createElement(tag);
  if (opts.class) el.className = opts.class;
  if (opts.text) el.textContent = opts.text;
  if (opts.html) el.innerHTML = opts.html;
  return el;
}

function copyText(text){
  return navigator.clipboard?.writeText(text).then(()=>true).catch(()=>false);
}

function formatParkingMessage({emirate, plate, zone, duration}){
  // Dubai SMS 7275 format: [Plate] [Zone] [Duration]
  // Cross-emirate example: SHJ A12345 123A 2
  const prefix = (emirate && emirate !== 'DXB') ? (emirate + ' ') : '';
  const msg = `${prefix}${plate} ${zone} ${duration}`.trim();
  return msg;
}

function whatsappLink(number, text){
  // number like 971588009090
  const enc = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${enc}`;
}

function smsLink(number, body){
  const enc = encodeURIComponent(body);
  return `sms:${number}?&body=${enc}`;
}

function linkBtn(href, label, cls='btn'){
  const a = c('a'); a.href = href; a.textContent = label; a.className = cls; a.target = '_blank'; rel='noopener';
  return a;
}

function notify(title, body){
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') new Notification(title, { body });
}

function timeNowISO(){ return new Date().toISOString(); }

// -------------------- Views --------------------
function renderParking(root){
  const card = c('section', {class:'card'});
  card.append(c('h2', {text: t('parking_title')}));

  const row1 = c('div', {class:'row'});
  const emirate = c('div', {class:'field'});
  emirate.append(c('label', {text:t('emirate_label')}));
  const sel = c('select');
  ['DXB','SHJ','AJM','AD','RAK','UAQ','FUJ'].forEach(code=>{
    const o = c('option'); o.value = code; o.textContent = code;
    sel.append(o);
  });
  sel.value = localStorage.getItem('pk_emirate')||'DXB';
  emirate.append(sel);

  const plate = c('div', {class:'field'});
  plate.append(c('label', {text:t('plate_label')}));
  const plateIn = c('input'); plateIn.placeholder = 'A12345';
  plateIn.value = localStorage.getItem('pk_plate')||'';
  plate.append(plateIn);

  row1.append(emirate, plate);

  const row2 = c('div', {class:'row'});
  const zone = c('div', {class:'field'});
  zone.append(c('label', {text:t('zone_label')}));
  const zoneIn = c('input'); zoneIn.placeholder = '123A'; zoneIn.value = localStorage.getItem('pk_zone')||'';
  zone.append(zoneIn);

  const duration = c('div', {class:'field'});
  duration.append(c('label', {text:t('duration_label')}));
  const durIn = c('input'); durIn.type='number'; durIn.min='0.5'; durIn.step='0.5'; durIn.value = localStorage.getItem('pk_dur')||'1';
  duration.append(durIn);
  row2.append(zone, duration);

  const row3 = c('div', {class:'row'});
  const channel = c('div', {class:'field'});
  channel.append(c('label', {text:t('channel_label')}));
  const chSel = c('select');
  chSel.innerHTML = `<option value="wa">${t('whatsapp')}</option><option value="sms">${t('sms')}</option>`;
  chSel.value = localStorage.getItem('pk_channel')||'wa';
  channel.append(chSel);
  row3.append(channel);

  const msgPreview = c('div', {class:'note'});
  const actions = c('div', {class:'row'});
  const sendBtn = c('button', {class:'btn', text:t('send_now')});
  const timerBtn = c('button', {class:'btn secondary', text:`⏱ ${t('start_parking')}`});
  actions.append(sendBtn, timerBtn);

  const hint = c('div', {class:'note', text:t('cross_emirate_hint')});
  const ex = c('div', {class:'list'});
  ex.append(c('div', {class:'item', html:`<b>${t('examples')}:</b> DXB A12345 123A 2` }));
  ex.append(c('div', {class:'item', html:`SHJ A12345 123A 2` }));

  card.append(row1, row2, row3, msgPreview, actions, hint, ex);
  root.append(card);

  const updatePreview = () => {
    localStorage.setItem('pk_emirate', sel.value);
    localStorage.setItem('pk_plate', plateIn.value.trim());
    localStorage.setItem('pk_zone', zoneIn.value.trim());
    localStorage.setItem('pk_dur', durIn.value);
    localStorage.setItem('pk_channel', chSel.value);
    const msg = formatParkingMessage({emirate: sel.value, plate: plateIn.value.trim(), zone: zoneIn.value.trim(), duration: durIn.value});
    msgPreview.textContent = msg;
  };
  [sel, plateIn, zoneIn, durIn, chSel].forEach(el => el.addEventListener('input', updatePreview));
  updatePreview();

  sendBtn.addEventListener('click', async ()=>{
    const msg = msgPreview.textContent;
    const wa = chSel.value === 'wa';
    // Dubai RTA Mahboub WhatsApp number
    const waNumber = '971588009090';
    const link = wa ? whatsappLink(waNumber, msg) : smsLink('7275', msg);
    analytics('parking_start');
    try{
      if (navigator.share) {
        await navigator.share({ title:'Parking', text: msg, url: link });
      } else {
        location.href = link;
      }
    } catch(err){
      await copyText(msg);
      alert(t('copied'));
    }
  });

  let timerId = null; let timerEnd = null; const timerLabel = c('div', {class:'muted'}); actions.append(timerLabel);
  const updateTimer = () => {
    if (!timerEnd){ timerLabel.textContent=''; return; }
    const ms = timerEnd - Date.now();
    if (ms <= 0){
      clearInterval(timerId); timerId=null; timerEnd=null; timerBtn.textContent = `⏱ ${t('start_parking')}`; notify('DayEase', t('timer_done'));
      state.savedMin += 5; localStorage.setItem('savedMin', state.savedMin); updateSavedCounter();
      return;
    }
    const m = Math.ceil(ms/60000);
    timerLabel.textContent = `${t('renew_in')}: ${m}m`;
  };
  timerBtn.addEventListener('click', ()=>{
    if (timerId){ clearInterval(timerId); timerId=null; timerEnd=null; timerBtn.textContent = `⏱ ${t('start_parking')}`; return; }
    const hours = parseFloat(durIn.value||'1');
    const ms = Math.max(0.25, hours) * 60 * 60 * 1000; // conservative
    timerEnd = Date.now()+ms - 5*60*1000; // remind 5 min before
    timerId = setInterval(updateTimer, 1000*15);
    updateTimer();
    notify('DayEase', t('timer_set'));
  });
}

function renderNol(root){
  const card = c('section', {class:'card'});
  card.append(c('h2', {text: t('nol_title')}));
  card.append(c('div', {class:'note', text: t('nol_explain')}));

  const row = c('div', {class:'row'});
  const field = c('div', {class:'field'});
  field.append(c('label', {text: t('topup_time')}));
  const topIn = c('input'); topIn.type='datetime-local';
  field.append(topIn); row.append(field);

  const progress = c('div', {class:'kpi'});
  const badge = c('div', {class:'badge', text: t('minutes_left', 60)});
  progress.append(badge);

  const checklist = c('div', {class:'list'});
  checklist.append(c('div', {class:'item', html:`<span>1. ${t('step_topup')}</span> ✅`}));
  checklist.append(c('div', {class:'item', html:`<span>2. ${t('step_tap')}</span> ⏳`}));
  checklist.append(c('div', {class:'item', html:`<span>3. ${t('step_wait')}</span> ⏳`}));

  const links = c('div', {class:'row'});
  links.append(linkBtn('https://www.rta.ae/wps/portal/rta/ae/public-transport/nol/newnolcards', 'RTA Nol', 'btn secondary'));

  card.append(row, progress, checklist, links);
  root.append(card);

  function update(){
    const tval = topIn.value ? new Date(topIn.value).getTime() : Date.now();
    const elapsed = Math.max(0, Date.now()-tval);
    const left = Math.max(0, 60 - Math.floor(elapsed/60000));
    badge.textContent = t('minutes_left', left);
  }
  topIn.addEventListener('input', update);
  update();
  analytics('nol_activate');
}

function renderSalik(root){
  const card = c('section', {class:'card'});
  card.append(c('h2', {text: t('salik_title')}));
  const row1 = c('div', {class:'row'});
  const f1 = c('div', {class:'field'}); f1.append(c('label', {text:t('salik_plate')})); const p = c('input'); p.placeholder='A 12345'; f1.append(p);
  const f2 = c('div', {class:'field'}); f2.append(c('label', {text:t('salik_balance')})); const b = c('input'); b.type='number'; b.step='1'; b.min='0'; b.value='10'; f2.append(b);
  row1.append(f1,f2);

  const warn = c('div', {class:'note', text: t('salik_new')});
  const opts = c('div', {class:'row'});
  const likely = c('select'); likely.innerHTML = `<option value="none">—</option><option value="marina">Marina/JLT ↔ SZR</option><option value="oldtown">SZR ↔ Deira</option>`;
  const likelyWrap=c('div',{class:'field'}); likelyWrap.append(c('label',{text:t('warn_gate')}), likely); opts.append(likelyWrap);

  const result = c('div', {class:'note'});
  const links = c('div', {class:'row'});
  links.append(linkBtn('https://www.salik.ae/en/Top-Up', 'Top up', 'btn secondary'));
  links.append(linkBtn('https://www.salik.ae/en/FAQ', 'FAQ', 'btn secondary'));

  const update = () => {
    const bal = parseFloat(b.value||'0');
    let msg = '';
    if (bal < 10) msg += 'Low balance. '; else msg += 'Balance OK. ';
    if (likely.value==='marina') msg += 'Likely Al Safa/Al Barsha gates.';
    if (likely.value==='oldtown') msg += 'Likely Al Garhoud/Al Maktoum gates.';
    result.textContent = msg;
  };
  [b, likely].forEach(el=>el.addEventListener('input', update));
  update();

  card.append(row1, warn, opts, result, links);
  root.append(card);
  analytics('salik_warn');
}

function renderAddress(root){
  const card = c('section', {class:'card'});
  card.append(c('h2', {text: t('address_title')}));

  const coords = { lat: null, lon: null };
  const locRow = c('div', {class:'row'});
  const btn = c('button', {class:'btn', text: `📍 ${t('get_location')}`});
  const out = c('div', {class:'note', text: '—'});
  locRow.append(btn);

  const w3w = c('div', {class:'field'}); w3w.append(c('label', {text:t('w3w_label')})); const w3wIn=c('input'); w3wIn.placeholder='word.word.word'; w3w.append(w3wIn);
  const note = c('div', {class:'field'}); note.append(c('label', {text:t('driver_note')})); const noteIn=c('textarea');
  noteIn.value = 'English: Gate X, call on arrival.\nالعربية: البوابة X، الاتصال عند الوصول.';
  note.append(noteIn);

  const shareBtn = c('button', {class:'btn ok', text:`🔗 ${t('copy_card')}`});

  card.append(locRow, out, w3w, note, shareBtn);
  root.append(card);

  btn.addEventListener('click', ()=>{
    navigator.geolocation?.getCurrentPosition((pos)=>{
      coords.lat = pos.coords.latitude.toFixed(6);
      coords.lon = pos.coords.longitude.toFixed(6);
      const gmaps = `https://maps.google.com/?q=${coords.lat},${coords.lon}`;
      out.textContent = `${coords.lat}, ${coords.lon}`;
      out.innerHTML = `<div>Lat/Lon: <b>${coords.lat}, ${coords.lon}</b></div><div><a target="_blank" rel="noopener" href="${gmaps}">Google Maps</a></div>`;
    }, ()=>{ alert('Location unavailable'); });
  });

  shareBtn.addEventListener('click', async ()=>{
    const lines = [];
    if (coords.lat && coords.lon){
      lines.push(`Maps: https://maps.google.com/?q=${coords.lat},${coords.lon}`);
    }
    if (w3wIn.value) lines.push(`what3words: https://what3words.com/${w3wIn.value.trim()}`);
    lines.push(noteIn.value);
    const text = lines.join('\n');
    analytics('share_address');
    try{
      if (navigator.share) await navigator.share({ text }); else await copyText(text);
      state.savedMin += 2; localStorage.setItem('savedMin', state.savedMin); updateSavedCounter();
    } catch(err){ await copyText(text); }
  });
}

function renderTip(root){
  const card = c('section', {class:'card'});
  card.append(c('h2', {text: t('tip_title')}));
  const r1 = c('div', {class:'row'});
  const f1=c('div',{class:'field'}); f1.append(c('label',{text:t('staff_name')})); const n=c('input'); f1.append(n);
  const f2=c('div',{class:'field'}); f2.append(c('label',{text:t('staff_note')})); const d=c('input'); f2.append(d);
  r1.append(f1,f2);

  const gen = c('button', {class:'btn', text:t('generate_link')});
  const share = c('button', {class:'btn secondary', text:t('tip_share')}); share.disabled=true;
  const qrWrap = c('div');
  const linkOut = c('div', {class:'note'});

  card.append(r1, gen, share, qrWrap, linkOut);
  root.append(card);

  let tipUrl='';
  gen.addEventListener('click', ()=>{
    const payload = new URLSearchParams({ n: n.value.trim(), d: d.value.trim() }).toString();
    tipUrl = `${location.origin}${location.pathname}#/tip/pay?${payload}`;
    linkOut.innerHTML = `<a target="_blank" rel="noopener" href="${tipUrl}">${tipUrl}</a>`;
    share.disabled=false; analytics('tip_link_created');
    // show QR via remote API (online required); fallback to text link
    const api = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(tipUrl)}`;
    qrWrap.innerHTML = `<img class="qr" alt="QR" width="240" height="240" src="${api}">`;
  });

  share.addEventListener('click', async ()=>{
    if (!tipUrl) return;
    try{ if (navigator.share) await navigator.share({ title:'Tip', url: tipUrl }); else await copyText(tipUrl); } catch(e){ await copyText(tipUrl); }
  });

  // payer view
  if (location.hash.startsWith('#/tip/pay')){
    card.innerHTML='';
    const params = new URLSearchParams(location.hash.split('?')[1]||'');
    const name = params.get('n')||'Staff'; const note = params.get('d')||'';
    card.append(c('h3',{text:`Tip ${name}`}));
    if (note) card.append(c('div',{class:'muted',text:note}));
    const amounts = [5,10,20,50];
    const row=c('div',{class:'row'});
    amounts.forEach(a=>{ const b=c('button',{class:'btn small',text:`AED ${a}`}); b.addEventListener('click',()=> input.value=a); row.append(b); });
    const input=c('input'); input.type='number'; input.placeholder='Amount (AED)'; input.min='1'; input.step='1';
    const shareBtn=c('button',{class:'btn ok',text:'Confirm and Pay in Bank App'});
    const noteBox=c('div',{class:'note',text:'No auto-fees. Copy amount and open your bank app to transfer to saved beneficiary/phone/IBAN.'});
    const bankLinks=c('div',{class:'row'});
    bankLinks.append(linkBtn('https://www.emiratesnbd.com/en/help-and-support/mobile-banking','ENBD Help','btn secondary'));
    bankLinks.append(linkBtn('https://www.hsbc.ae/help/mobile-banking/','HSBC Help','btn secondary'));
    card.append(row,input,shareBtn,noteBox,bankLinks);
    shareBtn.addEventListener('click', async ()=>{
      const txt = `Tip ${name}: AED ${input.value||''}`; try{ if (navigator.share) await navigator.share({text:txt}); else await copyText(txt);}catch(_){await copyText(txt);} });
  }
}

function renderOnboarding(root){
  const card = c('section',{class:'card'});
  card.append(c('h2',{text:t('onboarding_title')}));
  const s1=c('section',{class:'card'});
  s1.append(c('h3',{text:t('esim_flow')}));
  s1.append(c('div',{class:'list'}));
  s1.lastChild.append(c('div',{class:'item',html:'1. Choose free 24h eSIM on arrival.'}));
  s1.lastChild.append(c('div',{class:'item',html:'2. Scan QR and activate in Settings.'}));
  s1.lastChild.append(c('div',{class:'item',html:'3. Upgrade plan after 24h as needed.'}));
  const eLinks=c('div',{class:'row'});
  eLinks.append(linkBtn('https://www.du.ae/personal/mobile/esim','du eSIM','btn secondary'));
  eLinks.append(linkBtn('https://www.etisalat.ae/en/c/mobile/esim.jsp','etisalat eSIM','btn secondary'));
  s1.append(eLinks);

  const s2=c('section',{class:'card'});
  s2.append(c('h3',{text:t('bank_checklist')}));
  const lst=c('div',{class:'list'});
  lst.append(c('div',{class:'item',html:'Enable notifications; allow in-app approvals.'}));
  lst.append(c('div',{class:'item',html:'Turn off SMS-only OTP; prefer app prompts.'}));
  lst.append(c('div',{class:'item',html:'Whitelist bank app from battery saver.'}));
  s2.append(lst);

  card.append(s1,s2);
  root.append(card);
}

// -------------------- Analytics --------------------
function analytics(event){
  try{
    const log = JSON.parse(localStorage.getItem('events')||'[]');
    log.push({event, t: timeNowISO()});
    localStorage.setItem('events', JSON.stringify(log));
  }catch(e){/* ignore */}
}

// -------------------- App init --------------------
window.addEventListener('hashchange', route);
window.addEventListener('load', () => {
  // tabs
  $$('.tab').forEach(b => b.addEventListener('click', ()=>{ location.hash = b.dataset.route; }));

  // i18n toggle
  $('#lang-en').addEventListener('click', ()=>{ $('#lang-en').setAttribute('aria-pressed','true'); $('#lang-ar').setAttribute('aria-pressed','false'); setLang('en'); });
  $('#lang-ar').addEventListener('click', ()=>{ $('#lang-en').setAttribute('aria-pressed','false'); $('#lang-ar').setAttribute('aria-pressed','true'); setLang('ar'); });
  if (state.lang==='ar') { $('#lang-ar').click(); } else { $('#lang-en').click(); }
  updateSavedCounter();

  // PWA
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');

  // install prompt
  let deferredPrompt; const installBtn = $('#installBtn');
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt = e; installBtn.hidden=false; });
  installBtn.textContent = t('install');
  installBtn.addEventListener('click', async ()=>{ if (!deferredPrompt) return; deferredPrompt.prompt(); deferredPrompt = null; installBtn.hidden = true; });

  // Notification permission soft ask
  if ('Notification' in window && Notification.permission==='default'){
    setTimeout(()=>Notification.requestPermission().catch(()=>{}), 1200);
  }

  route();
});

