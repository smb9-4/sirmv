import React, { useState, useMemo } from 'react';
import {
  FolderOpen, Search, Video, FileText, Presentation, Link as LinkIcon,
  FileCheck, Download, ExternalLink, Filter, Play, X, CheckCircle,
  Clock, Sparkles
} from 'lucide-react';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import type { StudyMaterial } from '../../types';

export default function StudyMaterialsPage() {
  const { studyMaterials } = usePortal();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<StudyMaterial | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const categories = ['All', 'JEE', 'NEET', 'CET', 'Theory', 'General'];
  const resourceTypes = ['All', 'Video', 'PDF', 'PPT', 'Worksheet', 'Link'];

  const filteredMaterials = useMemo(() => {
    return studyMaterials.filter((m) => {
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      if (selectedType !== 'All' && m.resourceType !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.topic.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [studyMaterials, selectedCategory, selectedType, searchQuery]);

  const handleAction = (item: StudyMaterial) => {
    if (item.resourceType === 'Video') {
      setActiveVideoModal(item);
    } else {
      setActionNotice(`Opened resource: "${item.title}"`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video size={16} className="text-red-600" />;
      case 'PPT': return <Presentation size={16} className="text-amber-600" />;
      case 'Worksheet': return <FileCheck size={16} className="text-blue-600" />;
      case 'Link': return <LinkIcon size={16} className="text-purple-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
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
              <FolderOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                COMPREHENSIVE LEARNING RESOURCES
              </h1>
              <p className="text-xs text-gray-500">
                Curated videos, competitive preparation kits, question banks, and reference guides
              </p>
            </div>
          </div>

          <div
            className="text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto"
            style={{ background: '#FFE59A', color: '#500000' }}
          >
            {filteredMaterials.length} Learning Resources
          </div>
        </div>

        {/* Action feedback */}
        {actionNotice && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs font-bold text-green-800">
            <CheckCircle size={16} className="text-green-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Search & Multi-Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by topic, competitive exam, subject, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-lg border border-institutional-border focus:outline-none focus:ring-2 focus:ring-crimson"
            />
          </div>

          {/* Exam Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-institutional-border">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <Filter size={13} /> Exam Track:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-maroon-deep text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resource Type Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              Type:
            </span>
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-0.5 text-xs rounded-lg font-bold border transition ${
                  selectedType === type
                    ? 'bg-crimson text-white border-crimson'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-institutional-border">
              <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No study materials match your criteria</h3>
              <p className="text-xs text-gray-500 mt-1">Try resetting the filters or modifying your search keywords.</p>
            </div>
          ) : (
            filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-xl shadow-card border border-institutional-border p-5 flex flex-col justify-between hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-gray-100 text-gray-800 border border-gray-200">
                      {getResourceIcon(mat.resourceType)} {mat.resourceType}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: '#FFE59A', color: '#500000' }}>
                      {mat.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                    {mat.title}
                  </h3>

                  <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                    <p>Subject: <strong>{mat.subject}</strong></p>
                    <p>Chapter / Topic: <strong>{mat.topic}</strong></p>
                  </div>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
                    {mat.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-institutional-border text-[11px] text-gray-400 flex items-center justify-between">
                    <span>By: {mat.uploadedBy}</span>
                    <span>{mat.fileSize || mat.duration || 'Online Resource'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-institutional-border">
                  <button
                    onClick={() => handleAction(mat)}
                    className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-white shadow-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: mat.resourceType === 'Video' ? '#A60000' : '#650000' }}
                  >
                    {mat.resourceType === 'Video' ? (
                      <>
                        <Play size={14} className="fill-current" /> Watch Video Lecture
                      </>
                    ) : mat.resourceType === 'Link' ? (
                      <>
                        <ExternalLink size={14} /> Open External Reference
                      </>
                    ) : (
                      <>
                        <Download size={14} /> Download / Access File
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Video Player Modal Simulation */}
      {activeVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-institutional-border">
            {/* Modal Header */}
            <div className="p-4 bg-institutional-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-red-500" />
                <h3 className="font-bold text-sm md:text-base truncate max-w-xl">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player Mock */}
            <div className="relative bg-black aspect-video flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 rounded-full bg-crimson flex items-center justify-center cursor-pointer hover:scale-110 transition shadow-2xl">
                <Play size={32} className="fill-current ml-1" />
              </div>
              <span className="text-xs font-semibold text-white/80 mt-3">
                Sir MV Digital Learning Lecture Player
              </span>
              <span className="text-[11px] text-white/50 mt-1">
                Duration: {activeVideoModal.duration || '42 Mins'} • 1080p Full HD
              </span>

              {/* Progress bar mock */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 text-xs">
                <span>04:15</span>
                <div className="flex-1 bg-white/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-crimson h-full w-1/4 rounded-full" />
                </div>
                <span>42:00</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-2 text-xs text-gray-700 bg-gray-50">
              <p className="font-semibold text-gray-900">{activeVideoModal.description}</p>
              <p className="text-gray-500">
                Instructor: {activeVideoModal.uploadedBy} • Department of {activeVideoModal.subject}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

