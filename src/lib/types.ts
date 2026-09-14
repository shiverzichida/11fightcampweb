export type Category = 
  | 'all' 
  | 'striking' 
  | 'bjj' 
  | 'hyrox' 
  | 'kids' 
  | 'yoga' 
  | 'zumba' 
  | 'muay-thai' 
  | 'boxing' 
  | 'mma' 
  | 'conditioning' 
  | 'private';

export interface ClassItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  durationMinutes: number;
  intensity: 'Beginner Friendly' | 'Intermediate' | 'High Intensity' | 'All Levels';
  imageUrl: string;
  equipmentNeeded: string[];
  benefits: string[];
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  photoUrl: string;
  instagram?: string;
  achievements: string[];
}

export interface Schedule {
  id: string;
  classId: string;
  trainerId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // '16:30'
  endTime: string;   // '18:00'
  maxCapacity: number;
  price: number;
  isActive: boolean;
  classData?: ClassItem;
  trainerData?: Trainer;
}

export interface Booking {
  id: string;
  bookingCode: string;
  scheduleId: string;
  bookingDate: string; // 'YYYY-MM-DD'
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  experienceLevel: 'first_time' | 'beginner' | 'intermediate' | 'advanced';
  status: 'confirmed' | 'attended' | 'cancelled';
  notes?: string;
  createdAt: string;
  scheduleData?: Schedule;
}

export interface MembershipPlan {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  period: string;
  isPopular?: boolean;
  features: string[];
  badge?: string;
}

export interface Member {
  id: string;
  memberCode: string; // e.g. 11FC-M001
  name: string;
  phone: string;
  username?: string;
  password?: string;
  email?: string;
  planId: string;
  planTitle: string;
  price: number;
  paymentMethod: 'cash' | 'transfer' | 'qris' | 'edc';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  status: 'active' | 'pending' | 'expired' | 'inactive';
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  remainingSessions?: number; // for multi-session packages (e.g. 8x / 12x)
  totalSessions?: number;
  notes?: string;
  createdAt: string;
}

