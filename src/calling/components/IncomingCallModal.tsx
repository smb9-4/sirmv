import React from 'react';
import { Phone, PhoneOff, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useCall } from '../context/CallContext.js';

export const IncomingCallModal: React.FC = () => {
  const { activeCall, acceptIncomingCall, rejectIncomingCall } = useCall();

  if (!activeCall || !activeCall.isIncoming || activeCall.status !== 'ringing') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#fffefb] border-2 border-[#e8dfcf] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        
        {/* Background Ripple Animation */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border border-emerald-500/30 animate-pulse-ring pointer-events-none" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border border-emerald-500/20 animate-pulse-ring-delayed pointer-events-none" />

        {/* Security badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcfce7] border border-emerald-300 text-emerald-900 text-xs font-bold mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Parent-Connect Incoming Call</span>
        </div>

        {/* Student Avatar */}
        <div className="relative mb-5">
          {activeCall.peerAvatar ? (
            <img
              src={activeCall.peerAvatar}
              alt={activeCall.peerName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-500 shadow-xl shadow-emerald-500/20"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#5b0d18] border-4 border-emerald-500 flex items-center justify-center text-white shadow-xl">
              <UserIcon className="w-12 h-12" />
            </div>
          )}
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
        </div>

        {/* Caller Info */}
        <h3 className="text-2xl font-black text-[#2e050c] tracking-tight">
          {activeCall.peerName}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-slate-600 text-xs font-semibold">
          {activeCall.peerRollNumber && (
            <span className="font-mono bg-[#f6eee3] px-2 py-0.5 rounded text-slate-800">
              Roll: {activeCall.peerRollNumber}
            </span>
          )}
          <span>•</span>
          <span className="text-[#720e1e] font-bold">Child / Student</span>
        </div>

        <p className="mt-4 text-xs font-black text-emerald-700 uppercase tracking-widest animate-pulse">
          Incoming Voice Call...
        </p>

        {/* Action Buttons: Decline & Answer */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <button
            onClick={() => rejectIncomingCall('declined_by_parent')}
            className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-[#801020] hover:bg-[#680b18] active:scale-95 text-white rounded-2xl font-bold shadow-lg shadow-rose-900/20 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
              <PhoneOff className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold">Decline</span>
          </button>

          <button
            onClick={acceptIncomingCall}
            className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center animate-bounce">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold">Answer</span>
          </button>
        </div>

        <div className="mt-6 text-[11px] text-slate-500 font-semibold">
          SIR MV PU COLLEGE • Direct Encrypted Audio
        </div>
      </div>
    </div>
  );
};
