import React, { useState } from 'react';
import {
  FolderOpen, Upload, Trash2, CheckCircle2, Video, FileText,
  Link as LinkIcon, FileCheck, Presentation
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfessorMaterialsUpload() {
  const { studyMaterials, addStudyMaterial, deleteStudyMaterial } = usePortal();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [chapter, setChapter] = useState('Unit 4');
  const [topic, setTopic] = useState('AVL Trees & Tree Rotations');
  const [category, setCategory] = useState<'JEE' | 'NEET' | 'CET' | 'Theory' | 'General'>('Theory');
  const [resourceType, setResourceType] = useState<'PDF' | 'Video' | 'PPT' | 'Link' | 'Worksheet'>('Video');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addStudyMaterial({
      title: title.trim(),
      subject,
      chapter,
      topic,
      category,
      resourceType,
      uploadedBy: user?.name || 'Dr. Priya Nayak',
      uploadDate: new Date().toISOString().split('T')[0],
      description: description.trim(),
      duration: resourceType === 'Video' ? '35 mins' : undefined,
      fileSize: resourceType !== 'Video' ? '4.2 MB' : undefined,
    });

    setTitle('');
    setDescription('');
    setSuccessMsg('Learning resource successfully uploaded to student portal!');
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
              <FolderOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                STUDY MATERIALS & DIGITAL LEARNING UPLOAD
              </h1>
              <p className="text-xs text-gray-500">
                Publish video lectures, interactive worksheets, competitive kits, and web links
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
              Add Learning Resource
            </h2>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Resource Title</label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass: AVL Tree Rotations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs bg-white outline-none"
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
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs bg-white outline-none"
                  >
                    <option value="Theory">VTU Theory</option>
                    <option value="JEE">JEE Prep</option>
                    <option value="CET">CET Engineering</option>
                    <option value="NEET">NEET Prep</option>
                    <option value="General">General Reference</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as any)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs bg-white outline-none"
                  >
                    <option value="Video">Video Lecture</option>
                    <option value="PDF">PDF Document</option>
                    <option value="PPT">Presentation PPT</option>
                    <option value="Worksheet">Practice Worksheet</option>
                    <option value="Link">Reference Link</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline key learning outcomes, prerequisites, and resource instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2 text-xs outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-full font-bold text-white text-xs shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
                style={{ backgroundColor: '#A60000' }}
              >
                <Upload size={14} /> Upload Study Material
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Uploaded Learning Resources ({studyMaterials.length})
            </h2>

            <div className="space-y-3">
              {studyMaterials.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-institutional-border bg-gray-50 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-800">
                        {m.resourceType}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: '#FFE59A', color: '#500000' }}>
                        {m.category}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{m.subject} • {m.topic}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{m.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{m.description}</p>
                    <span className="text-[11px] text-gray-400 mt-2 block">
                      Uploaded by: {m.uploadedBy} on {m.uploadDate}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteStudyMaterial(m.id)}
                    className="text-gray-400 hover:text-red-600 p-1 shrink-0"
                    title="Delete Material"
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

