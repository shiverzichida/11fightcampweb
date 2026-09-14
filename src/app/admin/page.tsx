'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Schedule, Booking, ClassItem, Trainer } from '@/lib/types';
import {
  fetchSchedules,
  fetchBookings,
  fetchClasses,
  fetchTrainers,
  saveNewSchedule,
  deleteSchedule,
  toggleScheduleStatus,
  updateBookingStatus,
} from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  TrendingUp,
  Activity,
  Check,
  AlertCircle,
  Database,
  Search,
} from 'lucide-react';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'schedules' | 'stats'>('bookings');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // New Schedule Modal / Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassId, setNewClassId] = useState('');
  const [newTrainerId, setNewTrainerId] = useState('');
  const [newDay, setNewDay] = useState<number>(1);
  const [newStartTime, setNewStartTime] = useState('16:30');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [newCapacity, setNewCapacity] = useState<number>(15);
  const [newPrice, setNewPrice] = useState<number>(75000);
  const [isSaving, setIsSaving] = useState(false);

  // Filter state for bookings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'attended' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesData, bookingsData, classesData, trainersData] = await Promise.all([
        fetchSchedules(),
        fetchBookings(),
        fetchClasses(),
        fetchTrainers(),
      ]);
      setSchedules(schedulesData);
      setBookings(bookingsData);
      setClasses(classesData);
      setTrainers(trainersData);

      if (classesData.length > 0) setNewClassId(classesData[0].id);
      if (trainersData.length > 0) setNewTrainerId(trainersData[0].id);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Add Schedule
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassId || !newTrainerId) return;

    setIsSaving(true);
    try {
      await saveNewSchedule({
        classId: newClassId,
        trainerId: newTrainerId,
        dayOfWeek: newDay,
        startTime: newStartTime,
        endTime: newEndTime,
        maxCapacity: Number(newCapacity),
        price: Number(newPrice),
        isActive: true,
      });

      await loadData();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal menambah jadwal');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Toggle Schedule Active
  const handleToggleSchedule = async (id: string, currentStatus: boolean) => {
    await toggleScheduleStatus(id, !currentStatus);
    await loadData();
  };

  // Handle Delete Schedule
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    await deleteSchedule(id);
    await loadData();
  };

  // Handle Update Booking Status
  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'attended' | 'cancelled') => {
    await updateBookingStatus(id, status);
    await loadData();
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchCode = b.bookingCode.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.includes(q);
      return matchName || matchCode || matchPhone;
    }
    return true;
  });

  // Calculate Metrics
  const totalRevenue = bookings
    .filter((b) => b.status === 'attended' || b.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.scheduleData?.price || 75000), 0);

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-2">
              <Database className="w-3.5 h-3.5 text-rose-500" />
              <span>Storage Mode:</span>
              <strong className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                {isSupabaseConfigured ? 'Supabase Cloud PostgreSQL' : 'Local Storage Fallback'}
              </strong>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              PANEL ADMIN & MANAJEMEN JADWAL
            </h1>
            <p className="text-xs text-zinc-400">
              Kelola jadwal sesi latihan mingguan dan pantau daftar booking peserta 11 Fight Camp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tambah Jadwal Baru
            </button>
            <Link
              href="/booking"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs transition-colors"
            >
              Lihat Tampilan Booking
            </Link>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase">Total Booking</span>
              <Users className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{bookings.length}</div>
            <span className="text-[11px] text-zinc-500">Reservasi terdaftar</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase">Jadwal Aktif</span>
              <Calendar className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {schedules.filter((s) => s.isActive).length}
            </div>
            <span className="text-[11px] text-zinc-500">Sesi kelas per minggu</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase">Hadir (Attended)</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {bookings.filter((b) => b.status === 'attended').length}
            </div>
            <span className="text-[11px] text-zinc-500">Telah hadir di sasana</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase">Estimasi Revenue</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-zinc-500">Dari sesi booking aktif</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Daftar Reservasi ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schedules'
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Manajemen Jadwal ({schedules.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, kode booking, HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {(['all', 'confirmed', 'attended', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors shrink-0 ${
                      bookingFilter === st
                        ? 'bg-zinc-200 text-black font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {st === 'all' ? 'Semua Status' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table or Cards */}
            {loading ? (
              <div className="py-12 text-center text-zinc-500 text-xs">Memuat data booking...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs">
                Belum ada data booking yang sesuai dengan filter.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Kode Tiket</th>
                      <th className="py-3 px-4">Peserta & Kontak</th>
                      <th className="py-3 px-4">Program & Sesi</th>
                      <th className="py-3 px-4">Tanggal & Jam</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-rose-400 text-sm">
                            {b.bookingCode}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{b.customerName}</div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <a
                              href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline"
                            >
                              {b.customerPhone}
                            </a>
                            <span className="capitalize text-zinc-500">({b.experienceLevel})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-zinc-200">
                            {b.scheduleData?.classData?.title || 'Sesi Bela Diri'}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            Coach: {b.scheduleData?.trainerData?.name || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{b.bookingDate}</div>
                          <div className="text-[11px] text-zinc-400">
                            {b.scheduleData?.startTime} - {b.scheduleData?.endTime} WIB
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              b.status === 'attended'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                                : b.status === 'cancelled'
                                ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                                : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status !== 'attended' && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'attended')}
                                className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50"
                                title="Tandai Hadir"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {b.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800/50"
                                title="Batalkan Booking"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHEDULES MANAGEMENT */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    sch.isActive
                      ? 'bg-zinc-900/80 border-zinc-800'
                      : 'bg-zinc-950/50 border-zinc-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900/50 uppercase">
                        {DAYS[sch.dayOfWeek]}
                      </span>
                      <h3 className="text-base font-black text-white mt-1.5">
                        {sch.classData?.title || 'Sesi Bela Diri'}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Coach: <strong className="text-zinc-300">{sch.trainerData?.name}</strong>
                      </p>
                    </div>

                    <span className="text-xs font-bold text-amber-400">
                      Rp {sch.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {sch.startTime} - {sch.endTime} WIB
                      </span>
                    </div>
                    <span>Kapasitas: {sch.maxCapacity}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleToggleSchedule(sch.id, sch.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        sch.isActive
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {sch.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    <button
                      onClick={() => handleDeleteSchedule(sch.id)}
                      className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-900/40"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: TAMBAH JADWAL BARU */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-black text-white uppercase">Tambah Jadwal Sesi Baru</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Pilih Kelas / Disiplin
                  </label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                    required
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Pilih Pelatih / Coach
                  </label>
                  <select
                    value={newTrainerId}
                    onChange={(e) => setNewTrainerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                    required
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} - {t.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Hari Latihan
                    </label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                    >
                      <option value={1}>Senin</option>
                      <option value={2}>Selasa</option>
                      <option value={3}>Rabu</option>
                      <option value={4}>Kamis</option>
                      <option value={5}>Jumat</option>
                      <option value={6}>Sabtu</option>
                      <option value={0}>Minggu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Harga Drop-in (Rp)
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Kapasitas Maks
                    </label>
                    <input
                      type="number"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
