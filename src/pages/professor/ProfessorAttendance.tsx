import React, { useState } from 'react';
import {
  CalendarCheck, CheckCircle2, UserCheck, XCircle, Save,
  Calendar, Users, Sparkles, Filter, Search
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { STUDENTS_100_ROSTER } from '../../rosterData';

export default function ProfessorAttendance() {
  const { markAttendance } = usePortal();

  const [subjectCode, setSubjectCode] = useState('CS501'); // Data Structures
  const [date, setDate] = useState('2026-11-06');
  const [session, setSession] = useState('Period 1 (09:00 - 10:00 AM)');
  const [sectionFilter, setSectionFilter] = useState<'All' | 'A' | 'B'>('A');
  const [searchRoster, setSearchRoster] = useState('');

  // 100 Students attendance presence state
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    STUDENTS_100_ROSTER.forEach((s, idx) => {
      // realistic baseline: most present, a few absent
      initial[s.id] = idx % 7 !== 0;
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleStudent = (id: string) => {
    setAttendanceState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkAll = (status: boolean) => {
    setAttendanceState(prev => {
      const updated = { ...prev };
      STUDENTS_100_ROSTER.forEach(s => {
        if (sectionFilter === 'All' || s.section === sectionFilter) {
          updated[s.id] = status;
        }
      });
      return updated;
    });
  };

  const handleSaveAttendance = () => {
    const presentIds = Object.entries(attendanceState)
      .filter(([_, present]) => present)
      .map(([id]) => id);

    markAttendance(subjectCode, presentIds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const displayedStudents = STUDENTS_100_ROSTER.filter(s => {
    if (sectionFilter !== 'All' && s.section !== sectionFilter) return false;
    if (searchRoster.trim()) {
      const q = searchRoster.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const presentCount = displayedStudents.filter(s => attendanceState[s.id]).length;
  const absentCount = displayedStudents.length - presentCount;

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                CLASS ATTENDANCE ENTRY & 100-STUDENT ROLL-CALL
              </h1>
              <p className="text-xs text-gray-500">
                Submit daily biometric/roll-call entries to the central VTU academic ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#FFE59A', color: '#500000' }}>
            <Users size={15} /> 100 Registered Students in Cohort
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            Attendance record successfully saved and updated to student portals!
          </div>
        )}

        {/* Configuration Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-institutional-border grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Subject</label>
            <select
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white outline-none"
            >
              <option value="CS501">Data Structures (CS501)</option>
              <option value="CS502">Algorithms (CS502)</option>
              <option value="CS503">Theory of Computation (CS503)</option>
              <option value="CS504">Operating Systems (CS504)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Class Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-institutional-border rounded-lg p-2.5 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Lecture Period</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white outline-none"
            >
              <option value="Period 1">Period 1 (09:00 - 10:00 AM)</option>
              <option value="Period 2">Period 2 (10:00 - 11:00 AM)</option>
              <option value="Period 3">Period 3 (11:15 - 12:15 PM)</option>
              <option value="Lab Slot">Afternoon Lab Slot (02:00 - 05:00 PM)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Section</label>
            <div className="flex gap-1">
              {(['All', 'A', 'B'] as const).map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSectionFilter(sec)}
                  className={`flex-1 py-2 rounded-lg font-bold border transition ${
                    sectionFilter === sec
                      ? 'bg-crimson text-white border-crimson'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Sec {sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roll Call Panel */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-institutional-border space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                5th Semester CSE • Section {sectionFilter} Roll-Call
              </h3>
              <p className="text-xs text-gray-500">
                Present: <strong className="text-green-700">{presentCount}</strong> • Absent: <strong className="text-red-600">{absentCount}</strong> of {displayedStudents.length} Students
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Quick search student..."
                  value={searchRoster}
                  onChange={(e) => setSearchRoster(e.target.value)}
                  className="pl-7 pr-3 py-1 text-xs rounded-lg border border-gray-300 outline-none w-44"
                />
              </div>

              <button
                type="button"
                onClick={() => handleMarkAll(true)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold text-green-800 bg-green-50 hover:bg-green-100"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll(false)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100"
              >
                All Absent
              </button>
            </div>
          </div>

          {/* Student Grid (100 Students) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto p-1">
            {displayedStudents.map((st) => {
              const isPresent = attendanceState[st.id];
              return (
                <div
                  key={st.id}
                  onClick={() => toggleStudent(st.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isPresent
                      ? 'bg-green-50/70 border-green-300 ring-1 ring-green-200'
                      : 'bg-red-50/70 border-red-300 ring-1 ring-red-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[10px] text-gray-500 block">
                      {st.rollNumber} (Sec {st.section})
                    </span>
                    <span className="font-bold text-xs text-gray-900 truncate block">
                      {st.name}
                    </span>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      isPresent ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {isPresent ? 'P' : 'A'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-institutional-border flex justify-end">
            <button
              onClick={handleSaveAttendance}
              className="py-3 px-8 rounded-full font-bold text-xs text-white shadow-md hover:opacity-90 transition flex items-center gap-2"
              style={{ backgroundColor: '#A60000' }}
            >
              <Save size={16} /> Save & Commit Attendance for {displayedStudents.length} Students
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
