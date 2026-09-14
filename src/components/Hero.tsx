'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Calendar, ArrowRight, MapPin, MessageSquare } from 'lucide-react';
import { GYM_INFO } from '@/lib/data';

export default function Hero() {
  const [activeStatIndex, setActiveStatIndex] = useState(1);

  // Automatically cycle burning light from one card to the next every 2.4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: '5+', label: 'Disiplin Bela Diri', activeColor: 'text-[#d63725]' },
    { value: '15+', label: 'Sesi Kelas Mingguan', activeColor: 'text-[#d63725]' },
    { value: '100%', label: 'Pemula Friendly', activeColor: 'text-[#ea580c]' },
    { value: 'Cage & Ring', label: 'Fasilitas Lengkap', activeColor: 'text-amber-400' },
  ];

  const whatsappBookingUrl = `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
    'Halo 11 Fight Camp Pontianak! Saya ingin tanya jadwal kelas dan mencoba trial latihan.'
  )}`;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-black border-b border-zinc-800 w-full">
      {/* 1. Fullpage MMA Fight Camp Background Image with Next.js Priority LCP Optimization */}
      <div className="absolute inset-0 transition-transform duration-1000 scale-100 -z-10">
        <Image
          src="/hero-full-bg.jpg"
          alt="11 Fight Camp Pontianak Gym and Cage"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* 2. Cinematic Lighting & Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090b]/90 via-[#08090b]/50 to-[#08090b]" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#08090b]/55 to-[#08090b]/95" />

      {/* 3. Hero Main Content (Centered & Immersive) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10 flex-1 flex flex-col items-center justify-center text-center w-full">
        
        {/* Official 11th Universe Logo */}
        <div className="mb-4 sm:mb-6 relative group">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 sm:border-3 border-[#ba2d1d] bg-black p-0.5">
            <Image
              src="/logo.png"
              alt="11th Universe MMA Official Emblem"
              width={128}
              height={128}
              priority
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* City & Camp Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#ba2d1d] text-zinc-200 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-5 max-w-full">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d63725] shrink-0" />
          <span className="truncate">11th Universe MMA • Pontianak</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.1] max-w-4xl px-2">
          FORGE YOUR BODY. <br />
          <span className="text-gradient-red">MASTER THE ART</span> <br />
          OF COMBAT.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-200 max-w-2xl leading-relaxed font-medium px-2">
          Sasana bela diri & MMA terlengkap di Pontianak. Fasilitas oktagon cage, ring tinju, dan matras grappling.
          Kelas <strong className="text-white">Striking, BJJ, Hyrox, & Kids</strong> terbuka untuk semua level.
        </p>

        {/* Address snippet */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-zinc-800 text-[11px] sm:text-xs text-zinc-300 max-w-full">
          <MapPin className="w-3.5 h-3.5 text-[#ba2d1d] shrink-0" />
          <span className="truncate">Jl. Dr. Rubini No. 11, Akcaya, Pontianak Selatan</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl btn-fire text-white font-black text-sm sm:text-base tracking-wide transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            BOOKING JADWAL KELAS
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-black/85 hover:bg-zinc-900 border border-[#ba2d1d]/60 text-zinc-100 font-bold text-sm sm:text-base backdrop-blur-md transition-all hover:border-[#ba2d1d] hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            Tanya Admin via WhatsApp
          </a>
        </div>
      </div>

      {/* 4. Bottom Floating Stats Bar */}
      <div className="relative z-10 w-full bg-gradient-to-t from-[#08090b] via-[#08090b]/85 to-transparent pt-3 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
            {stats.map((stat, i) => {
              const isActive = activeStatIndex === i;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveStatIndex(i)}
                  className={`p-3 sm:p-4 rounded-2xl text-center cursor-pointer transition-all duration-500 select-none ${
                    isActive
                      ? 'bg-black/90 backdrop-blur-md card-fire scale-[1.03] z-20'
                      : 'bg-black/60 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700 card-fire-hover opacity-85'
                  }`}
                >
                  <div
                    className={`text-xl sm:text-3xl font-black transition-colors duration-300 ${
                      isActive ? stat.activeColor : 'text-white'
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5 transition-colors duration-300 ${
                      isActive ? 'text-zinc-100' : 'text-zinc-400'
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
