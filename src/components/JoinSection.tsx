import React, { useState } from 'react';
import { ClipboardCheck, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { addJoinRequest } from '../data/submissions';

interface JoinSectionProps {
  currentLang: 'uk' | 'en';
}

export default function JoinSection({ currentLang }: JoinSectionProps) {
  const t = TRANSLATIONS[currentLang];

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [activityField, setActivityField] = useState('');
  const [edrpou, setEdrpou] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  // Status states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!companyName.trim()) tempErrors.companyName = t.field_required;
    if (!activityField.trim()) tempErrors.activityField = t.field_required;
    if (!contactPerson.trim()) tempErrors.contactPerson = t.field_required;
    
    // Email regex
    if (!email.trim()) {
      tempErrors.email = t.field_required;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = t.invalid_email;
    }

    // Phone simple check
    if (!phone.trim()) {
      tempErrors.phone = t.field_required;
    } else if (phone.length < 9) {
      tempErrors.phone = t.invalid_phone;
    }

    if (!consent) tempErrors.consent = currentLang === 'uk' ? 'Потрібно надати згоду' : 'Consent is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormError('');
    setIsSubmitting(true);
    const hp =
      (e.currentTarget.elements.namedItem('hp') as HTMLInputElement | null)?.value?.toString() ||
      '';

    const payloadBase = {
      companyName,
      website,
      activityField,
      contactPerson,
      email,
      phone,
      message,
      edrpou,
    };

    try {
      let savedRemotely = false;
      const payloadForServer = {...payloadBase, consent, hp};
      const payloadForLocal = payloadBase;

      try {
        const res = await fetch('/api/join', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payloadForServer),
        });
        if (res.ok) {
          savedRemotely = true;
        } else {
          const data = await res.json().catch(() => null);
          if (import.meta.env.PROD) {
            throw new Error(data?.error || 'Request rejected');
          }
        }
      } catch (err) {
        // offline / local dev without API
        if (import.meta.env.PROD) {
          setFormError(
            currentLang === 'uk'
              ? 'Не вдалося надіслати заявку. Спробуйте пізніше.'
              : 'Failed to submit request. Try later.'
          )
          return
        }
      }

      if (!savedRemotely) {
        addJoinRequest(payloadForLocal);
      }

      setIsSuccess(true);
      setCompanyName('');
      setWebsite('');
      setActivityField('');
      setEdrpou('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setMessage('');
      setConsent(false);
      setErrors({});
      setFormError('');
    } catch (err) {
      console.error('Failed to submit join request', err);
      if (import.meta.env.PROD) {
        setFormError(
          currentLang === 'uk'
            ? 'Не вдалося надіслати заявку. Спробуйте пізніше.'
            : 'Failed to submit request. Try later.'
        )
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join" className="scroll-mt-24 py-6 lg:py-8 bg-transparent border-y border-brand-slate-200/20 dark:border-brand-slate-850/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10 space-y-4">
          <h2 className="text-xs font-mono font-bold tracking-widest text-brand-blue-500 dark:text-brand-sky-300 uppercase">
            {currentLang === 'uk' ? 'Як вступити' : 'Membership Onboarding'}
          </h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-brand-slate-900 dark:text-white tracking-tight">
            {t.join_title}
          </p>
          <div className="h-1 w-12 bg-brand-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Requirements and Benefits */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Requirements card */}
            <div className="rounded-2xl glass-card p-6 shadow-sm">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-brand-blue-600 dark:text-brand-sky-300 mb-4 flex items-center space-x-2">
                <ClipboardCheck className="w-4.5 h-4.5" />
                <span>{t.join_reqs_title}</span>
              </h3>
              <ul className="space-y-3">
                {[t.join_req_1, t.join_req_2, t.join_req_3, t.join_req_4].map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-brand-slate-700 dark:text-brand-slate-300">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-brand-blue-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits card */}
            <div className="rounded-2xl glass-card p-6 shadow-sm">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-brand-blue-600 dark:text-brand-sky-300 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-brand-yellow-400" />
                <span>{t.join_benefits_title}</span>
              </h3>
              <ul className="space-y-3">
                {[t.join_benefit_1, t.join_benefit_2, t.join_benefit_3, t.join_benefit_4].map((ben, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-brand-slate-700 dark:text-brand-slate-300">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-brand-yellow-400 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl glass-card p-8 shadow-lg text-left">
              
              <h3 className="text-xl font-display font-bold text-brand-slate-900 dark:text-white mb-6">
                {t.join_form_title}
              </h3>

              {isSuccess ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-6 space-y-4 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {t.join_form_success}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 px-5 py-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50"
                  >
                    {currentLang === 'uk' ? 'Надіслати ще одну' : 'Submit another request'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot: bots that auto-fill will typically populate it. */}
                  <input
                    type="text"
                    name="hp"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                  
                  {/* Row 1: Org name & Web */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                        {t.join_form_name_lbl} *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors ${
                          errors.companyName ? 'border-red-500' : 'border-brand-slate-200 dark:border-brand-slate-800'
                        }`}
                      />
                      {errors.companyName && <span className="text-[10px] text-red-500 block">{errors.companyName}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                        {t.join_form_website_lbl}
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none border-brand-slate-200 dark:border-brand-slate-800 focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Field of Activity & EDRPOU */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                        {t.join_form_field_lbl} *
                      </label>
                      <input
                        type="text"
                        placeholder={currentLang === 'uk' ? 'напр. Засоби індивідуального захисту' : 'e.g. PPE supply'}
                        value={activityField}
                        onChange={(e) => setActivityField(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors ${
                          errors.activityField ? 'border-red-500' : 'border-brand-slate-200 dark:border-brand-slate-800'
                        }`}
                      />
                      {errors.activityField && <span className="text-[10px] text-red-500 block">{errors.activityField}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase" title="ЄДРПОУ">
                        {t.join_form_edrpou_lbl}
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        value={edrpou}
                        onChange={(e) => setEdrpou(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none border-brand-slate-200 dark:border-brand-slate-800 focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Contact Person */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                      {t.join_form_person_lbl} *
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors ${
                        errors.contactPerson ? 'border-red-500' : 'border-brand-slate-200 dark:border-brand-slate-800'
                      }`}
                    />
                    {errors.contactPerson && <span className="text-[10px] text-red-500 block">{errors.contactPerson}</span>}
                  </div>

                  {/* Row 4: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                        {t.join_form_email_lbl} *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-brand-slate-200 dark:border-brand-slate-800'
                        }`}
                      />
                      {errors.email && <span className="text-[10px] text-red-500 block">{errors.email}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                        {t.join_form_phone_lbl} *
                      </label>
                      <input
                        type="tel"
                        placeholder="+380"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-brand-slate-200 dark:border-brand-slate-800'
                        }`}
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 block">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-brand-slate-500 dark:text-brand-slate-400 uppercase">
                      {t.join_form_msg_lbl}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-lg border text-xs bg-brand-slate-50 dark:bg-brand-slate-950 dark:text-white outline-none border-brand-slate-200 dark:border-brand-slate-800 focus:bg-white dark:focus:bg-brand-slate-900 focus:border-brand-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div className="space-y-1">
                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-brand-slate-300 text-brand-blue-500 focus:ring-brand-blue-500"
                      />
                      <span className="text-[11px] text-brand-slate-600 dark:text-brand-slate-400 leading-snug">
                        {t.join_form_consent}
                      </span>
                    </label>
                    {errors.consent && <span className="text-[10px] text-red-500 block">{errors.consent}</span>}
                  </div>

                  {/* Submit Button */}
                  {formError && (
                    <div className="text-[10px] text-red-500 font-mono pt-2" role="alert">
                      {formError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 active:bg-brand-blue-700 disabled:bg-brand-slate-400 text-white font-medium text-xs text-center shadow-md transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        <span>{currentLang === 'uk' ? 'Надсилання...' : 'Sending...'}</span>
                      </span>
                    ) : (
                      <span>{t.btn_submit_app}</span>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
