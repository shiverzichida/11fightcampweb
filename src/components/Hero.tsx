'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Calendar, ArrowRight, MapPin, MessageSquare } from 'lucide-react';
import { GYM_INFO } from '@/lib/data';

export default function Hero() {
  const whatsappBookingUrl = `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
    'Halo 11 Fight Camp Pontianak! Saya ingin tanya jadwal kelas dan mencoba trial latihan.'
  )}`;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-black border-b border-zinc-800 w-full">
      {/* 1. Fullpage MMA Fight Camp Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ backgroundImage: "url('/hero-full-bg.jpg')" }}
      />

      {/* 2. Cinematic Lighting & Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090b]/90 via-[#08090b]/50 to-[#08090b]" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#08090b]/55 to-[#08090b]/95" />

      {/* Fire glow aura in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[300px] bg-[#ba2d1d]/25 blur-[140px] rounded-full pointer-events-none" />

      {/* 3. Hero Main Content (Centered & Immersive) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 flex-1 flex flex-col items-center justify-center text-center w-full">
        
        {/* Official 11th Universe Logo with Burning Fire Glow Ring */}
        <div className="mb-4 sm:mb-6 relative group">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#ba2d1d] via-[#ea580c] to-[#f59e0b] opacity-80 blur-md group-hover:opacity-100 animate-pulse transition duration-500" />
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 sm:border-3 border-[#ba2d1d] bg-black shadow-2xl p-0.5">
            <img
              src="/logo.png"
              alt="11th Universe MMA Official Emblem"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* City & Camp Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#ba2d1d] text-zinc-200 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-5 shadow-lg shadow-[#ba2d1d]/40 max-w-full">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d63725] animate-pulse shrink-0" />
          <span className="truncate">11th Universe MMA • Pontianak</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.1] drop-shadow-2xl max-w-4xl px-2">
          FORGE YOUR BODY. <br />
          <span className="text-gradient-red">MASTER THE ART</span> <br />
          OF COMBAT.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-200 max-w-2xl leading-relaxed font-medium drop-shadow-md px-2">
          Sasana bela diri & MMA terlengkap di Pontianak. Fasilitas oktagon cage, ring tinju, dan matras grappling.
          Kelas <strong className="text-white">Striking, BJJ, Hyrox, & Kids</strong> terbuka untuk semua level.
        </p>

        {/* Address snippet */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-zinc-800 text-[11px] sm:text-xs text-zinc-300 max-w-full">
          <MapPin className="w-3.5 h-3.5 text-[#ba2d1d] shrink-0" />
          <span className="truncate">Jl. Dr. Rubini No. 11, Akcaya, Pontianak Selatan</span>
        </div>

        {/* Burning Fire CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl btn-fire text-white font-black text-sm sm:text-base tracking-wide transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            BOOKING JADWAL KELAS
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-black/85 hover:bg-zinc-900 border border-[#ba2d1d]/60 text-zinc-100 font-bold text-sm sm:text-base backdrop-blur-md transition-all hover:border-[#ba2d1d] hover:scale-105 shadow-xl"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            Tanya Admin via WhatsApp
          </a>
        </div>
      </div>

      {/* 4. Bottom Floating Stats Bar (Responsive Mobile Grid) */}
      <div className="relative z-10 w-full bg-gradient-to-t from-[#08090b] via-[#08090b]/85 to-transparent pt-3 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-zinc-800 text-center hover:border-[#ba2d1d] card-fire-hover transition-all">
              <div className="text-xl sm:text-3xl font-black text-white">5+</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Disiplin Bela Diri
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-black/80 backdrop-blur-md card-fire text-center transition-all">
              <div className="text-xl sm:text-3xl font-black text-[#d63725]">15+</div>
              <div className="text-[10px] sm:text-xs text-zinc-200 font-bold uppercase tracking-wider mt-0.5">
                Sesi Kelas Mingguan
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-zinc-800 text-center hover:border-[#ba2d1d] card-fire-hover transition-all">
              <div className="text-xl sm:text-3xl font-black text-[#ea580c]">100%</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Pemula Friendly
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-zinc-800 text-center hover:border-[#ba2d1d] card-fire-hover transition-all">
              <div className="text-xl sm:text-3xl font-black text-zinc-100">Cage & Ring</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Fasilitas Lengkap
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
