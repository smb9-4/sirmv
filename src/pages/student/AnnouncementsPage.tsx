import React, { useState, useMemo } from 'react';
import {
  Bell, Search, Filter, CheckCircle2, AlertCircle, Clock,
  User, Building2, ShieldAlert, Check, Sparkles
} from 'lucide-react';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';

export default function AnnouncementsPage() {
  const { announcements, markAnnouncementAsRead, markAllAnnouncementsAsRead } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');

  // Filter options
  const designations = ['All', 'Principal', 'Head of Department', 'Associate Professor', 'Assistant Professor'];
  const departments = ['All', 'Administration', 'Computer Science Engineering'];

  // Unread count
  const unreadCount = announcements.filter(a => !a.isRead).length;

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      // Type filter
      if (filterType === 'unread' && a.isRead) return false;
      if (filterType === 'urgent' && !a.isUrgent) return false;

      // Designation filter
      if (selectedDesignation !== 'All' && !a.designation.toLowerCase().includes(selectedDesignation.toLowerCase())) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== 'All' && a.department !== selectedDepartment) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesMessage = a.message.toLowerCase().includes(query);
        const matchesSender = a.senderName.toLowerCase().includes(query);
        return matchesTitle || matchesMessage || matchesSender;
      }

      return true;
    });
  }, [announcements, filterType, selectedDesignation, selectedDepartment, searchQuery]);

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <StudentNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
              >
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  INSTITUTIONAL ANNOUNCEMENTS
                </h1>
                <p className="text-xs text-gray-500">
                  Official circulars from Principal, HODs, and Course Instructors
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#FFE59A', color: '#500000' }}>
              {unreadCount} Unread Notice{unreadCount === 1 ? '' : 's'}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAnnouncementsAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#650000' }}
              >
                <Check size={14} /> Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search circulars by title, sender, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-lg border border-institutional-border focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-bold shrink-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'all' ? 'bg-white text-crimson shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({announcements.length})
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'unread' ? 'bg-white text-crimson shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilterType('urgent')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'urgent' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Urgent ({announcements.filter(a => a.isUrgent).length})
              </button>
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-institutional-border text-xs">
            <span className="font-bold text-gray-500 flex items-center gap-1">
              <Filter size={14} /> Filter by:
            </span>

            {/* Designation dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Designation:</span>
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="border border-institutional-border rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-crimson"
              >
                {designations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Department dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-institutional-border rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-crimson"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {(selectedDesignation !== 'All' || selectedDepartment !== 'All' || searchQuery) && (
              <button
                onClick={() => { setSelectedDesignation('All'); setSelectedDepartment('All'); setSearchQuery(''); }}
                className="text-xs text-crimson font-bold hover:underline ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-institutional-border">
              <Bell size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Announcements Found</h3>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-5 md:p-6 shadow-card border transition-all duration-200 ${
                  item.isUrgent
                    ? 'border-red-300 ring-1 ring-red-200/50'
                    : 'border-institutional-border'
                } ${!item.isRead ? 'bg-amber-50/20' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        item.isUrgent
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.isUrgent ? <ShieldAlert size={20} /> : <Bell size={18} />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {item.isUrgent && (
                          <span className="bg-crimson text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            Urgent Notice
                          </span>
                        )}
                        {!item.isRead && (
                          <span
                            className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider"
                            style={{ backgroundColor: '#FFE59A', color: '#500000' }}
                          >
                            New Unread
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-gray-500">
                          {item.department}
                        </span>
                      </div>

                      <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  {/* Mark read button */}
                  {!item.isRead && (
                    <button
                      onClick={() => markAnnouncementAsRead(item.id)}
                      className="shrink-0 self-start text-xs font-semibold px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} /> Mark Read
                    </button>
                  )}
                </div>

                {/* Message Body */}
                <div className="pl-12 text-xs md:text-sm text-gray-700 leading-relaxed space-y-2">
                  <p>{item.message}</p>
                </div>

                {/* Footer Details */}
                <div className="mt-4 pt-3 border-t border-institutional-border pl-12 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-gray-400" />
                    <span>
                      Issued by: <strong>{item.senderName}</strong> ({item.designation})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock size={13} />
                    <span>{new Date(item.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
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

