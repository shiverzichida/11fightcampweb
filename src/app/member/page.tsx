'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Member, Booking } from '@/lib/types';
import { fetchMembers, fetchBookings } from '@/lib/storage';
import { GYM_INFO } from '@/lib/data';
import {
  User,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
  Flame,
  ArrowRight,
  Shield,
  Activity,
  Phone,
  RefreshCw,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function MemberPortalPage() {
  const [searchPhone, setSearchPhone] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [memberBookings, setMemberBookings] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Load database members & bookings
  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, bookingsData] = await Promise.all([
        fetchMembers(),
        fetchBookings(),
      ]);
      setMembers(membersData);
      setBookings(bookingsData);

      // Check saved phone from localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('11fc_saved_member_phone');
        if (saved) {
          setSearchPhone(saved);
          findAndSetMember(saved, membersData, bookingsData);
        }
      }
    } catch (err) {
      console.error('Error loading member portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const normalizePhone = (num: string) => {
    return num.replace(/[^0-9]/g, '').replace(/^0/, '62').replace(/^\+/, '');
  };

  const findAndSetMember = (
    query: string,
    memberList: Member[] = members,
    bookingList: Booking[] = bookings
  ) => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      setActiveMember(null);
      setMemberBookings([]);
      return;
    }

    const normQuery = normalizePhone(cleanQuery);

    const found = memberList.find((m) => {
      const normMemberPhone = normalizePhone(m.phone || '');
      const matchPhone = normMemberPhone.includes(normQuery) || normQuery.includes(normMemberPhone);
      const matchCode = m.memberCode?.toLowerCase().includes(cleanQuery);
      const matchName = m.name?.toLowerCase().includes(cleanQuery);
      return matchPhone || matchCode || matchName;
    });

    if (found) {
      setActiveMember(found);
      if (typeof window !== 'undefined') {
        localStorage.setItem('11fc_saved_member_phone', query);
      }

      // Filter bookings for this member
      const normTarget = normalizePhone(found.phone || '');
      const matchedBookings = bookingList.filter((b) => {
        const normBPhone = normalizePhone(b.customerPhone || '');
        const matchPhone = normBPhone.includes(normTarget) || normTarget.includes(normBPhone);
        const matchName = b.customerName?.toLowerCase() === found.name.toLowerCase();
        return matchPhone || matchName;
      });
      setMemberBookings(matchedBookings);
    } else {
      setActiveMember(null);
      setMemberBookings([]);
    }
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findAndSetMember(searchPhone);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('11fc_saved_member_phone');
    }
    setActiveMember(null);
    setMemberBookings([]);
    setSearchPhone('');
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba2d1d]/15 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-[#ba2d1d]" />
            Official Member Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            PORTAL MEMBER <span className="text-gradient-red">11 FIGHT CAMP</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Cek kartu member digital, sisa kuota sesi tiket latihan, masa aktif paket, dan riwayat reservasi kelas Anda.
          </p>
        </div>

        {/* 1. LOOKUP / SEARCH FORM */}
        {!activeMember ? (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-300">
                <User className="w-7 h-7 text-[#ba2d1d]" />
              </div>

              <div>
                <h2 className="text-lg font-black text-white uppercase">Akses Akun Member</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Masukkan Nomor WhatsApp yang Anda gunakan saat mendaftar paket membership atau booking.
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-3.5">
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  {loading ? 'Memeriksa Database...' : 'Cek Status Member Saya'}
                </button>
              </form>

              {hasSearched && !activeMember && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-left space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Member Tidak Ditemukan
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Nomor WhatsApp <strong className="text-white">{searchPhone}</strong> belum terdaftar sebagai member. Pastikan nomor sudah sesuai atau hubungi admin jika baru saja mendaftar.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-fire text-white text-[11px] font-bold"
                    >
                      <Flame className="w-3 h-3" />
                      Daftar Paket Member
                    </Link>
                    <Link
                      href="/booking"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold"
                    >
                      <Calendar className="w-3 h-3" />
                      Coba Trial / Single Visit
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-400 space-y-2">
              <span className="font-bold text-zinc-300 block uppercase tracking-wider text-[11px]">
                💡 Butuh Bantuan?
              </span>
              <p className="text-[11px] leading-relaxed">
                Jika Anda sudah melakukan transfer pembayaran namun status belum aktif, hubungi Admin melalui WhatsApp Official (+62 881-8124-824) untuk konfirmasi manual cepat.
              </p>
            </div>
          </div>
        ) : (
          /* 2. ACTIVE MEMBER DASHBOARD */
          <div className="space-y-8 animate-in fade-in">
            {/* Top Bar for Member */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ba2d1d] flex items-center justify-center text-white font-black text-sm uppercase">
                  {activeMember.name.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    {activeMember.name}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {activeMember.memberCode}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-[#d63725]" />
                    {activeMember.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={loadData}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-zinc-700/60"
                >
                  <LogOut className="w-3 h-3" />
                  Ganti Akun
                </button>
              </div>
            </div>

            {/* Member Digital Combat Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border-2 border-[#ba2d1d] p-6 sm:p-8">
              {/* Watermark Logo in Background */}
              <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 pointer-events-none">
                <img src="/logo.png" alt="11 Fight Camp Watermark" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ba2d1d] bg-black shrink-0">
                      <img src="/logo.png" alt="11 Fight Camp" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-widest text-[#d63725] uppercase block">
                        11TH UNIVERSE MMA • PONTIANAK
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                        {activeMember.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Status Badge */}
                    {activeMember.status === 'active' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-950 border border-emerald-700 text-emerald-300 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Status: Member Aktif
                      </span>
                    )}
                    {activeMember.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-950 border border-amber-700 text-amber-300 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Status: Menunggu Pembayaran
                      </span>
                    )}
                    {activeMember.status === 'expired' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-950 border border-rose-700 text-rose-300 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        Status: Paket Kadaluarsa
                      </span>
                    )}

                    {/* Payment Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        activeMember.paymentStatus === 'paid'
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                      }`}
                    >
                      <CreditCard className="w-3 h-3 text-[#d63725]" />
                      {activeMember.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>

                  {/* Plan Information */}
                  <div className="pt-2">
                    <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block">
                      Paket Terdaftar:
                    </span>
                    <div className="text-lg font-black text-white">
                      {activeMember.planTitle}
                    </div>
                  </div>
                </div>

                {/* Right Side: Sessions or Expiry Counter Box */}
                <div className="min-w-[240px] p-5 rounded-2xl bg-black/60 border border-zinc-800 backdrop-blur-sm space-y-4">
                  {typeof activeMember.remainingSessions === 'number' ? (
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#ba2d1d]" />
                          Sisa Tiket Sesi
                        </span>
                        <span className="text-white font-black text-sm">
                          {activeMember.remainingSessions} / {activeMember.totalSessions || 10} Sesi
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden mt-2">
                        <div
                          className="h-full bg-gradient-to-r from-[#ba2d1d] to-[#d63725] transition-all duration-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((activeMember.remainingSessions || 0) /
                                  (activeMember.totalSessions || 10)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1.5">
                        Tiap kali hadir check-in ke sasana, kuota sesi akan otomatis berkurang 1.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Unlimited Access
                      </div>
                      <div className="text-sm font-black text-emerald-400">
                        Bebas Hadir Semua Kelas
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Masa Berlaku:</span>
                    <span className="font-bold text-zinc-200">
                      {activeMember.endDate
                        ? new Date(activeMember.endDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '30 Hari'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Payment Notice inside Card */}
              {activeMember.paymentStatus === 'pending' && (
                <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-950/40 p-4 rounded-xl border border-amber-800/50">
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      Tagihan sebesar <strong>Rp {activeMember.price.toLocaleString('id-ID')}</strong> belum dikonfirmasi admin.
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
                      `Halo Admin 11 Fight Camp, saya ingin konfirmasi pembayaran paket membership atas nama: ${activeMember.name} (Kode: ${activeMember.memberCode}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    Konfirmasi via WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/booking"
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#ba2d1d] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl btn-fire flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-[#d63725] transition-colors">
                      Booking Jadwal Kelas
                    </h3>
                    <p className="text-xs text-zinc-400">Pilih jam & disiplin kelas minggu ini</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/#pricing"
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#ba2d1d] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#d63725]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-[#d63725] transition-colors">
                      Top-Up / Perpanjang Paket
                    </h3>
                    <p className="text-xs text-zinc-400">Tambah sesi tiket atau perpanjang masa aktif</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            {/* 3. RIWAYAT BOOKING KELAS MEMBER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase">
                    Riwayat Reservasi Kelas Saya
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Daftar jadwal sesi kelas yang pernah Anda reservasi di 11 Fight Camp.
                  </p>
                </div>
                <span className="text-xs font-bold text-zinc-400">
                  Total: {memberBookings.length} booking
                </span>
              </div>

              {memberBookings.length === 0 ? (
                <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-sm font-bold text-zinc-300">Belum ada riwayat booking kelas</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Anda belum pernah reservasi jadwal kelas. Silakan pilih kelas latihan yang Anda inginkan sekarang.
                  </p>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-fire text-white font-black text-xs transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Booking Kelas Perdana
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {memberBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-zinc-400 block">
                            Kode: {b.bookingCode}
                          </span>
                          <h4 className="text-sm font-black text-white mt-0.5">
                            {b.scheduleData?.classData?.title || 'Sesi Latihan Combat'}
                          </h4>
                          <span className="text-xs text-zinc-400 block mt-0.5">
                            Coach: {b.scheduleData?.trainerData?.name || 'Coach 11FC'}
                          </span>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            b.status === 'attended'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : b.status === 'confirmed'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {b.status === 'attended'
                            ? '✓ Hadir (Check-in)'
                            : b.status === 'confirmed'
                            ? 'Confirmed'
                            : 'Dibatalkan'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#d63725]" />
                          <span>
                            {b.scheduleData?.startTime || '16:30'} - {b.scheduleData?.endTime || '18:00'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{b.bookingDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}