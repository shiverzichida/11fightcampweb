'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Menu, X, UserCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#08090b]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#ba2d1d] shadow-lg shadow-[#ba2d1d]/40 group-hover:scale-105 group-hover:shadow-[#ba2d1d]/80 transition-all duration-300">
              <img
                src="/logo.png"
                alt="11th Universe MMA - 11 Fight Camp Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-white uppercase group-hover:text-[#d63725] transition-colors">
                11TH UNIVERSE
              </span>
              <span className="text-[10px] tracking-widest text-[#d63725] uppercase font-extrabold flex items-center gap-1">
                FIGHT CAMP • PONTIANAK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide">
            <Link href="/#programs" className="text-zinc-300 hover:text-[#d63725] transition-colors">
              Program Kelas
            </Link>
            <Link href="/#schedule" className="text-zinc-300 hover:text-[#d63725] transition-colors">
              Jadwal Mingguan
            </Link>
            <Link href="/#coaches" className="text-zinc-300 hover:text-[#d63725] transition-colors">
              Pelatih
            </Link>
            <Link href="/#pricing" className="text-zinc-300 hover:text-[#d63725] transition-colors">
              Membership
            </Link>
            <Link href="/#location" className="text-zinc-300 hover:text-[#d63725] transition-colors">
              Lokasi
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
              Admin Portal
            </Link>

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-fire text-white font-black text-sm tracking-wide transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              Booking Kelas
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/booking"
              className="px-3.5 py-2 rounded-xl btn-fire text-white font-black text-xs"
            >
              Booking
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#08090b] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#programs"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-semibold text-zinc-300 hover:text-[#d63725] border-b border-zinc-900"
          >
            Program Kelas
          </Link>
          <Link
            href="/#schedule"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-semibold text-zinc-300 hover:text-[#d63725] border-b border-zinc-900"
          >
            Jadwal Mingguan
          </Link>
          <Link
            href="/#coaches"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-semibold text-zinc-300 hover:text-[#d63725] border-b border-zinc-900"
          >
            Pelatih (Coaches)
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-semibold text-zinc-300 hover:text-[#d63725] border-b border-zinc-900"
          >
            Membership & Biaya
          </Link>
          <Link
            href="/#location"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-semibold text-zinc-300 hover:text-[#d63725] border-b border-zinc-900"
          >
            Lokasi Sasana
          </Link>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-fire text-white font-black text-sm"
            >
              <Calendar className="w-4 h-4" />
              Booking Sesi Sekarang
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs"
            >
              <UserCheck className="w-4 h-4" />
              Portal Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
