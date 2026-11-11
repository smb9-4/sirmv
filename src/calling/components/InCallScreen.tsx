import React from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Shield,
  User as UserIcon,
  Clock,
  Wifi
} from 'lucide-react';
import { useCall } from '../context/CallContext.js';
import { AudioVisualizer } from './AudioVisualizer.js';

export const InCallScreen: React.FC = () => {
  const {
    activeCall,
    isMuted,
    localAudioLevel,
    remoteAudioLevel,
    connectionState,
    endActiveCall,
    toggleMute,
  } = useCall();

  if (!activeCall || (activeCall.isIncoming && activeCall.status === 'ringing')) {
    return null;
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isConnected = activeCall.status === 'connected';
  const isEndedOrFailed = ['ended', 'rejected', 'missed', 'failed'].includes(activeCall.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#fffefb] border-2 border-[#e8dfcf] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
        
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between border-b border-[#f0e9dc] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-[#5b0d18] uppercase tracking-wider">
              {activeCall.isIncoming ? 'Parent-Connect • Student Calling' : 'Parent-Connect • Voice Call'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6eee3] text-[11px] font-mono text-slate-700 font-bold">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">{connectionState}</span>
          </div>
        </div>

        {/* Peer Profile Photo */}
        <div className="relative mb-4">
          {activeCall.peerAvatar ? (
            <img
              src={activeCall.peerAvatar}
              alt={activeCall.peerName}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 transition-all duration-300 ${
                isConnected
                  ? 'border-[#720e1e] shadow-xl shadow-[#720e1e]/20'
                  : 'border-amber-400 shadow-xl shadow-amber-400/20 animate-pulse'
              }`}
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#5b0d18] border-4 border-amber-300 flex items-center justify-center text-white">
              <UserIcon className="w-14 h-14" />
            </div>
          )}

          {isConnected && (
            <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-3 border-white rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-[#2e050c] tracking-tight text-center">
          {activeCall.peerName}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-slate-600 text-xs">
          {activeCall.relationship && (
            <span className="bg-[#fde8eb] text-[#720e1e] border border-[#f8c5cc] px-2.5 py-0.5 rounded-full font-bold">
              {activeCall.relationship}
            </span>
          )}
          {activeCall.peerRollNumber && (
            <span className="font-mono bg-[#f6eee3] px-2 py-0.5 rounded text-slate-700 font-bold">
              Roll: {activeCall.peerRollNumber}
            </span>
          )}
        </div>

        {/* Call Timer or Status message */}
        <div className="mt-5 flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#f6eee3] border border-[#e8dfcf] text-[#5b0d18] font-mono text-xl font-black tracking-wider shadow-inner">
              <Clock className="w-4 h-4 animate-spin text-[#720e1e]" />
              <span>{formatTimer(activeCall.durationSeconds)}</span>
            </div>
          ) : (
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              isEndedOrFailed ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
            }`}>
              {activeCall.statusMessage || activeCall.status}
            </div>
          )}
        </div>

        {/* Live Audio Visualizers */}
        {isConnected && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <AudioVisualizer
              label="Your Microphone"
              level={localAudioLevel}
              isMuted={isMuted}
              isLocal={true}
            />
            <AudioVisualizer
              label={activeCall.peerName.split(' ')[0] + "'s Voice"}
              level={remoteAudioLevel}
              isLocal={false}
            />
          </div>
        )}

        {/* In-Call Controls */}
        <div className="w-full mt-8 flex items-center justify-center gap-6">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            disabled={!isConnected}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md ${
              isMuted
                ? 'bg-rose-600 text-white'
                : 'bg-[#f6eee3] hover:bg-[#fae7d4] text-slate-800 border border-[#d8cbb7]'
            } ${!isConnected && 'opacity-40 cursor-not-allowed'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => endActiveCall('normal')}
            className="w-16 h-16 rounded-full bg-[#a11628] hover:bg-[#86101f] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-rose-900/40 transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker indicator */}
          <div
            className="w-14 h-14 rounded-full bg-[#f6eee3] text-slate-800 border border-[#d8cbb7] flex items-center justify-center shadow-md"
            title="Voice Link Active"
          >
            <Volume2 className="w-6 h-6 text-[#5b0d18]" />
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-700" />
          <span>SIR MV PU COLLEGE • Encrypted P2P Voice Session</span>
        </div>
      </div>
    </div>
  );
};
