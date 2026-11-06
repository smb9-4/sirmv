import React, { useState, useMemo } from 'react';
import {
  BookOpen, Search, Download, Eye, FileText, Calendar,
  User, Filter, ExternalLink, X, CheckCircle, FileCode
} from 'lucide-react';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import type { Note } from '../../types';

export default function NotesPage() {
  const { notes } = usePortal();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Subject list
  const subjects = [
    'All',
    'Data Structures',
    'Algorithms',
    'Theory of Computation',
    'Operating Systems',
    'Physics',
    'Chemistry',
    'Mathematics',
    'English',
  ];

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedSubject !== 'All' && n.subject !== selectedSubject) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.chapter.toLowerCase().includes(q) ||
          n.uploadedBy.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notes, selectedSubject, searchQuery]);

  const handleDownload = (note: Note) => {
    setDownloadSuccess(`Downloaded "${note.title}" (${note.fileSize})`);
    setTimeout(() => setDownloadSuccess(null), 3000);
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
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                LECTURE NOTES & COURSE MATERIALS
              </h1>
              <p className="text-xs text-gray-500">
                Official unit notes, question banks, and lecture slides uploaded by faculty
              </p>
            </div>
          </div>

          <div
            className="text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto"
            style={{ background: '#FFE59A', color: '#500000' }}
          >
            {filteredNotes.length} Document{filteredNotes.length === 1 ? '' : 's'} Available
          </div>
        </div>

        {/* Download notification alert */}
        {downloadSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs font-bold text-green-800">
            <CheckCircle size={16} className="text-green-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Search & Subject Tabs Bar */}
        <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes by topic, chapter, keyword or professor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-lg border border-institutional-border focus:outline-none focus:ring-2 focus:ring-crimson"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter size={13} /> Subject:
            </span>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 text-xs rounded-full font-bold whitespace-nowrap transition ${
                  selectedSubject === sub
                    ? 'bg-crimson text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-institutional-border">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No lecture notes found</h3>
              <p className="text-xs text-gray-500 mt-1">Try selecting a different subject or clearing your search query.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl shadow-card border border-institutional-border p-5 flex flex-col justify-between hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  {/* Top file type badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-red-100 text-red-800">
                      <FileText size={12} /> {note.fileType} • {note.fileSize}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {note.chapter}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                    {note.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                    {note.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-institutional-border text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-gray-400" />
                      <span>Uploaded by: <strong>{note.uploadedBy}</strong> ({note.uploadedByRole})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={13} />
                      <span>Date: {note.uploadDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-institutional-border flex items-center gap-2">
                  <button
                    onClick={() => setPreviewNote(note)}
                    className="flex-1 py-2 px-3 rounded-full font-bold text-xs border border-institutional-border text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => handleDownload(note)}
                    className="flex-1 py-2 px-3 rounded-full font-bold text-xs text-white shadow-sm hover:opacity-90 transition flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: '#A60000' }}
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Document Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-institutional-border overflow-hidden">
            {/* Modal Header */}
            <div
              className="p-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 100%)' }}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-gold-light" style={{ color: '#FFE59A' }} />
                <div>
                  <h3 className="font-bold text-sm md:text-base leading-tight">
                    {previewNote.title}
                  </h3>
                  <p className="text-[11px] text-white/80">
                    {previewNote.subject} • {previewNote.chapter} • Faculty: {previewNote.uploadedBy}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Realistic Academic Document Viewer */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-gray-800 leading-relaxed bg-gray-50 flex-1">
              {/* College Official Letterhead in Document */}
              <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm space-y-4">
                <div className="text-center border-b pb-4 border-gray-300">
                  <h2 className="font-extrabold text-base text-maroon-deep">
                    SIR MV GROUP OF INSTITUTIONS
                  </h2>
                  <p className="text-xs text-gray-500">
                    Department of Computer Science & Engineering
                  </p>
                  <p className="text-xs font-bold text-crimson mt-1">
                    Course: {previewNote.subject} | {previewNote.chapter}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1">
                    1. Chapter Overview & Objectives
                  </h3>
                  <p className="text-gray-700">
                    {previewNote.description}
                  </p>
                  <p className="text-gray-700">
                    This unit covers formal definitions, structural properties, algorithm implementations, time and space complexity theorems, and practical real-world applications in software engineering.
                  </p>

                  <h3 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 pt-2">
                    2. Key Concepts & Definitions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Fundamental theorems and axiomatic definitions.</li>
                    <li>Asymptotic analysis and recurrence relations: T(n) = aT(n/b) + f(n).</li>
                    <li>Standard implementations and memory representation.</li>
                    <li>Previous VTU exam questions and model solutions (2020–2025).</li>
                  </ul>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                    <strong>Note from {previewNote.uploadedBy}:</strong> Students are advised to solve the chapter-end practice exercises before attending the internal assessment examination.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-institutional-border flex items-center justify-between">
              <span className="text-xs text-gray-500">Format: {previewNote.fileType} Document ({previewNote.fileSize})</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewNote(null)}
                  className="px-4 py-2 rounded-full font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewNote);
                    setPreviewNote(null);
                  }}
                  className="px-5 py-2 rounded-full font-bold text-xs text-white shadow-sm hover:opacity-90 flex items-center gap-1.5"
                  style={{ backgroundColor: '#A60000' }}
                >
                  <Download size={14} /> Download Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

