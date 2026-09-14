'use client';

import React from 'react';
import Image from 'next/image';
import { INITIAL_TRAINERS } from '@/lib/data';
import { Award, ShieldCheck } from 'lucide-react';

export default function Trainers() {
  return (
    <section id="coaches" className="py-20 bg-[#090a0c] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Tim Instruktur & Coach
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            DILATIH OLEH <span className="text-gradient-red">PETARUNG ASLI</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">
            Instruktur 11 Fight Camp memiliki latar belakang kompetisi dan dedikasi mengajar teknik yang benar serta keselamatan latihan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {INITIAL_TRAINERS.map((coach) => (
            <div
              key={coach.id}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-xl hover:shadow-black/50 flex flex-col group"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={coach.photoUrl}
                  alt={coach.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 px-3 py-1 rounded-lg text-xs font-bold bg-black/80 backdrop-blur-md text-amber-400 border border-amber-900/50">
                  {coach.role}
                </span>
              </div>

              {/* Bio & Achievements */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                    {coach.name}
                  </h3>
                  <p className="text-xs font-semibold text-rose-500 mt-1 uppercase tracking-wider">
                    {coach.specialty}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {coach.achievements.map((ach, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {ach}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
