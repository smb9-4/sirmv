import React, { useState } from 'react';
import {
  BookOpen, Upload, Trash2, CheckCircle2, FileText, Calendar,
  User, Sparkles
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfessorNotesUpload() {
  const { notes, addNote, deleteNote } = usePortal();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [chapter, setChapter] = useState('Unit 5: Graph Algorithms');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'DOC' | 'PPT'>('PDF');
  const [fileSize, setFileSize] = useState('2.1 MB');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addNote({
      title: title.trim(),
      subject,
      chapter,
      uploadedBy: user?.name || 'Dr. Priya Nayak',
      uploadedByRole: (user as any)?.designation || 'Associate Professor',
      uploadDate: new Date().toISOString().split('T')[0],
      fileType,
      fileSize,
      description: description.trim(),
    });

    setTitle('');
    setDescription('');
    setSuccessMsg('Lecture note PDF successfully uploaded and available to students!');
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
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                COURSE LECTURE NOTES UPLOAD
              </h1>
              <p className="text-xs text-gray-500">
                Publish unit syllabus notes, presentation slides and question banks
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
          {/* Upload Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Upload New Document
            </h2>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms & Dijkstra's Algorithm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-crimson"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white outline-none"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Theory of Computation">Theory of Computation</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Unit / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 4 or Chapter 5"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of topics covered, example problems, and formulas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Format</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs bg-white outline-none"
                  >
                    <option value="PDF">PDF File</option>
                    <option value="DOC">Word Document</option>
                    <option value="PPT">Presentation PPT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-full font-bold text-white text-xs shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
                style={{ backgroundColor: '#A60000' }}
              >
                <Upload size={14} /> Upload to Student Portal
              </button>
            </form>
          </div>

          {/* Uploaded Notes List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Published Course Notes ({notes.length})
            </h2>

            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl border border-institutional-border bg-gray-50 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-red-100 text-red-800">
                        {n.fileType} • {n.fileSize}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{n.subject} • {n.chapter}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{n.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{n.description}</p>
                    <span className="text-[11px] text-gray-400 mt-2 block">
                      Uploaded by: {n.uploadedBy} on {n.uploadDate}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteNote(n.id)}
                    className="text-gray-400 hover:text-red-600 p-1 shrink-0"
                    title="Delete Note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

