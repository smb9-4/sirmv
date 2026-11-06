import React, { useState } from 'react';
import {
  CalendarDays, Clock, MapPin, User, Calendar
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';

export default function ProfessorTimetable() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const facultySchedule = [
    { day: 'Monday', period: '09:00 - 10:00 AM', subject: 'Data Structures (CS501)', class: '5th Sem CSE Sec A', room: 'Room 301', type: 'Lecture' },
    { day: 'Monday', period: '10:00 - 11:00 AM', subject: 'Algorithms (CS502)', class: '5th Sem CSE Sec A', room: 'Room 301', type: 'Lecture' },
    { day: 'Monday', period: '02:00 - 05:00 PM', subject: 'Data Structures Lab (CSL501)', class: '5th Sem CSE Sec A', room: 'Lab 2', type: 'Lab' },

    { day: 'Tuesday', period: '11:15 - 12:15 PM', subject: 'Data Structures (CS501)', class: '5th Sem CSE Sec A', room: 'Room 302', type: 'Lecture' },
    { day: 'Tuesday', period: '02:00 - 03:00 PM', subject: 'Department Academic Council Meeting', class: 'Staff', room: 'Board Room', type: 'Meeting' },

    { day: 'Wednesday', period: '09:00 - 10:00 AM', subject: 'Algorithms (CS502)', class: '5th Sem CSE Sec A', room: 'Room 303', type: 'Lecture' },
    { day: 'Wednesday', period: '11:15 - 12:15 PM', subject: 'Student Doubt Clearing Session', class: '5th Sem CSE', room: 'Cabin 14', type: 'Tutorial' },

    { day: 'Thursday', period: '09:00 - 10:00 AM', subject: 'Data Structures (CS501)', class: '5th Sem CSE Sec A', room: 'Room 301', type: 'Lecture' },
    { day: 'Thursday', period: '11:15 - 12:15 PM', subject: 'Algorithms (CS502)', class: '5th Sem CSE Sec A', room: 'Room 301', type: 'Lecture' },

    { day: 'Friday', period: '12:15 - 01:15 PM', subject: 'Data Structures (CS501)', class: '5th Sem CSE Sec A', room: 'Room 302', type: 'Lecture' },
    { day: 'Friday', period: '02:00 - 05:00 PM', subject: 'Algorithms Lab (CSL502)', class: '5th Sem CSE Sec B', room: 'Lab 1', type: 'Lab' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const daySchedule = facultySchedule.filter(s => s.day === selectedDay);

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <CalendarDays size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                FACULTY TEACHING TIMETABLE
              </h1>
              <p className="text-xs text-gray-500">
                Dr. Priya Nayak • Associate Professor • Computer Science Engineering
              </p>
            </div>
          </div>
        </div>

        {/* Day Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => (
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

        {/* Slots */}
        <div className="space-y-3">
          {daySchedule.map((slot, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shrink-0"
                  style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                      {slot.type}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">{slot.period}</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900">{slot.subject}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>Class: <strong>{slot.class}</strong></span>
                    <span>Venue: <strong>{slot.room}</strong></span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 self-start sm:self-center">
                Scheduled
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

