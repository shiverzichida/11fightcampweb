'use client';

import React from 'react';
import Link from 'next/link';
import { MEMBERSHIP_PLANS, GYM_INFO } from '@/lib/data';
import { Check, Flame, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-carbon border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            Investasi Kebugaran & Bela Diri
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            PAKET & <span className="text-gradient-red">BIAYA MEMBER</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">
            Tanpa biaya registrasi tersembunyi. Pilih paket sesuai kebutuhan dan rutinitas latihan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isPopular = plan.isPopular;
            const waPlanUrl = `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
              `Halo Admin 11th Universe MMA, saya ingin daftar membership paket [${plan.title} - Rp ${plan.price.toLocaleString(
                'id-ID'
              )}]. Mohon info pendaftarannya.`
            )}`;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-zinc-900 to-black card-fire lg:-translate-y-2.5 z-10'
                    : 'bg-zinc-900/80 border border-zinc-800 card-fire-hover hover:border-zinc-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full btn-fire text-white font-black text-[11px] uppercase tracking-wider shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-white mt-1">{plan.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[36px] leading-relaxed font-medium">
                    {plan.subtitle}
                  </p>

                  <div className="my-6 pb-6 border-b border-zinc-800">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      Rp {plan.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-zinc-400 block mt-1 font-semibold">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#ba2d1d] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6">
                  {plan.id === 'drop-in' ? (
                    <Link
                      href="/booking"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl btn-fire text-white font-black text-xs transition-all active:scale-95 shadow-md"
                    >
                      Booking Sesi Drop-in
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={waPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                        isPopular
                          ? 'btn-fire text-white shadow-xl'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-[#ba2d1d]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      Pilih & Hubungi Admin
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
