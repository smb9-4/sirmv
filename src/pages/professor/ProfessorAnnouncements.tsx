import React, { useState } from 'react';
import {
  Bell, Send, Trash2, CheckCircle2, AlertCircle, PlusCircle,
  Calendar, User
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfessorAnnouncements() {
  const { announcements, addAnnouncement, deleteAnnouncement } = usePortal();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [targetRole, setTargetRole] = useState<'student' | 'professor' | 'all'>('student');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addAnnouncement({
      senderName: user?.name || 'Dr. Priya Nayak',
      designation: (user as any)?.designation || 'Associate Professor',
      department: (user as any)?.department || 'Computer Science Engineering',
      title: title.trim(),
      message: message.trim(),
      isUrgent,
      targetRole,
    });

    setTitle('');
    setMessage('');
    setIsUrgent(false);
    setSuccessMsg('Announcement successfully published to student portal!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <Bell size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                DEPARTMENTAL ANNOUNCEMENT CONSOLE
              </h1>
              <p className="text-xs text-gray-500">
                Publish official circulars, reminders, and deadline alerts directly to students
              </p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" /> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Publish Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Compose Announcement
            </h2>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms Lab Revision Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-crimson outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white outline-none"
                >
                  <option value="student">5th Semester Students</option>
                  <option value="all">Entire College (Staff & Students)</option>
                  <option value="professor">Department Faculty Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Full Message Content</label>
                <textarea
                  rows={4}
                  placeholder="Type the official announcement details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-crimson outline-none"
                  required
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-crimson focus:ring-crimson"
                />
                <span>Mark as Urgent Notice (Red Highlight)</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full font-bold text-white shadow-md text-xs flex items-center justify-center gap-2 hover:opacity-90 transition"
                style={{ backgroundColor: '#A60000' }}
              >
                <Send size={14} /> Publish Announcement
              </button>
            </form>
          </div>

          {/* Published Announcements List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Existing Circulars ({announcements.length})
            </h2>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl border border-institutional-border bg-gray-50 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {a.isUrgent && (
                          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Urgent</span>
                        )}
                        <span className="text-[11px] font-bold text-gray-500">{a.department}</span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">{a.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{a.message}</p>
                    </div>

                    <button
                      onClick={() => deleteAnnouncement(a.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete notice"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-200 flex justify-between">
                    <span>By: {a.senderName} ({a.designation})</span>
                    <span>{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

