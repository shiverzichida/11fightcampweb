'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Table, LayoutGrid, Flame } from 'lucide-react';
import { Schedule } from '@/lib/types';
import { fetchSchedules } from '@/lib/storage';

interface MatrixRow {
  time: string;
  timeLabel: string;
  slots: {
    [dayIndex: number]: {
      name: string;
      color?: string;
      scheduleId?: string;
    }[];
  };
}

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Senin (1)
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
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

  // Official Timetable Matrix Structure based on 11 Fight Camp Official Board
  const matrixData: MatrixRow[] = [
    {
      time: '07.00',
      timeLabel: '07:00 - 08:15',
      slots: {
        6: [{ name: 'HYROX', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' }],
      },
    },
    {
      time: '08.30',
      timeLabel: '08:30 - 09:45',
      slots: {
        1: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        2: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        3: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        4: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        5: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        6: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
      },
    },
    {
      time: '10.00',
      timeLabel: '10:00 - 11:15',
      slots: {
        1: [
          { name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' },
          { name: 'YOGA IF', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
        ],
        2: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        3: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        4: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        5: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        6: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        0: [{ name: 'BJJ KIDS', color: 'text-sky-400 border-sky-500/40 bg-sky-950/30' }],
      },
    },
    {
      time: '15.00',
      timeLabel: '15:00 - 16:00',
      slots: {
        6: [{ name: 'MUAYKIDS', color: 'text-orange-400 border-orange-500/40 bg-orange-950/30' }],
      },
    },
    {
      time: '16.00',
      timeLabel: '16:00 - 17:15',
      slots: {
        1: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        2: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        3: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        4: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        5: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        6: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        0: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
      },
    },
    {
      time: '17.00',
      timeLabel: '17:00 - 18:15',
      slots: {
        1: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        2: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        3: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        4: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        5: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
        6: [{ name: 'STRIKING', color: 'text-[#d63725] border-[#ba2d1d]/40 bg-[#ba2d1d]/10' }],
      },
    },
    {
      time: '18.30',
      timeLabel: '18:30 - 19:45',
      slots: {
        1: [{ name: 'YOGA HATHA', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' }],
        4: [{ name: 'ZUMBA', color: 'text-pink-400 border-pink-500/40 bg-pink-950/30' }],
        5: [{ name: 'YOGA HATHA', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' }],
      },
    },
    {
      time: '19.00',
      timeLabel: '19:00 - 20:15',
      slots: {
        3: [{ name: 'HYROX', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' }],
      },
    },
    {
      time: '20.00',
      timeLabel: '20:00 - 21:30',
      slots: {
        1: [
          { name: 'BJJ', color: 'text-blue-400 border-blue-500/40 bg-blue-950/30' },
          { name: 'HYROX', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
        ],
        3: [{ name: 'BJJ', color: 'text-blue-400 border-blue-500/40 bg-blue-950/30' }],
        5: [{ name: 'BJJ', color: 'text-blue-400 border-blue-500/40 bg-blue-950/30' }],
      },
    },
  ];

  const daySchedules = schedules.filter(
    (s) => s.dayOfWeek === selectedDay && s.isActive !== false
  );

  return (
    <section id="schedule" className="py-20 bg-carbon border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
            Jadwal Resmi Sasana 11th Universe
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            JADWAL <span className="text-gradient-red">KELAS</span>
          </h2>
          <p className="mt-3 text-zinc-300 text-sm sm:text-base">
            Jadwal tetap sesi latihan harian 11th Universe MMA. Klik pada slot kelas untuk langsung melakukan reservasi.
          </p>

          {/* View Mode Switcher */}
          <div className="mt-7 inline-flex items-center p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <button
              onClick={() => setViewMode('matrix')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                viewMode === 'matrix'
                  ? 'btn-fire text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              Tabel Matriks Penuh (Official Board)
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                viewMode === 'cards'
                  ? 'btn-fire text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Tampilan Per Hari
            </button>
          </div>
        </div>

        {/* 1. OFFICIAL MATRIX TIMETABLE VIEW */}
        {viewMode === 'matrix' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-3xl border-2 border-zinc-700 bg-black/95 shadow-2xl p-2 sm:p-4">
              <table className="w-full text-center border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b-2 border-zinc-700">
                    <th className="py-4 px-3 text-sm sm:text-base font-black text-white uppercase tracking-wider border-r border-zinc-800 bg-zinc-950/80">
                      TIME
                    </th>
                    {days.map((d) => (
                      <th
                        key={d.day}
                        className={`py-4 px-3 text-xs sm:text-sm font-black uppercase tracking-wider border-r border-zinc-800 ${
                          d.day === 0 ? 'text-[#d63725]' : 'text-white'
                        }`}
                      >
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {matrixData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                      {/* Time Column */}
                      <td className="py-3 px-3 font-black text-xs sm:text-sm text-zinc-300 tracking-wider border-r border-zinc-800 bg-zinc-950/50">
                        <span className="font-mono text-white text-sm">{row.time}</span>
                      </td>

                      {/* Day Columns */}
                      {days.map((d) => {
                        const cellItems = row.slots[d.day];
                        return (
                          <td
                            key={d.day}
                            className="py-2 px-2 border-r border-zinc-800 align-middle min-h-[56px]"
                          >
                            {cellItems && cellItems.length > 0 ? (
                              <div className="flex flex-col gap-1.5 items-center justify-center">
                                {cellItems.map((item, itemIdx) => (
                                  <Link
                                    key={itemIdx}
                                    href={`/booking`}
                                    title={`Klik untuk booking kelas ${item.name}`}
                                    className={`w-full py-1.5 px-2 rounded-lg border text-[11px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm block ${
                                      item.color || 'text-white border-zinc-700 bg-zinc-900'
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-800 select-none text-xs">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d63725]" />
                Striking (Muay Thai / Boxing)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                BJJ (Brazilian Jiu-Jitsu)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Hyrox Fitness
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Yoga Hatha & IF
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Zumba
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Kids Martial Arts
              </span>
            </div>
          </div>
        )}

        {/* 2. CARD VIEW (FILTER BY DAY) */}
        {viewMode === 'cards' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Day Selector Buttons */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 max-w-3xl mx-auto">
              {days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs tracking-wider transition-all shrink-0 ${
                    selectedDay === d.day
                      ? 'btn-fire text-white shadow-lg scale-105'
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
                  Hari ini dikhususkan untuk Open Gym & Sesi Privat 1-on-1.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {daySchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 card-fire-hover transition-all flex flex-col justify-between space-y-4 hover:shadow-2xl group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ba2d1d]/30 text-[#d63725] border border-[#ba2d1d]/50 mb-1.5">
                          {sch.classData?.category?.toUpperCase() || 'COMBAT'}
                        </span>
                        <h3 className="text-base font-black text-white group-hover:text-[#d63725] transition-colors">
                          {sch.classData?.title || 'Sesi Latihan'}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-white">
                          Rp {sch.price.toLocaleString('id-ID')}
                        </span>
                        <span className="block text-[10px] text-zinc-400 font-semibold">/ sesi</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                        <span className="font-bold">
                          {sch.startTime} - {sch.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#ba2d1d] shrink-0" />
                        <span className="truncate font-semibold">{sch.trainerData?.name || 'Coach 11FC'}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">
                        Kapasitas: <strong className="text-zinc-200">{sch.maxCapacity} orang</strong>
                      </span>
                      <Link
                        href={`/booking?scheduleId=${sch.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-fire text-white font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-md"
                      >
                        Book Slot
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-sm font-black text-[#d63725] hover:text-[#ea580c] underline underline-offset-4 transition-colors"
          >
            Buka Kalender Booking Lengkap & Pilih Tanggal Sesi Latihan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
