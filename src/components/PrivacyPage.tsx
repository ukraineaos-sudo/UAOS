import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface PrivacyPageProps {
  currentLang: 'uk' | 'en';
  onBack: () => void;
}

export default function PrivacyPage({ currentLang, onBack }: PrivacyPageProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <article className="pt-24 pb-20 bg-transparent min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-brand-slate-500 hover:text-brand-blue-500 uppercase tracking-wider mb-2 focus:outline-none cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{currentLang === 'uk' ? 'Повернутися' : 'Back to Home'}</span>
        </button>

        {/* Header Title */}
        <div className="space-y-3 border-b border-brand-slate-100 dark:border-brand-slate-800 pb-4">
          <div className="inline-flex items-center space-x-2 text-brand-blue-500 bg-brand-blue-50 dark:bg-brand-blue-950/40 px-3 py-1.5 rounded-full">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
              {currentLang === 'uk' ? 'ЗАХИСТ ДАНИХ' : 'DATA PROTECTION'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-slate-900 dark:text-white leading-tight">
            {t.privacy_title}
          </h1>
          <p className="text-xs font-mono text-brand-slate-400">
            {t.privacy_last_updated}
          </p>
        </div>

        {/* Content Details wrapped in Glass panel */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl shadow-lg space-y-8 text-sm sm:text-base text-brand-slate-700 dark:text-brand-slate-300 leading-relaxed font-sans">
          {currentLang === 'uk' ? (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">1. Загальні положення</h2>
                <p>
                  Ця Політика конфіденційності регулює порядок збору, зберігання, використання та захисту персональних даних, що надаються користувачами під час взаємодії з веб-сайтом Громадської спілки «Українська Асоціація Професійної Безпеки» (UAOS).
                </p>
                <p>
                  Ми з повагою ставимося до конфіденційної інформації кожного користувача нашого ресурсу і прагнемо захистити ваші приватні відомості відповідно до чинного законодавства України та стандартів GDPR.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">2. Які персональні дані ми збираємо</h2>
                <p>
                  Ми збираємо персональні дані, які ви надаєте добровільно заповнюючи інтерактивні форми вступу до спілки («Стати членом») або форми зворотного зв’язку:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Назва організації або компанії;</li>
                  <li>Сфера діяльності та посилання на офіційний сайт;</li>
                  <li>Прізвище, ім’я та по батькові контактної особи;</li>
                  <li>Адреса електронної пошти;</li>
                  <li>Номер контактного телефону;</li>
                  <li>Код ЄДРПОУ організації (якщо зазначено, виключно для цілей внутрішньої перевірки даних).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">3. Мета збору та використання даних</h2>
                <p>
                  Зібрані відомості використовуються виключно для:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Розгляду та валідації вашої заявки на вступ до членів Громадської спілки «УАПБ»;</li>
                  <li>Надання зворотного зв’язку, відповідей на ваші запитання та запити;</li>
                  <li>Проведення інформаційних комунікацій стосовно статусу заявки або діяльності UAOS;</li>
                  <li>Запобігання шахрайству та підтримання загальної технічної безпеки нашого сайту.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">4. Зберігання та безпека даних</h2>
                <p>
                  Усі отримані дані надійно захищені. Ми застосовуємо відповідні технічні та адміністративні заходи безпеки, щоб запобігти несанкціонованому доступу, зміні, розголошенню чи знищенню ваших персональних даних. Персональні реквізити (такі як код ЄДРПОУ чи внутрішній телефон) ніколи не публікуються у відкритому доступі.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">5. Зміни до Політики конфіденційності</h2>
                <p>
                  Ми залишаємо за собою право вносити зміни до цієї Політики конфіденційності в будь-який час. Рекомендуємо періодично переглядати цю сторінку для ознайомлення з актуальною інформацією.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">1. General Provisions</h2>
                <p>
                  This Privacy Policy regulates the collection, storage, processing, and protection of personal data provided by users during interaction with the website of the Public Union "Ukrainian Association of Occupational Safety" (UAOS).
                </p>
                <p>
                  We treat the confidential information of every user of our resource with respect and strive to protect your private data in accordance with current legislation of Ukraine and GDPR standards.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">2. What Personal Data We Collect</h2>
                <p>
                  We collect personal data that you provide voluntarily by filling out interactive membership registration forms ("Become a Member") or feedback contact forms:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Organization or company name;</li>
                  <li>Core activity field and official website URL;</li>
                  <li>Full name of the designated contact person;</li>
                  <li>Email address;</li>
                  <li>Contact phone number;</li>
                  <li>EDRPOU legal code of the organization (if specified, solely for the purpose of internal data verification).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">3. Purpose of Collection and Use of Data</h2>
                <p>
                  The collected information is used exclusively to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Consider and validate your application for membership in the UAOS Public Union;</li>
                  <li>Provide feedback and answers to your general requests and inquiries;</li>
                  <li>Coordinate informational communications regarding application statuses or UAOS activities;</li>
                  <li>Prevent fraud and maintain the general technical security of our website.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">4. Data Storage and Security</h2>
                <p>
                  All received data is securely protected. We apply appropriate technical and administrative security measures to prevent unauthorized access, alteration, disclosure, or destruction of your personal data. Private credentials (such as EDRPOU code or internal telephone coordinates) are never published in open public view.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">5. Changes to the Privacy Policy</h2>
                <p>
                  We reserve the right to amend this Privacy Policy at any time. We recommend reviewing this page periodically to keep yourself acquainted with up-to-date data handling conditions.
                </p>
              </section>
            </>
          )}
        </div>

      </div>
    </article>
  );
}
