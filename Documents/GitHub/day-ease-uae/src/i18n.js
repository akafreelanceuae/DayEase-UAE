export const dict = {
  en: {
    app_name: 'DayEase UAE',
    tab_parking: 'Parking', tab_nol: 'Nol Guard', tab_salik: 'Salik', tab_address: 'Address', tab_tip: 'Tip', tab_onboarding: 'Onboard',
    saved_counter: (aeds, mins) => `Saved ~AED ${aeds} / ${mins}m`,
    install: 'Install App',
    // Nol
    nol_title: 'Nol Guard Pro',
    nol_explain: 'Manage Nol cards, scan with NFC, quick/auto top-up, and track journeys like SimplyGo.',
    nol_balance: 'Current Balance', nol_card_number: 'Card Number', nol_last_used: 'Last Used',
    nfc_scan: 'Scan Nol Card', nfc_scanning: 'Hold your phone near the Nol card...', nfc_not_supported: 'NFC not supported on this device', nfc_error:'Could not read card',
    quick_topup: 'Quick Top-up', auto_topup: 'Auto Top-up', when_balance_below: 'When balance below', topup_amount: 'Top-up amount',
    daily_spending: 'Today', weekly_spending: 'This Week', monthly_spending: 'This Month', spending: 'Spending',
    recent_trips: 'Recent Trips', view_all: 'View All',
    topup_time: 'Top-up time', minutes_left: m => `${m} minutes left to sync`, step_topup: 'Top up online', step_tap: 'Tap at gate/validator', step_wait: 'Allow up to 60 minutes',
    // Card admin
    card_manager: 'My Cards', add_card: 'Add Card', select: 'Select', selected: 'Selected', rename: 'Rename', remove: 'Remove',
    freeze_card: 'Freeze', frozen: 'Frozen', active: 'Active', report_lost: 'Report Lost', lost_reported: 'Lost/Blocked',
    confirm_remove_card: 'Remove card?',
    // Payments
    payment_methods: 'Payment Methods', add_payment_method: 'Add Payment Method', method_name: 'Name', last4: 'Last 4', primary: 'Primary', set_primary: 'Set Primary', delete: 'Delete',
    choose_method: 'Choose method', topup_via: 'Top-up via', credit_card: 'Credit Card', debit_card: 'Debit Card', digital_wallet: 'Digital Wallet',
    // History / receipts
    history: 'History', receipt: 'Receipt', export_csv: 'Export CSV', add_ride: 'Add Ride', ride: 'Ride', topup: 'Top-up', from: 'From', to: 'To', fare: 'Fare', time: 'Time',
    on: 'On', off: 'Off',
    // Others minimal for now
    parking_title: 'Parking Genius', salik_title:'Salik Shield', address_title:'Address & Delivery Fix', tip_title:'Clean Cashless Tipping', onboarding_title:'Onboarding Concierge'
  },
  ar: {
    app_name: 'داي إيِز الإمارات',
    tab_parking: 'مواقف', tab_nol: 'نول', tab_salik: 'سالك', tab_address: 'العنوان', tab_tip: 'إكرامية', tab_onboarding: 'البدء',
    saved_counter: (aeds, mins) => `وفّرت ~${aeds} درهم / ${mins} د`,
    install: 'تثبيت التطبيق',
    // Nol
    nol_title: 'حارس نول برو',
    nol_explain: 'إدارة بطاقات نول، فحص عبر NFC، تعبئة سريعة/تلقائية وتتبع الرحلات مثل SimplyGo.',
    nol_balance: 'الرصيد الحالي', nol_card_number: 'رقم البطاقة', nol_last_used: 'آخر استخدام',
    nfc_scan: 'فحص بطاقة نول', nfc_scanning: 'قرّب هاتفك من بطاقة نول...', nfc_not_supported: 'NFC غير مدعوم', nfc_error:'تعذر قراءة البطاقة',
    quick_topup: 'تعبئة سريعة', auto_topup: 'تعبئة تلقائية', when_balance_below:'عندما الرصيد أقل من', topup_amount:'قيمة التعبئة',
    daily_spending:'اليوم', weekly_spending:'هذا الأسبوع', monthly_spending:'هذا الشهر', spending:'الإنفاق',
    recent_trips:'الرحلات الأخيرة', view_all:'عرض الكل',
    topup_time: 'وقت التعبئة', minutes_left: m => `تبقى ${m} دقيقة`, step_topup: 'تعبئة عبر الإنترنت', step_tap: 'لمس عند البوابة/القارئ', step_wait: 'انتظر حتى ٦٠ دقيقة',
    // Card admin
    card_manager: 'بطاقاتي', add_card: 'إضافة بطاقة', select: 'اختيار', selected: 'محددة', rename:'إعادة تسمية', remove:'حذف',
    freeze_card:'تجميد', frozen:'مجمدة', active:'نشطة', report_lost:'تبليغ مفقود', lost_reported:'مفقودة/محجوبة',
    confirm_remove_card: 'حذف البطاقة؟',
    // Payments
    payment_methods:'طرق الدفع', add_payment_method:'إضافة طريقة دفع', method_name:'الاسم', last4:'آخر ٤', primary:'أساسية', set_primary:'تعيين كأَساسية', delete:'حذف',
    choose_method:'اختر الطريقة', topup_via:'تعبئة عبر', credit_card:'بطاقة ائتمان', debit_card:'بطاقة خصم', digital_wallet:'محفظة رقمية',
    // History / receipts
    history:'السجل', receipt:'الإيصال', export_csv:'تصدير CSV', add_ride:'إضافة رحلة', ride:'رحلة', topup:'تعبئة', from:'من', to:'إلى', fare:'الأجرة', time:'الوقت',
    on:'تشغيل', off:'إيقاف',
    parking_title:'عبقري المواقف', salik_title:'درع سالك', address_title:'إصلاح العنوان والتوصيل', tip_title:'إكرامية غير نقدية واضحة', onboarding_title:'مساعد البداية'
  }
};

export function useI18n() {
  const saved = localStorage.getItem('lang') || 'en';
  let lang = saved;
  const setLang = (l) => { lang = l; localStorage.setItem('lang', l); window.dispatchEvent(new CustomEvent('langchange')); };
  const t = (k, ...args) => {
    const v = dict[lang][k];
    return typeof v === 'function' ? v(...args) : v ?? k;
  };
  return { lang, setLang, t };
}
