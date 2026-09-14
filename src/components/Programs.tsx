'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_CLASSES } from '@/lib/data';
import { Flame, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Category } from '@/lib/types';

export default function Programs() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Semua Program' },
    { id: 'muay-thai', label: 'Muay Thai' },
    { id: 'boxing', label: 'Boxing' },
    { id: 'bjj', label: 'BJJ (Jiu-Jitsu)' },
    { id: 'mma', label: 'MMA' },
    { id: 'conditioning', label: 'Conditioning' },
    { id: 'private', label: 'Private 1-on-1' },
  ];

  const filteredClasses =
    activeCategory === 'all'
      ? INITIAL_CLASSES
      : INITIAL_CLASSES.filter((c) => c.category === activeCategory);

  return (
    <section id="programs" className="py-20 bg-[#08090b] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-[#ea580c] animate-pulse" />
            Disiplin Beladiri & Kebugaran
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            PILIH PROGRAM <span className="text-gradient-red">LATIHAN ANDA</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">
            Dirancang dari kurikulum bertahap. Anda tidak perlu pengalaman bertarung sebelumnya untuk bergabung di 11th Universe MMA.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeCategory === cat.id
                    ? 'btn-fire text-white shadow-lg scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800/80 overflow-hidden card-fire-hover transition-all hover:shadow-2xl flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-black bg-[#ba2d1d]/85 backdrop-blur-md text-white border border-[#ea580c]/50 shadow-md">
                  {item.intensity}
                </span>
                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs text-zinc-200 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                  {item.durationMinutes} Menit / Sesi
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#d63725] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Manfaat Utama:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {item.benefits.slice(0, 4).map((b, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                        <CheckCircle2 className="w-3 h-3 text-[#ba2d1d] shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-3">
                  <Link
                    href={`/booking?category=${item.category}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl btn-fire text-white font-black text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-md"
                  >
                    Booking Kelas Ini
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
