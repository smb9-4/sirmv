export type UserRole = 'student' | 'parent' | 'admin';

export interface User {
  uid: string;
  name: string;
  role: UserRole;
  rollNumber?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  isOnline?: boolean;
}

export interface Contact {
  uid: string;
  name: string;
  role: string;
  relationship?: string;
  rollNumber?: string | null;
  avatarUrl?: string | null;
  isOnline: boolean;
  phone?: string | null;
}

export type CallStatus = 
  | 'idle' 
  | 'calling' 
  | 'ringing' 
  | 'connecting' 
  | 'connected' 
  | 'rejected' 
  | 'missed' 
  | 'ended' 
  | 'failed';

export interface ActiveCall {
  callId: string;
  peerUid: string;
  peerName: string;
  peerAvatar?: string | null;
  peerRollNumber?: string | null;
  relationship?: string;
  isIncoming: boolean;
  status: CallStatus;
  startedAt?: number;
  durationSeconds: number;
  maxDurationMinutes?: number;
  statusMessage?: string;
}

export interface CallHistoryItem {
  id: string;
  student_uid: string;
  parent_uid: string;
  status: string;
  initiated_at: string;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number;
  end_reason: string | null;
  studentName?: string;
  studentRoll?: string;
  studentAvatar?: string;
  parentName?: string;
  parentAvatar?: string;
  relationship?: string;
}

export interface ScheduleRule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_duration_minutes: number;
  is_active: number;
  student_uid?: string | null;
}

