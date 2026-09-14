'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_CLASSES } from '@/lib/data';
import { Flame, Clock, CheckCircle2, Shield, Dumbbell, ArrowRight } from 'lucide-react';
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
    <section id="programs" className="py-20 bg-[#090a0c] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            Disiplin Beladiri & Kebugaran
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            PILIH PROGRAM <span className="text-gradient-red">LATIHAN ANDA</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">
            Dirancang dari kurikulum bertahap. Anda tidak perlu pengalaman bertarung sebelumnya untuk bergabung di 11 Fight Camp.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 scale-105'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
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
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-xl hover:shadow-black/50 flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/70 backdrop-blur-md text-rose-400 border border-rose-900/50">
                  {item.intensity}
                </span>
                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {item.durationMinutes} Menit / Sesi
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
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
                        <CheckCircle2 className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-3">
                  <Link
                    href={`/booking?category=${item.category}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-600 text-white font-bold text-xs transition-colors border border-zinc-700/60 hover:border-rose-500"
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
