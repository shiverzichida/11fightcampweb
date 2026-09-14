'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Calendar, ArrowRight, ShieldCheck, MapPin, MessageSquare, Award } from 'lucide-react';
import { GYM_INFO } from '@/lib/data';

export default function Hero() {
  const whatsappBookingUrl = `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
    'Halo 11 Fight Camp Pontianak! Saya ingin tanya jadwal kelas dan mencoba trial latihan.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-carbon pt-12 pb-20 md:pt-20 md:pb-28 border-b border-zinc-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              #1 Martial Arts & Combat Camp di Pontianak
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
              FORGE YOUR BODY. <br />
              <span className="text-gradient-red">MASTER</span> THE ART <br />
              OF COMBAT.
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Pelajari teknik beladiri sesungguhnya langsung dari petarung berpengalaman.
              Kelas <span className="text-white font-semibold">Muay Thai, Boxing, BJJ, dan MMA</span> terbuka
              untuk pemula, program fat loss, hingga persiapan atlet kompetisi.
            </p>

            {/* Address snippet */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-zinc-400">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Jl. Dr. Rubini No. 11, Akcaya, Pontianak Selatan</span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-base shadow-xl shadow-rose-900/40 hover:shadow-rose-900/70 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Calendar className="w-5 h-5" />
                BOOKING JADWAL KELAS
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-bold text-base transition-all hover:border-zinc-500"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Chat WhatsApp Admin
              </a>
            </div>

            {/* Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-800/80 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">4+</div>
                <div className="text-xs text-zinc-400 font-medium">Disiplin Bela Diri</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-rose-500">12+</div>
                <div className="text-xs text-zinc-400 font-medium">Sesi Tiap Minggu</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                <div className="text-xs text-zinc-400 font-medium">Beginner Friendly</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-900 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80"
                alt="11 Fight Camp Muay Thai Training"
                className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c] via-transparent to-black/30" />

              {/* Float badge 1 */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Sesi Terpopuler</span>
                  <p className="text-sm font-bold text-white">Muay Thai Striking & Sparring</p>
                  <p className="text-xs text-zinc-400">Setiap Senin, Rabu & Jumat sore</p>
                </div>
                <Link
                  href="/booking"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
                >
                  Daftar
                </Link>
              </div>

              {/* Top floating pill */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Pontianak Fight Team
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
