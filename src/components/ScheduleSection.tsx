'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ShieldCheck, ArrowRight, Flame } from 'lucide-react';
import { Schedule } from '@/lib/types';
import { fetchSchedules } from '@/lib/storage';

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Senin (1)
  const [loading, setLoading] = useState(true);

  const days = [
    { day: 1, label: 'Senin' },
    { day: 2, label: 'Selasa' },
    { day: 3, label: 'Rabu' },
    { day: 4, label: 'Kamis' },
    { day: 5, label: 'Jumat' },
    { day: 6, label: 'Sabtu' },
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

  const daySchedules = schedules.filter(
    (s) => s.dayOfWeek === selectedDay && s.isActive !== false
  );

  return (
    <section id="schedule" className="py-20 bg-carbon border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-800/40 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            Jadwal Latihan Mingguan
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            TIMETABLE & <span className="text-gradient-gold">JADWAL KELAS</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">
            Pilih hari untuk melihat jadwal latihan, instruktur yang bertugas, dan segera amankan slot kelas Anda.
          </p>
        </div>

        {/* Day Selector Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 max-w-2xl mx-auto mb-8">
          {days.map((d) => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`px-5 py-3 rounded-xl font-black text-sm tracking-wide transition-all shrink-0 ${
                selectedDay === d.day
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/40 scale-105'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        {loading ? (
          <div className="text-center py-12 text-zinc-500 font-semibold text-sm">
            Memuat jadwal latihan...
          </div>
        ) : daySchedules.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center max-w-md mx-auto">
            <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-300 font-bold">Tidak ada kelas umum di hari ini</p>
            <p className="text-xs text-zinc-500 mt-1">
              Hari ini dikhususkan untuk Open Gym & Sesi Privat 1-on-1. Hubungi admin untuk reservasi privat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {daySchedules.map((sch) => (
              <div
                key={sch.id}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-black/60 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-900/50 mb-1.5">
                      {sch.classData?.category?.toUpperCase() || 'COMBAT'}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition-colors">
                      {sch.classData?.title || 'Sesi Latihan'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white">
                      Rp {sch.price.toLocaleString('id-ID')}
                    </span>
                    <span className="block text-[10px] text-zinc-400">/ sesi drop-in</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {sch.startTime} - {sch.endTime} WIB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">{sch.trainerData?.name || 'Coach 11FC'}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    Kapasitas maks: <strong className="text-zinc-200">{sch.maxCapacity} orang</strong>
                  </span>
                  <Link
                    href={`/booking?scheduleId=${sch.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950 transition-all hover:scale-105 active:scale-95"
                  >
                    Book Slot
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 underline underline-offset-4"
          >
            Lihat Kalender Booking Lengkap & Pilih Tanggal Sesi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
