'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Calendar, ArrowRight, MapPin, MessageSquare, Shield, Trophy, Users, ChevronDown } from 'lucide-react';
import { GYM_INFO } from '@/lib/data';

export default function Hero() {
  const whatsappBookingUrl = `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
    'Halo 11 Fight Camp Pontianak! Saya ingin tanya jadwal kelas dan mencoba trial latihan.'
  )}`;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-black border-b border-zinc-800">
      {/* 1. Fullpage MMA Fight Camp Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ backgroundImage: "url('/hero-full-bg.jpg')" }}
      />

      {/* 2. Cinematic Lighting & Gradient Overlays for High Legibility */}
      {/* Top gradient for navbar seamless blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090a0c]/90 via-[#090a0c]/40 to-[#090a0c]" />
      
      {/* Center atmospheric vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#090a0c]/50 to-[#090a0c]/95" />

      {/* Subtle combat glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-rose-600/15 blur-[150px] rounded-full pointer-events-none" />

      {/* 3. Hero Main Content (Centered & Immersive) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* City & Camp Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-rose-500/50 text-rose-300 text-xs font-black uppercase tracking-wider mb-6 shadow-xl shadow-rose-950/40 animate-in fade-in slide-in-from-top-4 duration-500">
          <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Sasana Bela Diri & MMA #1 di Pontianak</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-2xl max-w-4xl">
          FORGE YOUR BODY. <br />
          <span className="text-gradient-red">MASTER THE ART</span> <br />
          OF COMBAT.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed font-medium drop-shadow-md">
          Latihan di sasana bela diri terlengkap di Pontianak. Fasilitas oktagon cage, ring tinju, dan matras grappling.
          Kelas <strong className="text-white">Muay Thai, Boxing, BJJ, & MMA</strong> terbuka untuk semua level dari pemula hingga atlet.
        </p>

        {/* Location Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm border border-zinc-800 text-xs text-zinc-300">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Jl. Dr. Rubini No. 11, Akcaya, Pontianak Selatan</span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-base shadow-2xl shadow-rose-900/60 hover:shadow-rose-800/80 hover:scale-105 active:scale-95 transition-all"
          >
            <Calendar className="w-5 h-5" />
            BOOKING JADWAL KELAS
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-black/80 hover:bg-zinc-900 border border-zinc-700 text-zinc-100 font-bold text-base backdrop-blur-md transition-all hover:border-zinc-500 hover:scale-105 shadow-xl"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            Tanya Admin via WhatsApp
          </a>
        </div>
      </div>

      {/* 4. Bottom Floating Stats Bar (Transparent Glassmorphism) */}
      <div className="relative z-10 w-full bg-gradient-to-t from-[#090a0c] via-[#090a0c]/80 to-transparent pt-6 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-800/80 text-center hover:border-zinc-700 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-white">4+</div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Disiplin Bela Diri
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-800/80 text-center hover:border-zinc-700 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-rose-500">12+</div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Sesi Kelas Mingguan
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-800/80 text-center hover:border-zinc-700 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Pemula Friendly
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-800/80 text-center hover:border-zinc-700 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">Cage & Ring</div>
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
