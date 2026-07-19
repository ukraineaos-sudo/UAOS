import React, { useState } from 'react';
import { ArrowLeft, Globe, Phone, Mail, Award, CheckCircle, Briefcase, Tag, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { AssociationMember } from '../types';
import { renderMemberName } from './MembersCarousel';

interface MemberProfileProps {
  currentLang: 'uk' | 'en';
  member: AssociationMember;
  onBack: () => void;
}

export default function MemberProfile({ currentLang, member, onBack }: MemberProfileProps) {
  const [legalOpen, setLegalOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  return (
    <article className="pt-24 pb-20 bg-transparent min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-brand-slate-500 hover:text-brand-blue-500 uppercase tracking-wider mb-8 focus:outline-none cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t.profile_back}</span>
        </button>

        {/* Hero banner block */}
        <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 shadow-lg mb-8 border border-brand-slate-100 dark:border-brand-slate-800/40">
          {member.coverImageUrl ? (
            <img
              src={member.coverImageUrl}
              alt={member.name[currentLang]}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 bg-grid-pattern opacity-50 bg-brand-slate-100 dark:bg-brand-slate-950"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-slate-950 via-brand-slate-950/40 to-transparent"></div>

          {/* Core titles overlay */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider bg-brand-blue-500 text-white">
                {member.category[currentLang]}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                {renderMemberName(member.name[currentLang])}
              </h1>
            </div>

            {/* Logo box */}
            <div className="shrink-0 self-start md:self-end bg-white dark:bg-brand-slate-900 p-3 rounded-2xl shadow-xl border border-white/20">
              <span className="block font-display font-black text-lg tracking-tighter text-brand-blue-600 dark:text-brand-sky-300">
                {member.shortName}
              </span>
            </div>
          </div>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main column */}
          <div className="lg:col-span-8 space-y-8 text-left">
            
            {/* Full description */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-brand-slate-900 dark:text-white border-b border-brand-slate-100 dark:border-brand-slate-800 pb-2">
                {currentLang === 'uk' ? 'Про компанію' : 'Company Overview'}
              </h2>
              <p className="text-sm sm:text-base text-brand-slate-700 dark:text-brand-slate-300 leading-relaxed font-sans">
                {member.fullDescription[currentLang]}
              </p>
            </div>

            {/* EXTENDED SPECIFIC MODULES */}
            {member.profileLevel === 'extended' && (
              <>
                {/* Competencies */}
                {member.competencies && member.competencies.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-brand-blue-500 shrink-0" />
                      <span>{t.profile_competencies}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {member.competencies.map((comp, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl glass-pill flex items-start space-x-3"
                        >
                          <CheckCircle className="w-4 h-4 text-brand-blue-500 mt-0.5 shrink-0" />
                          <span className="text-xs font-semibold text-brand-slate-700 dark:text-brand-slate-200">
                            {comp[currentLang]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {member.services && member.services.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-brand-blue-500 shrink-0" />
                      <span>{t.profile_services}</span>
                    </h2>
                    <ul className="space-y-2.5">
                      {member.services.map((serv, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-xs text-brand-slate-600 dark:text-brand-slate-400">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-blue-500 mt-1.5 shrink-0"></span>
                          <span className="font-sans leading-relaxed">{serv[currentLang]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Products */}
                {member.products && member.products.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-brand-blue-500 shrink-0" />
                      <span>{t.profile_products}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {member.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-5 rounded-2xl glass-card flex flex-col justify-between hover:border-brand-blue-500/30 transition-all duration-200 text-left"
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-brand-slate-900 dark:text-white">
                              {prod.name[currentLang]}
                            </h3>
                            <p className="text-xs text-brand-slate-500 dark:text-brand-slate-400">
                              {prod.description[currentLang]}
                            </p>
                          </div>
                          {prod.price && (
                            <div className="mt-4 pt-2 border-t border-brand-slate-100 dark:border-brand-slate-800 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-brand-slate-400 uppercase font-semibold">Вартість</span>
                              <span className="text-xs font-mono font-bold text-brand-blue-500 dark:text-brand-sky-300">
                                {prod.price}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cases */}
                {member.cases && member.cases.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white flex items-center space-x-2">
                      <Award className="w-5 h-5 text-brand-blue-500 shrink-0" />
                      <span>{t.profile_cases}</span>
                    </h2>
                    <div className="space-y-4">
                      {member.cases.map((cs) => (
                        <div
                          key={cs.id}
                          className="p-5 rounded-2xl glass-card shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-4 text-left"
                        >
                          {cs.imageUrl && (
                            <div className="sm:col-span-4 aspect-[4/3] rounded-xl overflow-hidden bg-brand-slate-100">
                              <img src={cs.imageUrl} alt={cs.title[currentLang]} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className={`space-y-2 ${cs.imageUrl ? 'sm:col-span-8' : 'sm:col-span-12'}`}>
                            <h3 className="text-sm font-bold text-brand-slate-900 dark:text-white">
                              {cs.title[currentLang]}
                            </h3>
                            <p className="text-xs text-brand-slate-500 dark:text-brand-slate-400 leading-relaxed">
                              {cs.description[currentLang]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {member.certificates && member.certificates.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-brand-blue-500 shrink-0" />
                      <span>{t.profile_certificates}</span>
                    </h2>
                    <div className="space-y-2">
                      {member.certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-3.5 rounded-xl glass-pill flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-brand-blue-500" />
                            <span className="text-xs font-semibold text-brand-slate-700 dark:text-brand-slate-300">
                              {cert.title[currentLang]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Legal Information Toggle (Section 16) */}
            <div className="pt-4 border-t border-brand-slate-100 dark:border-brand-slate-800">
              <button
                onClick={() => setLegalOpen(!legalOpen)}
                className="flex items-center justify-between w-full p-4 rounded-xl glass-pill hover:border-brand-blue-500 dark:hover:border-brand-sky-300 transition-all text-xs font-mono font-bold text-brand-slate-600 dark:text-brand-slate-300 uppercase cursor-pointer"
              >
                <span>{t.profile_legal_title}</span>
                {legalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {legalOpen && (
                <div className="p-4 glass-card rounded-b-xl text-left space-y-3">
                  <p className="text-xs text-brand-slate-500 dark:text-brand-slate-400 italic">
                    * {t.profile_legal_disclaimer}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-brand-slate-500 dark:text-brand-slate-400 font-mono">
                    <div>
                      <span className="block text-brand-slate-400 text-[10px] uppercase font-bold">Юридичний статус</span>
                      <span className="font-semibold">{member.name.uk}</span>
                    </div>
                    <div>
                      <span className="block text-brand-slate-400 text-[10px] uppercase font-bold">Оновлено адміністрацією</span>
                      <span className="font-semibold">{member.lastUpdated || '2026-07'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar Contacts column */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="rounded-2xl glass-card p-6 shadow-md text-left space-y-6">
              
              <h3 className="text-base font-display font-bold text-brand-slate-900 dark:text-white uppercase tracking-wider font-semibold border-b border-brand-slate-100 dark:border-brand-slate-800 pb-2">
                {currentLang === 'uk' ? 'Контакти учасника' : 'Member Contacts'}
              </h3>

              <div className="space-y-4">
                {/* Website */}
                {member.websiteUrl && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-brand-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-bold">Офіційний сайт</span>
                      <a
                        href={member.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-blue-500 dark:text-brand-sky-300 hover:underline flex items-center space-x-1"
                      >
                        <span>{member.websiteUrl.replace('https://', '').replace('/', '')}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {member.publicEmail && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-brand-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-bold">E-mail</span>
                      <a href={`mailto:${member.publicEmail}`} className="text-xs font-semibold text-brand-slate-700 dark:text-brand-slate-300 hover:text-brand-blue-500">
                        {member.publicEmail}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {member.publicPhone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-brand-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-bold">Телефон</span>
                      <a href={`tel:${member.publicPhone}`} className="text-xs font-semibold text-brand-slate-700 dark:text-brand-slate-300 hover:text-brand-blue-500">
                        {member.publicPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action trigger website */}
              {member.websiteUrl && (
                <div className="pt-4">
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white font-medium text-xs text-center shadow-sm hover:shadow transition-all"
                  >
                    {t.profile_visit_site}
                  </a>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </article>
  );
}
