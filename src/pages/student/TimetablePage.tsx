import React, { useState } from 'react';
import {
  CalendarDays, Calendar as CalendarIcon, Clock, MapPin, User,
  ChevronLeft, ChevronRight, Sparkles, Filter, Award, AlertCircle
} from 'lucide-react';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import type { TimetableEntry, CalendarEvent } from '../../types';

export default function TimetablePage() {
  const { timetable, events } = usePortal();

  const [activeView, setActiveView] = useState<'weekly' | 'monthly' | 'upcoming'>('weekly');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredTimetable = timetable.filter((t) => t.day === selectedDay);

  const getEventTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam':
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Exam</span>;
      case 'holiday':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Holiday</span>;
      case 'assignment':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Assignment</span>;
      case 'practical':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Practical</span>;
      default:
        return <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Event</span>;
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
              <CalendarDays size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                ACADEMIC TIMETABLE & CALENDAR
              </h1>
              <p className="text-xs text-gray-500">
                5th Semester Computer Science • Section A • Odd Semester 2026–27
              </p>
            </div>
          </div>

          {/* View Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setActiveView('weekly')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeView === 'weekly' ? 'bg-crimson text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Weekly Timetable
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeView === 'monthly' ? 'bg-crimson text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Calendar
            </button>
            <button
              onClick={() => setActiveView('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeView === 'upcoming' ? 'bg-crimson text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming Events ({events.length})
            </button>
          </div>
        </div>

        {/* VIEW 1: WEEKLY TIMETABLE */}
        {activeView === 'weekly' && (
          <div className="space-y-6">
            {/* Day Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all border text-center whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-maroon-deep text-white border-maroon-deep shadow-md'
                      : 'bg-white text-gray-700 border-institutional-border hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Timetable Period Cards */}
            <div className="space-y-3">
              {filteredTimetable.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-institutional-border">
                  <p className="text-xs text-gray-500">No scheduled classes for this day.</p>
                </div>
              ) : (
                filteredTimetable.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl p-5 shadow-card border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      slot.type === 'lab'
                        ? 'border-amber-300 ring-1 ring-amber-100 bg-amber-50/20'
                        : slot.type === 'free'
                        ? 'border-gray-200 bg-gray-50/50 opacity-75'
                        : 'border-institutional-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Period Badge */}
                      <div
                        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0"
                        style={{
                          backgroundColor: slot.type === 'lab' ? '#FFE59A' : slot.type === 'free' ? '#E5E7EB' : '#FEE2E2',
                          color: slot.type === 'lab' ? '#500000' : slot.type === 'free' ? '#4B5563' : '#991B1B',
                        }}
                      >
                        <span className="text-[10px] uppercase font-bold">Slot</span>
                        <span className="text-sm font-black">{slot.period}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              slot.type === 'lab'
                                ? 'bg-amber-100 text-amber-800'
                                : slot.type === 'free'
                                ? 'bg-gray-200 text-gray-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {slot.type === 'lab' ? 'Practical Lab (3 Hrs)' : slot.type === 'free' ? 'Library / Free' : 'Theory Lecture'}
                          </span>
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                            <Clock size={12} /> {slot.time}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-gray-900">
                          {slot.subject}
                        </h3>

                        {slot.type !== 'free' && (
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5">
                            <span className="flex items-center gap-1">
                              <User size={13} className="text-gray-400" /> Faculty: <strong>{slot.teacherName}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={13} className="text-gray-400" /> Room / Venue: <strong>{slot.room}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        Compulsory Attendance
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: MONTHLY CALENDAR (NOVEMBER 2026) */}
        {activeView === 'monthly' && (
          <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-institutional-border">
              <div className="flex items-center gap-3">
                <CalendarIcon size={22} className="text-crimson" />
                <h2 className="text-lg md:text-xl font-black text-gray-900">
                  NOVEMBER 2026 ACADEMIC CALENDAR
                </h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#FFE59A', color: '#500000' }}>
                Semester 5 Term
              </span>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600" /> Exam Period</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-600" /> College Holiday</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Assignment Due</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-600" /> Institutional Event</span>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="font-extrabold text-gray-400 uppercase py-2">
                  {d}
                </div>
              ))}

              {/* Pad first days for Nov 2026 (Nov 1 is Sunday) */}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isExam = day >= 18 && day <= 25;
                const isHoliday = day === 1 || day === 8 || day === 15 || day === 22 || day === 29;
                const isSpecial = day === 20;

                let cellClass = 'border border-gray-200 bg-white hover:bg-gray-50';
                if (isExam) cellClass = 'border-red-300 bg-red-50 text-red-900 font-bold';
                else if (isHoliday) cellClass = 'border-purple-200 bg-purple-50 text-purple-900';
                else if (isSpecial) cellClass = 'border-green-300 bg-green-50 text-green-900 font-bold';

                return (
                  <div
                    key={day}
                    className={`h-20 p-2 rounded-xl flex flex-col justify-between text-left transition-all ${cellClass}`}
                  >
                    <span className="font-bold text-xs">{day}</span>
                    <div className="text-[10px] leading-tight">
                      {isExam && <span className="text-red-700 block font-extrabold">IA-2 Exams</span>}
                      {day === 15 && <span className="text-purple-700 block">Holiday</span>}
                      {day === 20 && <span className="text-green-700 block font-extrabold">Annual Day</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: UPCOMING EVENTS LIST */}
        {activeView === 'upcoming' && (
          <div className="space-y-4">
            {events.map((evt, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
                  >
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getEventTypeBadge(evt.type)}
                      <span className="text-xs text-gray-500 font-semibold">{evt.date}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-gray-900">{evt.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{evt.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

