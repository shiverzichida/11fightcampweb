'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Schedule, Booking, ClassItem, Trainer, Member } from '@/lib/types';
import { MEMBERSHIP_PLANS } from '@/lib/data';
import {
  fetchSchedules,
  fetchBookings,
  fetchClasses,
  fetchTrainers,
  fetchMembers,
  saveNewSchedule,
  updateSchedule,
  deleteSchedule,
  toggleScheduleStatus,
  updateBookingStatus,
  saveNewMember,
  updateMemberStatus,
  decrementMemberSession,
  incrementMemberSession,
  deleteMember,
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
  CreditCard,
  Award,
  UserPlus,
  Phone,
  Sparkles,
  MinusCircle,
  Lock,
  LogOut,
  Pencil,
} from 'lucide-react';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'bookings' | 'schedules' | 'members'>('bookings');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('11fc_admin_auth') || sessionStorage.getItem('11fc_admin_auth');
      if (auth === 'true') {
        setIsAdminLoggedIn(true);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = adminUsername.trim().toLowerCase();
    const p = adminPassword.trim();
    if (
      (u === 'admin' && (p === 'admin11' || p === 'admin11fightcamp' || p === '11fightcamp' || p === '1111')) ||
      (u === 'admin11' && (p === 'admin11' || p === 'admin11fightcamp' || p === '11fightcamp' || p === '1111')) ||
      (u === '11fc' && (p === '11fc' || p === '1111'))
    ) {
      localStorage.setItem('11fc_admin_auth', 'true');
      sessionStorage.setItem('11fc_admin_auth', 'true');
      setIsAdminLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError('Username atau Password Admin salah. Masukkan kredensial yang benar.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('11fc_admin_auth');
    sessionStorage.removeItem('11fc_admin_auth');
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    setAdminPassword('');
  };

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

  // Edit Schedule Modal / Form State
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editClassId, setEditClassId] = useState('');
  const [editTrainerId, setEditTrainerId] = useState('');
  const [editDay, setEditDay] = useState<number>(1);
  const [editStartTime, setEditStartTime] = useState('16:30');
  const [editEndTime, setEditEndTime] = useState('18:00');
  const [editCapacity, setEditCapacity] = useState<number>(15);
  const [editPrice, setEditPrice] = useState<number>(75000);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  // New Member Modal / Form State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPlanId, setMemberPlanId] = useState('pack-10');
  const [memberPaymentMethod, setMemberPaymentMethod] = useState<'transfer' | 'cash' | 'qris' | 'edc'>('transfer');
  const [memberPaymentStatus, setMemberPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [memberStartDate, setMemberStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberNotes, setMemberNotes] = useState('');
  const [isSavingMember, setIsSavingMember] = useState(false);

  // Filter state for bookings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'attended' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter state for members
  const [memberFilter, setMemberFilter] = useState<'all' | 'active' | 'pending' | 'expired' | 'inactive'>('all');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesData, bookingsData, classesData, trainersData, membersData] = await Promise.all([
        fetchSchedules(),
        fetchBookings(),
        fetchClasses(),
        fetchTrainers(),
        fetchMembers(),
      ]);
      setSchedules(schedulesData);
      setBookings(bookingsData);
      setClasses(classesData);
      setTrainers(trainersData);
      setMembers(membersData);

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

  // Handle Open Edit Schedule
  const handleOpenEditSchedule = (sch: Schedule) => {
    setEditingSchedule(sch);
    setEditClassId(sch.classId);
    setEditTrainerId(sch.trainerId);
    setEditDay(sch.dayOfWeek);
    setEditStartTime(sch.startTime);
    setEditEndTime(sch.endTime);
    setEditCapacity(sch.maxCapacity);
    setEditPrice(sch.price);
  };

  // Handle Save Edit Schedule
  const handleSaveEditSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule || !editClassId || !editTrainerId) return;

    setIsEditingSchedule(true);
    try {
      await updateSchedule(editingSchedule.id, {
        classId: editClassId,
        trainerId: editTrainerId,
        dayOfWeek: editDay,
        startTime: editStartTime,
        endTime: editEndTime,
        maxCapacity: Number(editCapacity),
        price: Number(editPrice),
      });

      await loadData();
      setEditingSchedule(null);
    } catch (err) {
      console.error(err);
      alert('Gagal mengupdate jadwal');
    } finally {
      setIsEditingSchedule(false);
    }
  };

  // Handle Add Member
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberPhone.trim()) return;

    const selectedPlan = MEMBERSHIP_PLANS.find((p) => p.id === memberPlanId) || MEMBERSHIP_PLANS[1];
    let durationDays = 30;
    let totalSessions: number | undefined = undefined;

    if (selectedPlan.id === 'pack-10') {
      durationDays = 45;
      totalSessions = 10;
    } else if (selectedPlan.id === 'private-pack') {
      durationDays = 45;
      totalSessions = 5;
    } else if (selectedPlan.id === 'unlimited-monthly') {
      durationDays = 30;
    }

    if (!memberName.trim() || !memberPhone.trim() || !memberEmail.trim()) {
      alert('Harap lengkapi Nama, No. WhatsApp, dan Email.');
      return;
    }

    setIsSavingMember(true);
    try {
      await saveNewMember({
        name: memberName,
        phone: memberPhone,
        email: memberEmail.trim(),
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        price: selectedPlan.price,
        paymentMethod: memberPaymentMethod,
        paymentStatus: memberPaymentStatus,
        startDate: memberStartDate,
        durationDays,
        totalSessions,
        notes: memberNotes || undefined,
      });

      await loadData();
      setShowAddMemberModal(false);
      setMemberName('');
      setMemberPhone('');
      setMemberEmail('');
      setMemberNotes('');
    } catch (err) {
      console.error(err);
      alert('Gagal mendaftarkan member');
    } finally {
      setIsSavingMember(false);
    }
  };

  // Handle Member Status Update (Confirm Payment)
  const handleConfirmMemberPayment = async (memberId: string) => {
    // Optimistic UI update
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              paymentStatus: 'paid',
              status: 'active',
              startDate: new Date().toISOString().split('T')[0],
            }
          : m
      )
    );
    await updateMemberStatus(memberId, 'paid', 'active');
    await loadData();
  };

  // Handle Decrement Member Session
  const handleDecrementSession = async (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId && typeof m.remainingSessions === 'number' && m.remainingSessions > 0
          ? { ...m, remainingSessions: m.remainingSessions - 1 }
          : m
      )
    );
    await decrementMemberSession(memberId);
    await loadData();
  };

  // Handle Increment Member Session
  const handleIncrementSession = async (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId && typeof m.remainingSessions === 'number'
          ? { ...m, remainingSessions: m.remainingSessions + 1 }
          : m
      )
    );
    await incrementMemberSession(memberId);
    await loadData();
  };

  // Handle Delete Member
  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Yakin ingin menghapus data member ini?')) return;
    await deleteMember(memberId);
    await loadData();
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

  // Handle Update Booking Status (with auto session deduction for package members)
  const handleUpdateStatus = async (booking: Booking, status: 'confirmed' | 'attended' | 'cancelled') => {
    if (status === 'attended') {
      const matchingMember = members.find(
        (m) =>
          (m.phone && m.phone.replace(/[^0-9]/g, '') === booking.customerPhone.replace(/[^0-9]/g, '')) ||
          (m.name && m.name.toLowerCase().trim() === booking.customerName.toLowerCase().trim())
      );

      if (matchingMember && typeof matchingMember.remainingSessions === 'number' && matchingMember.remainingSessions > 0) {
        const deduct = confirm(
          `Peserta ${booking.customerName} memiliki paket "${matchingMember.planTitle}" (Sisa: ${matchingMember.remainingSessions} sesi).\n\nTandai hadir dan potong 1 sesi? (Sisa akan menjadi ${matchingMember.remainingSessions - 1} sesi)`
        );
        if (deduct) {
          await decrementMemberSession(matchingMember.id);
        }
      }
    }

    await updateBookingStatus(booking.id, status);
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

  // Filter Members
  const filteredMembers = members.filter((m) => {
    if (memberFilter !== 'all' && m.status !== memberFilter) return false;
    if (memberSearchQuery.trim()) {
      const q = memberSearchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCode = m.memberCode.toLowerCase().includes(q);
      const matchPhone = m.phone.includes(q);
      const matchPlan = m.planTitle.toLowerCase().includes(q);
      return matchName || matchCode || matchPhone || matchPlan;
    }
    return true;
  });

  // Calculate Metrics
  const bookingRevenue = bookings
    .filter((b) => b.status === 'attended' || b.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.scheduleData?.price || 75000), 0);

  const memberRevenue = members
    .filter((m) => m.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalRevenue = bookingRevenue + memberRevenue;
  const activeMembersCount = members.filter((m) => m.status === 'active').length;

  // 1. ADMIN USERNAME & PASSWORD AUTHENTICATION GATE
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#090a0c] text-zinc-100 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center items-center">
          <div className="w-full p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#ba2d1d]/15 border border-[#ba2d1d]/40 flex items-center justify-center mx-auto text-[#ba2d1d]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d63725] block">
                Official Staff Access
              </span>
              <h1 className="text-2xl font-black text-white uppercase mt-1">
                Login Admin Sasana
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Halaman ini dilindungi untuk keamanan data sasana. Masukkan username dan password staf admin.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Username Admin
                </label>
                <input
                  type="text"
                  placeholder="Username (contoh: admin)"
                  value={adminUsername}
                  onChange={(e) => {
                    setAdminUsername(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Password Admin
                </label>
                <input
                  type="password"
                  placeholder="Password admin"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#ba2d1d]"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-400 font-bold">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs uppercase tracking-wider transition-all mt-2"
              >
                Masuk ke Panel Admin
              </button>
            </form>

            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              Kredensial Default: <span className="font-mono text-zinc-400 font-bold">admin / admin11</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

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
              PANEL ADMIN & OPERASIONAL 11FC
            </h1>
            <p className="text-xs text-zinc-400">
              Kelola jadwal sesi mingguan, pantau booking peserta, dan konfirmasi manual pembelian paket membership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              + Registrasi Member
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ba2d1d] hover:bg-[#d63725] text-white font-black text-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tambah Jadwal
            </button>
            <button
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white font-bold text-xs transition-colors"
              title="Keluar Admin"
            >
              <LogOut className="w-4 h-4 text-zinc-400" />
              Logout
            </button>
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
            <span className="text-[11px] text-zinc-500">Reservasi drop-in</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase">Member Aktif</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {activeMembersCount}
            </div>
            <span className="text-[11px] text-zinc-500">Dari {members.length} member terdaftar</span>
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
              <span className="text-xs font-bold uppercase">Total Estimasi Omset</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-zinc-500">Booking + Paket Member Lunas</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'bookings'
                ? 'bg-[#ba2d1d] text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Daftar Reservasi ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'members'
                ? 'bg-[#ba2d1d] text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Manajemen Member ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'schedules'
                ? 'bg-[#ba2d1d] text-white'
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
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#ba2d1d]"
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
                      <th className="py-3 px-4">Peserta & Status Member</th>
                      <th className="py-3 px-4">Program & Sesi</th>
                      <th className="py-3 px-4">Tanggal & Jam</th>
                      <th className="py-3 px-4">Status Reservasi</th>
                      <th className="py-3 px-4 text-right">Aksi Check-in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                    {filteredBookings.map((b) => {
                      const memberMatch = members.find(
                        (m) =>
                          (m.phone && m.phone.replace(/[^0-9]/g, '') === b.customerPhone.replace(/[^0-9]/g, '')) ||
                          (m.name && m.name.toLowerCase().trim() === b.customerName.toLowerCase().trim())
                      );

                      return (
                        <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-rose-400 text-sm">
                              {b.bookingCode}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {b.customerName}
                              {memberMatch && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
                                  {memberMatch.planTitle}{' '}
                                  {typeof memberMatch.remainingSessions === 'number' &&
                                    `(Sisa: ${memberMatch.remainingSessions} sesi)`}
                                </span>
                              )}
                            </div>
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
                              {b.status === 'attended' ? '✓ Hadir' : b.status === 'cancelled' ? 'Batal' : 'Confirmed'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status !== 'attended' && (
                                <button
                                  onClick={() => handleUpdateStatus(b, 'attended')}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                                  title="Tandai Hadir (Check-in)"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Check-in
                                </button>
                              )}
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateStatus(b, 'cancelled')}
                                  className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-800/50"
                                  title="Batalkan Booking"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEMBERSHIP MANAGEMENT */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama member, kode, paket..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#ba2d1d]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {(['all', 'active', 'pending', 'expired', 'inactive'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMemberFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors shrink-0 ${
                      memberFilter === st
                        ? 'bg-zinc-200 text-black font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {st === 'all'
                      ? 'Semua Member'
                      : st === 'pending'
                      ? '⏳ Menunggu Konfirmasi'
                      : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of Members */}
            {loading ? (
              <div className="py-12 text-center text-zinc-500 text-xs">Memuat data membership...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs space-y-3">
                <Award className="w-8 h-8 text-zinc-600 mx-auto" />
                <p>Belum ada data member yang sesuai filter.</p>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#ba2d1d] hover:bg-[#d63725] text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Registrasi Member Pertama
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">ID Member</th>
                      <th className="py-3 px-4">Nama & WhatsApp</th>
                      <th className="py-3 px-4">Paket Membership</th>
                      <th className="py-3 px-4">Pembayaran</th>
                      <th className="py-3 px-4">Masa Aktif & Sisa Sesi</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-amber-400 text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
                            {m.memberCode}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-mono"
                            >
                              <Phone className="w-3 h-3" />
                              {m.phone}
                            </a>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-zinc-200">{m.planTitle}</div>
                          <div className="text-[11px] text-amber-400 font-semibold">
                            Rp {m.price.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-[11px] capitalize text-zinc-300">
                            <CreditCard className="w-3 h-3 text-zinc-400" />
                            {m.paymentMethod}
                          </div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
                              m.paymentStatus === 'paid'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                            }`}
                          >
                            {m.paymentStatus === 'paid' ? '✓ Lunas' : '⏳ Menunggu Konfirmasi'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[11px] text-zinc-300">
                            {m.startDate} s/d {m.endDate}
                          </div>
                          {typeof m.remainingSessions === 'number' && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                                  m.remainingSessions > 0
                                    ? 'text-amber-300 bg-amber-950/60 border-amber-800/50'
                                    : 'text-red-400 bg-red-950 border-red-900'
                                }`}
                              >
                                Sisa: {m.remainingSessions} / {m.totalSessions} sesi
                              </span>
                              {m.remainingSessions > 0 && (
                                <button
                                  onClick={() => handleDecrementSession(m.id)}
                                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-black text-[10px] border border-zinc-700 transition-colors"
                                  title="Potong 1 sesi saat member hadir latihan"
                                >
                                  -1 Sesi
                                </button>
                              )}
                              <button
                                onClick={() => handleIncrementSession(m.id)}
                                className="px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-[10px] border border-zinc-800 transition-colors"
                                title="Kembalikan / Tambah 1 sesi"
                              >
                                +1
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              m.status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                                : m.status === 'expired'
                                ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                                : m.status === 'pending'
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {m.status === 'active'
                              ? 'Aktif'
                              : m.status === 'pending'
                              ? 'Menunggu Bayar'
                              : m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {m.paymentStatus === 'pending' && (
                              <button
                                onClick={() => handleConfirmMemberPayment(m.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                                title="Konfirmasi Pembayaran Lunas"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Konfirmasi Lunas
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-900/40"
                              title="Hapus Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

        {/* TAB 3: SCHEDULES MANAGEMENT */}
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

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditSchedule(sch)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors border border-zinc-700"
                        title="Edit Jadwal"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: TAMBAH MEMBER BARU */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-white uppercase">Registrasi Member Baru</h3>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Nama Lengkap Member *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Alexander Pratama"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      No. WhatsApp (Aktif) *
                    </label>
                    <input
                      type="tel"
                      placeholder="08123456789"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Email Member (Wajib) *
                    </label>
                    <input
                      type="email"
                      placeholder="member@email.com"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Pilih Paket Membership *
                  </label>
                  <select
                    value={memberPlanId}
                    onChange={(e) => setMemberPlanId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  >
                    {MEMBERSHIP_PLANS.filter((p) => p.id !== 'drop-in').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} - Rp {p.price.toLocaleString('id-ID')} ({p.period})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      value={memberPaymentMethod}
                      onChange={(e) => setMemberPaymentMethod(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="transfer">Bank Transfer</option>
                      <option value="cash">Tunai / Cash</option>
                      <option value="qris">QRIS</option>
                      <option value="edc">Mesin EDC / Debit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Status Bayar
                    </label>
                    <select
                      value={memberPaymentStatus}
                      onChange={(e) => setMemberPaymentStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="paid">✓ Langsung Lunas (Aktif)</option>
                      <option value="pending">⏳ Menunggu Pembayaran</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Tanggal Mulai Member
                  </label>
                  <input
                    type="date"
                    value={memberStartDate}
                    onChange={(e) => setMemberStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Titip struk transfer / nomor loker"
                    value={memberNotes}
                    onChange={(e) => setMemberNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingMember}
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all"
                  >
                    {isSavingMember ? 'Menyimpan...' : 'Simpan & Aktifkan'}
                  </button>
                </div>
              </form>
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
                    className="w-1/2 py-2.5 rounded-xl btn-fire text-white text-xs font-black transition-all"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT JADWAL SESI */}
        {editingSchedule && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white uppercase">Edit Jadwal Sesi</h3>
                </div>
                <button
                  onClick={() => setEditingSchedule(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditSchedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Pilih Kelas / Disiplin
                  </label>
                  <select
                    value={editClassId}
                    onChange={(e) => setEditClassId(e.target.value)}
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
                    value={editTrainerId}
                    onChange={(e) => setEditTrainerId(e.target.value)}
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
                      value={editDay}
                      onChange={(e) => setEditDay(Number(e.target.value))}
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
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
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
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
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
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
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
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSchedule(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isEditingSchedule}
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs transition-all"
                  >
                    {isEditingSchedule ? 'Menyimpan...' : 'Simpan Perubahan'}
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

