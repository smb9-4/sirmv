import React, { useState } from 'react';
import {
  MessageSquare, Send, CheckCircle2, Clock, AlertCircle,
  Paperclip, FileText, ChevronRight, Sparkles, Filter, X
} from 'lucide-react';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import type { Complaint } from '../../types';

export default function ComplaintsPage() {
  const { complaints, addComplaint } = usePortal();

  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  // Form State
  const [category, setCategory] = useState('Academic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  // Success State
  const [latestSubmitted, setLatestSubmitted] = useState<Complaint | null>(null);
  const [formError, setFormError] = useState('');

  const categories = [
    'Academic',
    'Faculty-related',
    'Infrastructure',
    'Examination',
    'Administration',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a brief subject/title for your complaint.');
      return;
    }
    if (!description.trim() || description.trim().length < 15) {
      setFormError('Please provide a detailed description (minimum 15 characters).');
      return;
    }

    const created = addComplaint({
      category,
      title: title.trim(),
      description: description.trim(),
      hasAttachment,
    });

    setLatestSubmitted(created);
    setTitle('');
    setDescription('');
    setHasAttachment(false);
    setAttachmentName(null);
  };

  const handleSimulateAttachment = () => {
    setHasAttachment(true);
    setAttachmentName('evidence_report_doc.pdf');
  };

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
      <StudentNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                STUDENT COMPLAINT & GRIEVANCE REDRESSAL CELL
              </h1>
              <p className="text-xs text-gray-500">
                Formal confidential channel to register academic, faculty, or infrastructure grievances
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'submit' ? 'bg-crimson text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              New Complaint
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'history' ? 'bg-crimson text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Previous Complaints ({complaints.length})
            </button>
          </div>
        </div>

        {/* TAB 1: SUBMIT COMPLAINT */}
        {activeTab === 'submit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Submission Success Box */}
              {latestSubmitted && (
                <div
                  className="rounded-2xl p-6 border shadow-md space-y-3"
                  style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-green-800 font-bold text-base">
                      <CheckCircle2 size={22} className="text-green-600" />
                      Grievance Lodged Successfully!
                    </div>
                    <button
                      onClick={() => setLatestSubmitted(null)}
                      className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-gray-700">
                    Your complaint has been assigned to the Academic Redressal Committee.
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-green-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference Number:</span>
                      <strong className="text-maroon-deep font-mono text-sm">{latestSubmitted.referenceNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <strong className="text-gray-800">{latestSubmitted.category}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subject:</span>
                      <strong className="text-gray-800">{latestSubmitted.title}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Status:</span>
                      {getStatusBadge(latestSubmitted.status)}
                    </div>
                  </div>
                </div>
              )}

              {/* Complaint Submission Form */}
              <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 md:p-8">
                <h2 className="text-lg font-black text-gray-900 pb-3 border-b border-institutional-border mb-5">
                  LODGE A FORMAL GRIEVANCE
                </h2>

                {formError && (
                  <div
                    className="p-3 mb-4 rounded-lg flex items-center gap-2 text-xs font-semibold border"
                    style={{ backgroundColor: '#FFF0F0', borderColor: '#F37F84', color: '#900000' }}
                  >
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Category Selection */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1.5">
                      1. Complaint Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`py-2 px-3 rounded-lg font-bold border transition text-center ${
                            category === cat
                              ? 'bg-crimson text-white border-crimson shadow-sm'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title / Subject */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1.5">
                      2. Grievance Subject / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lab Oscilloscope Calibration Issue in Electronics Lab"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-institutional-border rounded-lg p-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1.5">
                      3. Detailed Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Provide specific details including dates, room numbers, apparatus details, or relevant circumstances..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-institutional-border rounded-lg p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
                    />
                  </div>

                  {/* Optional Attachment */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1.5">
                      4. Supporting Document / Evidence (Optional)
                    </label>
                    {hasAttachment ? (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FileText size={16} className="text-crimson" />
                          <span>{attachmentName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setHasAttachment(false); setAttachmentName(null); }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSimulateAttachment}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-crimson hover:bg-red-50/30 transition flex items-center justify-center gap-2 text-gray-600"
                      >
                        <Paperclip size={16} /> Attach Supporting Document (PDF / JPEG)
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                      style={{ backgroundColor: '#A60000' }}
                    >
                      <Send size={16} /> Submit Grievance
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Grievance Guidelines Box */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-900 border-b border-institutional-border pb-2">
                  Institutional Redressal Policy
                </h3>
                <ul className="text-xs text-gray-600 space-y-2.5 leading-relaxed">
                  <li>• All complaints are tracked by a generated reference ID.</li>
                  <li>• Academic grievances are escalated directly to the Head of Department.</li>
                  <li>• Infrastructure issues are reviewed by Campus Estate Maintenance within 48 hours.</li>
                  <li>• Student identity is protected in accordance with college privacy norms.</li>
                </ul>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-500 space-y-1">
                  <p><strong>Emergency Contact:</strong></p>
                  <p>Grievance Officer: 08192-224455 (Ext. 201)</p>
                  <p>Email: grievance@sirmv.edu.in</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PREVIOUS COMPLAINTS HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-black text-gray-900 pb-3 border-b border-institutional-border">
              YOUR PREVIOUS LODGED COMPLAINTS ({complaints.length})
            </h2>

            {complaints.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-bold text-gray-700">No complaints registered yet.</h3>
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-xl border border-institutional-border bg-gray-50/50 hover:bg-gray-50 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-maroon-deep bg-red-100/60 px-2 py-0.5 rounded">
                          {c.referenceNumber}
                        </span>
                        <span className="text-xs font-bold text-gray-600 px-2 py-0.5 rounded bg-gray-200">
                          {c.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(c.status)}
                        <span className="text-xs text-gray-400">Date: {c.submittedDate}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900">{c.title}</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">{c.description}</p>

                    {c.hasAttachment && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                        <Paperclip size={12} /> Attachment Included
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

