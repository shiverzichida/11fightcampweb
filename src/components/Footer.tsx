'use client';

import React from 'react';
import Link from 'next/link';
import { GYM_INFO } from '@/lib/data';
import { Phone, MapPin, Heart, Shield, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="bg-[#060709] text-zinc-400 text-xs border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#ba2d1d] shadow-md shadow-[#ba2d1d]/40 shrink-0">
                <img src="/logo.png" alt="11th Universe MMA" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white uppercase block">
                  11TH UNIVERSE MMA
                </span>
                <span className="text-[10px] tracking-widest text-[#d63725] uppercase font-bold">
                  Pontianak • Combat Club
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pusat pelatihan bela diri dan kebugaran intensif: Muay Thai, Boxing, BJJ, dan MMA di Pontianak. Membangun stamina, disiplin, dan kemampuan bertarung nyata.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={GYM_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-rose-600 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors text-zinc-300"
                aria-label="Instagram 11 Fight Camp"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${GYM_INFO.phone.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors text-zinc-300"
                aria-label="WhatsApp 11 Fight Camp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Program Kelas */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Program Beladiri</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#programs" className="hover:text-rose-400 transition-colors">
                  Muay Thai Striking
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-rose-400 transition-colors">
                  Western Boxing
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-rose-400 transition-colors">
                  Brazilian Jiu-Jitsu (BJJ)
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-rose-400 transition-colors">
                  Mixed Martial Arts (MMA)
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-rose-400 transition-colors">
                  Fighter Conditioning & HIIT
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-rose-400 transition-colors">
                  Private 1-on-1 Coaching
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Akses Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/booking" className="hover:text-white transition-colors flex items-center gap-1">
                  Reservasi / Booking Jadwal
                  <ArrowUpRight className="w-3 h-3 text-rose-500" />
                </Link>
              </li>
              <li>
                <Link href="/#schedule" className="hover:text-white transition-colors">
                  Jadwal Kelas Mingguan
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Harga & Paket Membership
                </Link>
              </li>
              <li>
                <Link href="/#coaches" className="hover:text-white transition-colors">
                  Profil Coach & Pelatih
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-zinc-500">
                  Panel Manajemen Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Lokasi & Kontak */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hubungi Kami</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jl. Dr. Rubini No. 11, Pontianak Selatan, Kalimantan Barat</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 881-8124-824</span>
              </div>
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href={GYM_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-zinc-300"
                >
                  @11fightcamp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400">
          <p>© {new Date().getFullYear()} 11 Fight Camp Pontianak. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Develop Local First</span>
            <span>•</span>
            <span>Vercel & Supabase Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
