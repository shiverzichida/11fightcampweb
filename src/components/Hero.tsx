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
    <section className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden bg-black border-b border-zinc-800">
      {/* 1. Fullpage MMA Fight Camp Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ backgroundImage: "url('/hero-full-bg.jpg')" }}
      />

      {/* 2. Cinematic Lighting & Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090b]/90 via-[#08090b]/45 to-[#08090b]" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#08090b]/50 to-[#08090b]/95" />

      {/* Fire glow aura in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#ba2d1d]/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#ea580c]/20 blur-[130px] rounded-full pointer-events-none" />

      {/* 3. Hero Main Content (Centered & Immersive) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Official 11th Universe Logo with Burning Fire Glow Ring */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#ba2d1d] via-[#ea580c] to-[#f59e0b] opacity-80 blur-md group-hover:opacity-100 animate-pulse transition duration-500" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-[#ba2d1d] bg-black shadow-2xl p-0.5">
            <img
              src="/logo.png"
              alt="11th Universe MMA Official Emblem"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* City & Camp Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#ba2d1d] text-zinc-200 text-xs font-black uppercase tracking-wider mb-5 shadow-lg shadow-[#ba2d1d]/40">
          <Flame className="w-4 h-4 text-[#d63725] animate-pulse" />
          <span>11th Universe MMA • Sasana Bela Diri Pontianak</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-2xl max-w-4xl">
          FORGE YOUR BODY. <br />
          <span className="text-gradient-red">MASTER THE ART</span> <br />
          OF COMBAT.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-zinc-200 max-w-2xl leading-relaxed font-medium drop-shadow-md">
          Sasana bela diri & MMA terlengkap di Pontianak. Fasilitas oktagon cage, ring tinju, dan matras grappling.
          Kelas <strong className="text-white">Muay Thai, Boxing, BJJ, & MMA</strong> terbuka untuk pemula hingga atlet.
        </p>

        {/* Address snippet */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-zinc-800 text-xs text-zinc-300">
          <MapPin className="w-4 h-4 text-[#ba2d1d] shrink-0" />
          <span>Jl. Dr. Rubini No. 11, Akcaya, Pontianak Selatan</span>
        </div>

        {/* Burning Fire CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl btn-fire text-white font-black text-base tracking-wide transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-5 h-5" />
            BOOKING JADWAL KELAS
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-black/85 hover:bg-zinc-900 border border-[#ba2d1d]/60 text-zinc-100 font-bold text-base backdrop-blur-md transition-all hover:border-[#ba2d1d] hover:scale-105 shadow-xl shadow-black/80"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            Tanya Admin via WhatsApp
          </a>
        </div>
      </div>

      {/* 4. Bottom Floating Stats Bar (With Fire Glow Borders) */}
      <div className="relative z-10 w-full bg-gradient-to-t from-[#08090b] via-[#08090b]/85 to-transparent pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-zinc-800 text-center hover:border-[#ba2d1d] card-fire-hover transition-all">
              <div className="text-2xl sm:text-3xl font-black text-white">4+</div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Disiplin Bela Diri
              </div>
            </div>

            {/* Featured Burning Flame Card */}
            <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-md card-fire text-center transition-all">
              <div className="text-2xl sm:text-3xl font-black text-[#d63725]">12+</div>
              <div className="text-xs text-zinc-200 font-bold uppercase tracking-wider mt-0.5">
                Sesi Kelas Mingguan
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-zinc-800 text-center hover:border-[#ba2d1d] card-fire-hover transition-all">
              <div className="text-2xl sm:text-3xl font-black text-[#ea580c]">100%</div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Pemula Friendly
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-zinc-800 text-center hover:border-[#ba2d1d] card-fire-hover transition-all">
              <div className="text-2xl sm:text-3xl font-black text-zinc-100">Cage & Ring</div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Fasilitas Lengkap
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
