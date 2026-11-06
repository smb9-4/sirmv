import React, { useState } from 'react';
import {
  MessageSquare, CheckCircle2, Clock, AlertCircle, Filter,
  Paperclip, UserCheck
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import type { Complaint } from '../../types';

export default function ProfessorFeedback() {
  const { complaints, updateComplaintStatus } = usePortal();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredComplaints = complaints.filter(c => {
    if (selectedStatus === 'All') return true;
    return c.status === selectedStatus;
  });

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'Submitted':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Submitted</span>;
      case 'Under Review':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Under Review</span>;
      case 'Resolved':
        return <span className="bg-green-100 text-green-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Resolved</span>;
    }
  };

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <MessageSquare size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                STUDENT GRIEVANCES & FEEDBACK DESK
              </h1>
              <p className="text-xs text-gray-500">
                Review submitted student issues, track resolution timelines, and update redressal statuses
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border flex items-center gap-2 text-xs font-bold">
          <span className="text-gray-500 mr-2 flex items-center gap-1">
            <Filter size={14} /> Filter:
          </span>
          {['All', 'Submitted', 'Under Review', 'Resolved'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedStatus === s ? 'bg-crimson text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grievances List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-institutional-border">
              <p className="text-xs text-gray-500">No student complaints found matching this status.</p>
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-maroon-deep bg-red-100/60 px-2.5 py-1 rounded">
                      {c.referenceNumber}
                    </span>
                    <span className="text-xs font-bold text-gray-700 px-2.5 py-1 rounded bg-gray-100">
                      {c.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(c.status)}
                    <span className="text-xs text-gray-400">Filed: {c.submittedDate}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-gray-900">{c.title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  {c.description}
                </p>

                {c.hasAttachment && (
                  <div className="flex items-center gap-1.5 text-xs text-crimson font-bold">
                    <Paperclip size={13} /> Supporting evidence attached by student
                  </div>
                )}

                {/* Faculty Action Bar */}
                <div className="pt-3 border-t border-institutional-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500 font-semibold">Change Redressal Status:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateComplaintStatus(c.id, 'Under Review')}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                        c.status === 'Under Review' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => updateComplaintStatus(c.id, 'Resolved')}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                        c.status === 'Resolved' ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

