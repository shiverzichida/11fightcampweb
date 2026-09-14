'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Schedule } from '@/lib/types';
import { fetchSchedules } from '@/lib/storage';

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // Default to today's day of week (if Sunday 0, else 1-6)
  const getTodayDay = () => {
    const d = new Date().getDay();
    return d; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  };

  const [selectedDay, setSelectedDay] = useState<number>(getTodayDay());
  const [loading, setLoading] = useState(true);

  const days = [
    { day: 1, label: 'SENIN' },
    { day: 2, label: 'SELASA' },
    { day: 3, label: 'RABU' },
    { day: 4, label: 'KAMIS' },
    { day: 5, label: 'JUMAT' },
    { day: 6, label: 'SABTU' },
    { day: 0, label: 'MINGGU' },
  ];

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSchedules();
        setSchedules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const daySchedules = schedules
    .filter((s) => s.dayOfWeek === selectedDay && s.isActive !== false)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <section id="schedule" className="py-16 md:py-24 bg-carbon border-b border-zinc-800 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
            Jadwal Harian Sasana 11th Universe
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            JADWAL <span className="text-gradient-red">KELAS</span>
          </h2>
          <p className="mt-2.5 text-zinc-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Pilih hari untuk melihat jadwal sesi latihan, instruktur yang bertugas, dan langsung amankan slot kelas Anda.
          </p>
        </div>

        {/* Responsive Day Selector Pills */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 pt-1 px-1 no-scrollbar">
            {days.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm tracking-wider transition-all shrink-0 whitespace-nowrap ${
                  selectedDay === d.day
                    ? 'btn-fire text-white shadow-xl scale-105 ring-2 ring-[#ea580c]/50'
                    : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Cards List */}
        {loading ? (
          <div className="text-center py-16 text-zinc-500 font-bold text-xs sm:text-sm">
            Memuat jadwal latihan...
          </div>
        ) : daySchedules.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center max-w-md mx-auto">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-200 font-black text-base">Tidak ada kelas umum di hari ini</p>
            <p className="text-xs text-zinc-400 mt-1">
              Hari ini dikhususkan untuk Open Gym & Sesi Privat 1-on-1 bersama Coach pilihan Anda.
            </p>
            <Link
              href="/booking"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-fire text-white font-black text-xs"
            >
              Booking Sesi Privat
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
            {daySchedules.map((sch) => (
              <div
                key={sch.id}
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 card-fire-hover transition-all flex flex-col justify-between space-y-4 hover:shadow-2xl group w-full"
              >
                {/* Class Title & Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ba2d1d]/30 text-[#d63725] border border-[#ba2d1d]/50 mb-1.5">
                      {sch.classData?.category?.toUpperCase() || 'COMBAT'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#d63725] transition-colors truncate">
                      {sch.classData?.title || 'Sesi Latihan'}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-white block">
                      Rp {sch.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold block">/ sesi</span>
                  </div>
                </div>

                {/* Time & Trainer Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#ea580c] shrink-0" />
                    <span className="font-bold text-xs sm:text-sm">
                      {sch.startTime} - {sch.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User className="w-4 h-4 text-[#ba2d1d] shrink-0" />
                    <span className="truncate font-semibold text-xs text-zinc-200">
                      {sch.trainerData?.name || 'Coach 11FC'}
                    </span>
                  </div>
                </div>

                {/* Slot Capacity & Action Button */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-400">
                    Kuota: <strong className="text-zinc-200">{sch.maxCapacity} peserta</strong>
                  </span>
                  <Link
                    href={`/booking?scheduleId=${sch.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-fire text-white font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-md shrink-0"
                  >
                    Book Slot
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#d63725] hover:text-[#ea580c] underline underline-offset-4 transition-colors"
          >
            Buka Kalender Booking Lengkap & Pilih Tanggal Sesi Latihan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
