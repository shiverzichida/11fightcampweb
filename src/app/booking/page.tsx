'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Schedule, Booking } from '@/lib/types';
import { fetchSchedules, createBooking, getBookedSeats } from '@/lib/storage';
import { GYM_INFO } from '@/lib/data';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedScheduleId = searchParams.get('scheduleId');
  const preselectedCategory = searchParams.get('category');

  // State
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Date selection (Defaults to tomorrow or today if early)
  const getInitialDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [quotaMap, setQuotaMap] = useState<Record<string, number>>({});

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState<'first_time' | 'beginner' | 'intermediate' | 'advanced'>('first_time');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load Schedules
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSchedules();
        setSchedules(data);

        if (preselectedScheduleId) {
          const match = data.find((s) => s.id === preselectedScheduleId);
          if (match) {
            setSelectedSchedule(match);
          }
        }

        // Prefill name & phone if logged in via Member Portal
        if (typeof window !== 'undefined') {
          const savedName = localStorage.getItem('11fc_prefill_name');
          const savedPhone = localStorage.getItem('11fc_prefill_phone');
          if (savedName && !fullName) setFullName(savedName);
          if (savedPhone && !phone) setPhone(savedPhone);
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [preselectedScheduleId]);

  // When date changes, compute available schedules and quotas
  useEffect(() => {
    async function updateQuotas() {
      if (!selectedDate || schedules.length === 0) return;
      const targetDate = new Date(selectedDate);
      const dayOfWeek = targetDate.getDay();

      const matchingSchedules = schedules.filter(
        (s) => s.dayOfWeek === dayOfWeek && s.isActive !== false
      );

      const quotas: Record<string, number> = {};
      for (const s of matchingSchedules) {
        const booked = await getBookedSeats(s.id, selectedDate);
        quotas[s.id] = Math.max(0, s.maxCapacity - booked);
      }
      setQuotaMap(quotas);
    }
    updateQuotas();
  }, [selectedDate, schedules]);

  const currentDayOfWeek = selectedDate ? new Date(selectedDate).getDay() : 1;

  const availableSchedules = schedules.filter((s) => {
    if (s.dayOfWeek !== currentDayOfWeek || !s.isActive) return false;
    if (preselectedCategory && preselectedCategory !== 'all') {
      return s.classData?.category === preselectedCategory;
    }
    return true;
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || !selectedDate || !fullName || !phone) return;

    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        scheduleId: selectedSchedule.id,
        bookingDate: selectedDate,
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email || undefined,
        experienceLevel: experience,
        notes: notes || undefined,
      });

      newBooking.scheduleData = selectedSchedule;
      setConfirmedBooking(newBooking);

      try {
        confetti({
          particleCount: 110,
          spread: 80,
          colors: ['#ba2d1d', '#ea580c', '#f59e0b', '#ffffff'],
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if confetti fails
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert('Terjadi kesalahan saat memproses booking. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBookingCode = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const waConfirmationUrl = confirmedBooking
    ? `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
        `Halo 11th Universe MMA Pontianak! Saya telah melakukan booking online tiket kelas bela diri dengan data berikut:

*Kode Tiket:* ${confirmedBooking.bookingCode}
*Nama:* ${confirmedBooking.customerName}
*No. WhatsApp:* ${confirmedBooking.customerPhone}
*Kelas:* ${confirmedBooking.scheduleData?.classData?.title || 'Sesi Latihan'}
*Tanggal:* ${confirmedBooking.bookingDate}
*Jam Sesi:* ${confirmedBooking.scheduleData?.startTime} - ${confirmedBooking.scheduleData?.endTime} WIB
*Pelatih:* ${confirmedBooking.scheduleData?.trainerData?.name || 'Coach 11FC'}
*Tingkat Pengalaman:* ${confirmedBooking.experienceLevel}

Mohon konfirmasi dan informasi persiapan latihan ya Coach. Terima kasih!`
      )}`
    : '#';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* If booking confirmed: Show Receipt / Ticket View */}
      {confirmedBooking ? (
        <div className="bg-gradient-to-b from-zinc-900 to-black border-2 border-[#ba2d1d]/80 rounded-3xl p-6 sm:p-10 card-fire space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs uppercase tracking-widest font-black text-[#d63725]">
              Booking Berhasil Dikonfirmasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
              TIKET LATIHAN 11TH UNIVERSE MMA
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Simpan kode tiket Anda dan kirimkan konfirmasi langsung ke admin melalui tombol WhatsApp di bawah ini.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-[#08090b] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border-r border-zinc-800" />
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border-l border-zinc-800" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-zinc-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Kode Reservasi Unik
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#d63725] tracking-wider font-mono">
                    {confirmedBooking.bookingCode}
                  </span>
                  <button
                    onClick={copyBookingCode}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 transition-colors"
                    title="Salin Kode"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Status Pemesanan
                </span>
                <div className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  Confirmed (Tiket Sesi Aktif)
                </div>
              </div>
            </div>

            {/* Quota Deduction Banner */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2.5 text-xs text-emerald-300 font-bold">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Reservasi terkonfirmasi! Kuota tiket sesi Anda otomatis terpakai untuk jadwal ini.
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs sm:text-sm">
              <div>
                <span className="text-zinc-500 block text-[11px]">Nama Peserta:</span>
                <span className="font-bold text-white text-base">{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">No. WhatsApp:</span>
                <span className="font-bold text-zinc-200">{confirmedBooking.customerPhone}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Program Kelas:</span>
                <span className="font-bold text-[#d63725] text-base">
                  {confirmedBooking.scheduleData?.classData?.title || 'Sesi Bela Diri'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Pelatih / Coach:</span>
                <span className="font-bold text-zinc-200">
                  {confirmedBooking.scheduleData?.trainerData?.name || 'Coach 11FC'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Tanggal Sesi:</span>
                <span className="font-bold text-white">{confirmedBooking.bookingDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Jam Latihan:</span>
                <span className="font-bold text-white">
                  {confirmedBooking.scheduleData?.startTime} - {confirmedBooking.scheduleData?.endTime} WIB
                </span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-zinc-800">
                <span className="text-zinc-500 block text-[11px]">Lokasi Sasana:</span>
                <span className="font-medium text-zinc-300">
                  Jl. Dr. Rubini No. 11, Akcaya, Pontianak Selatan, Kalimantan Barat
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={waConfirmationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all hover:scale-[1.01]"
            >
              <MessageSquare className="w-5 h-5" />
              KIRIM TIKET KE WHATSAPP ADMIN (+62 881-8124-824)
            </a>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setSelectedSchedule(null);
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs transition-colors"
              >
                Booking Sesi Lain
              </button>
              <Link
                href="/"
                className="w-full sm:w-1/2 inline-flex items-center justify-center py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Booking Stepper Form */
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#ea580c] animate-pulse" />
              Reservasi Sesi Latihan
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              BOOKING JADWAL <span className="text-gradient-red">KELAS</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Pilih tanggal, amankan kuota slot kelas, dan isi data Anda. Latihan perdana dapat meminjam sarung tinju secara gratis.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-8">
            {/* Step 1: Pilih Tanggal */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba2d1d] text-white text-xs flex items-center justify-center font-black">
                    1
                  </span>
                  Pilih Tanggal Latihan
                </h3>
                <span className="text-xs text-zinc-400 font-semibold">
                  {currentDayOfWeek === 0
                    ? 'Minggu (Sasana Libur Kelas Reguler)'
                    : `Hari: ${['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][currentDayOfWeek]}`}
                </span>
              </div>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSchedule(null);
                  }}
                  className="w-full sm:w-72 px-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white font-bold text-sm focus:outline-none focus:border-[#ba2d1d]"
                  required
                />
              </div>
            </div>

            {/* Step 2: Pilih Slot Jadwal */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba2d1d] text-white text-xs flex items-center justify-center font-black">
                    2
                  </span>
                  Pilih Sesi Kelas & Instruktur
                </h3>
              </div>

              {loading ? (
                <div className="py-8 text-center text-zinc-500 text-xs">Memuat jadwal...</div>
              ) : availableSchedules.length === 0 ? (
                <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center text-zinc-400 text-xs">
                  Tidak ada jadwal kelas reguler aktif di tanggal ini. Silakan ubah tanggal latihan Anda di atas.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {availableSchedules.map((sch) => {
                    const remainingSlots = quotaMap[sch.id] ?? sch.maxCapacity;
                    const isSelected = selectedSchedule?.id === sch.id;
                    const isSoldOut = remainingSlots <= 0;

                    return (
                      <button
                        type="button"
                        key={sch.id}
                        disabled={isSoldOut}
                        onClick={() => setSelectedSchedule(sch)}
                        className={`text-left p-4 rounded-xl border transition-all relative ${
                          isSelected
                            ? 'bg-zinc-900 border-[#ba2d1d] card-fire'
                            : isSoldOut
                            ? 'bg-zinc-950/40 border-zinc-800/60 opacity-50 cursor-not-allowed'
                            : 'bg-zinc-900 border-zinc-800 card-fire-hover hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-black text-[#d63725] tracking-wider">
                              {sch.classData?.category || 'Combat'}
                            </span>
                            <h4 className="text-sm font-black text-white">{sch.classData?.title}</h4>
                          </div>
                          <span className="text-xs font-black text-white shrink-0">
                            Rp {sch.price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1 font-semibold text-zinc-300">
                            <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                            {sch.startTime} - {sch.endTime}
                          </span>
                          <span>•</span>
                          <span className="truncate">{sch.trainerData?.name}</span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          {isSoldOut ? (
                            <span className="text-red-400 font-bold">Slot Penuh</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold">
                              Tersedia: {remainingSlots} dari {sch.maxCapacity} slot
                            </span>
                          )}
                          {isSelected && (
                            <span className="px-2.5 py-0.5 rounded btn-fire text-white font-black text-[10px]">
                              Terpilih
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Isi Data Peserta */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#ba2d1d] text-white text-xs flex items-center justify-center font-black">
                  3
                </span>
                Data Diri Peserta
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Nama Lengkap <span className="text-[#ba2d1d]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Yoga Pratama"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    No. WhatsApp Aktif <span className="text-[#ba2d1d]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  />
                  <span className="text-[10px] text-zinc-500">Konfirmasi booking akan dikirimkan ke WhatsApp ini.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Tingkat Pengalaman Beladiri
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  >
                    <option value="first_time">Pertama Kali Banget (Belum Pernah)</option>
                    <option value="beginner">Pemula (Sudah Pernah Coba 1-3 Kali)</option>
                    <option value="intermediate">Menengah (Rutin Latihan)</option>
                    <option value="advanced">Lanjutan / Atlet</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Mau pinjam sarung tinju, punya riwayat cedera engkel, dll."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedSchedule}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isSubmitting || !selectedSchedule
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'btn-fire text-white hover:scale-[1.01] active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  'Memproses Reservasi...'
                ) : !selectedSchedule ? (
                  'Pilih Jadwal Terlebih Dahulu di Langkah 2'
                ) : (
                  <>
                    KONFIRMASI & AMBIL TIKET BOOKING
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-500">
                Pembayaran dapat dilakukan di sasana (Cash / QRIS) saat Anda datang latihan.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100 flex flex-col selection:bg-[#ba2d1d] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-zinc-500">Memuat formulir booking...</div>}>
          <BookingContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
