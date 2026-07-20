import React from 'react'
import {Newspaper} from 'lucide-react'
import {NewsItem} from '../data/news'

interface NewsSectionProps {
  currentLang: 'uk' | 'en'
  news: NewsItem[]
}

export default function NewsSection({currentLang, news}: NewsSectionProps) {
  if (!news.length) return null

  return (
    <section
      id="news"
      className="scroll-mt-24 py-6 lg:py-8 bg-transparent border-y border-brand-slate-200/20 dark:border-brand-slate-850/20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10 space-y-4">
          <h2 className="text-xs font-mono font-bold tracking-widest text-brand-blue-500 dark:text-brand-sky-300 uppercase">
            {currentLang === 'uk' ? 'Новини' : 'News'}
          </h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-brand-slate-900 dark:text-white tracking-tight">
            {currentLang === 'uk' ? 'Останні повідомлення' : 'Latest updates'}
          </p>
          <div className="h-1 w-12 bg-brand-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((item) => (
            <article
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden border border-brand-slate-200/50 dark:border-brand-slate-800/20 flex flex-col"
            >
              {item.coverImageUrl ? (
                <div className="aspect-[16/9] overflow-hidden bg-brand-slate-100 dark:bg-brand-slate-950">
                  <img
                    src={item.coverImageUrl}
                    alt={item.title[currentLang]}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] flex items-center justify-center bg-brand-blue-50/50 dark:bg-brand-blue-950/20">
                  <Newspaper className="w-8 h-8 text-brand-blue-500/40" />
                </div>
              )}
              <div className="p-5 space-y-2 flex-1 flex flex-col text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-slate-500">
                  {item.publishedAt.slice(0, 10)}
                </span>
                <h3 className="font-display font-bold text-brand-slate-900 dark:text-white leading-snug">
                  {item.title[currentLang]}
                </h3>
                {item.excerpt[currentLang] && (
                  <p className="text-xs text-brand-slate-600 dark:text-brand-slate-400 leading-relaxed line-clamp-3">
                    {item.excerpt[currentLang]}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
