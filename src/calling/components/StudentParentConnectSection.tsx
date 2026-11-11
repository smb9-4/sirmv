import React, { useState, useEffect } from 'react';
import {
  Phone,
  ShieldCheck,
  AlertCircle,
  Wifi,
  WifiOff,
  UserCheck,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCall } from '../context/CallContext';
import { apiRequest } from '../services/api';
import type { Contact, CallHistoryItem } from '../types/index';

export const StudentParentConnectSection: React.FC = () => {
  const { user, contacts, login, isLoading } = useAuth();
  const { initiateCall, activeCall } = useCall();
  const [scheduleInfo, setScheduleInfo] = useState<any>(null);
  const [history, setHistory] = useState<CallHistoryItem[]>([]);
  const [selectedParent, setSelectedParent] = useState<Contact | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-login as default student if not logged in to backend calling service
  useEffect(() => {
    async function ensureStudentSession() {
      if (!user && !isLoading) {
        try {
          await login('24CSE042', 'Password123!');
        } catch (err) {
          console.warn('Auto login for student calling failed:', err);
        }
      }
    }
    ensureStudentSession();
  }, [user, isLoading, login]);

  useEffect(() => {
    if (user) {
      fetchAvailability();
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    if (contacts.length > 0 && !selectedParent) {
      setSelectedParent(contacts[0]);
    }
  }, [contacts, selectedParent]);

  const fetchAvailability = async () => {
    try {
      const data = await apiRequest('/calls/availability');
      setScheduleInfo(data.schedule);
    } catch (e: any) {
      console.warn('Error fetching availability:', e);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await apiRequest<{ history: CallHistoryItem[] }>('/calls/history');
      setHistory(data.history || []);
    } catch (e) {
      console.warn('Error fetching call history:', e);
    }
  };

  const handleCallParent = async (parent: Contact) => {
    setErrorMessage(null);
    setLoadingAction(parent.uid);
    try {
      if (scheduleInfo && !scheduleInfo.isAllowed) {
        setErrorMessage(scheduleInfo.reason || 'Calling is currently outside permitted hours.');
        return;
      }
      await initiateCall(parent.uid, parent.name, parent.relationship, parent.avatarUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate call.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Student Calling Terminal Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Top Student Overview Row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#650000] text-white text-[10px] font-black uppercase tracking-wider">
                REGISTERED STUDENT TERMINAL
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                Roll No: {user?.rollNumber || '24CSE042'}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">
                UID: {user?.uid || 'STU-1001'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {user?.name || 'Aarav Sharma'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Authorized hostel voice terminal. Directly linked to verified parent accounts. Communications operate over direct peer-to-peer WebRTC audio streams without telephone routing or recordings.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-3 gap-3 shrink-0 self-stretch lg:self-auto">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center min-w-[95px]">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TERMINAL</div>
              <div className="text-lg sm:text-xl font-black text-[#650000] mt-1">ONLINE</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Ready</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center min-w-[95px]">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WINDOW</div>
              <div className="text-lg sm:text-xl font-black text-[#650000] mt-1">
                {scheduleInfo?.schedule?.maxDurationMinutes || 15}m
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Per Call</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center min-w-[95px]">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SECURITY</div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 mt-1">100%</div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">P2P Encrypted</div>
            </div>
          </div>
        </div>

        {/* Authorized Parent Contacts Selector */}
        <div className="mt-6 pt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#650000]" />
              <span>Authorized Parent Relationships ({contacts.length})</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Select a verified parent to start voice call
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((parent) => {
              const isSelected = selectedParent?.uid === parent.uid;
              const isOnline = parent.isOnline;

              return (
                <div
                  key={parent.uid}
                  onClick={() => setSelectedParent(parent)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-rose-50/40 border-[#650000] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      {parent.avatarUrl ? (
                        <img
                          src={parent.avatarUrl}
                          alt={parent.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#650000] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {parent.name[0]}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {parent.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#650000] border border-rose-200">
                          {parent.relationship || 'Parent'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        UID: {parent.uid}
                      </div>

                      <div className="text-[11px] mt-1 font-semibold flex items-center gap-1.5">
                        {isOnline ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Wifi className="w-3 h-3" /> Smartphone Online
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1">
                            <WifiOff className="w-3 h-3" /> Smartphone Offline
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                      isSelected ? 'bg-[#650000] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Call Button */}
        {selectedParent && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600 flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Verified connection target: <strong>{selectedParent.name}</strong> ({selectedParent.relationship})
              </span>
            </div>

            <button
              onClick={() => handleCallParent(selectedParent)}
              disabled={Boolean(activeCall) || (scheduleInfo && !scheduleInfo.isAllowed)}
              className={`px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeCall
                  ? 'bg-slate-400 cursor-not-allowed'
                  : scheduleInfo && !scheduleInfo.isAllowed
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#650000] hover:bg-[#500000] active:scale-95 shadow-[#650000]/20'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>
                {loadingAction === selectedParent.uid
                  ? 'Connecting Encrypted Call...'
                  : `Call ${selectedParent.relationship || selectedParent.name}`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Past Calling Records */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Past Voice Sessions & Logs
            </h3>
            <p className="text-xs text-slate-500">
              Encrypted WebRTC voice calling sessions between student tablet and parent smartphone
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
              Total Sessions: {history.length}
            </span>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-medium">
            No past calls recorded for this student terminal yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.slice(0, 4).map((call, idx) => (
              <div
                key={call.id || idx}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-rose-50 text-[#650000] font-black text-[10px] uppercase border border-rose-200/60">
                    VOICE SESSION
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(call.initiated_at).toLocaleDateString()} • {new Date(call.initiated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-base font-bold text-slate-900">
                  Call with {call.parentName || 'Parent'} ({call.relationship || 'Guardian'})
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">DURATION</div>
                    <div className="text-xs font-mono font-black text-[#650000] mt-0.5">
                      {call.duration_seconds > 0 ? `${call.duration_seconds}s` : '0s'}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">STATUS</div>
                    <div className="text-xs font-bold text-emerald-800 capitalize mt-0.5">
                      {call.status}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">REASON</div>
                    <div className="text-xs font-medium text-slate-600 truncate mt-0.5">
                      {call.end_reason || 'Normal'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Footer Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-center gap-3">
        <Info className="w-5 h-5 text-[#650000] shrink-0" />
        <span>
          <strong>Campus Security Notice:</strong> All voice streams are peer-to-peer encrypted between devices. No audio conversations are recorded, intercepted, or archived.
        </span>
      </div>
    </div>
  );
};

