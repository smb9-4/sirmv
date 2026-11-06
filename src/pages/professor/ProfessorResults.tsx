import React, { useState, useMemo } from 'react';
import {
  ChartNoAxesCombined, Award, Search, Filter, Download,
  CheckCircle2, Users, BarChart3, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, FileSpreadsheet, ArrowUpDown, UserCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { STUDENTS_100_ROSTER, StudentAnalysisRecord } from '../../rosterData';

export default function ProfessorResults() {
  const [selectedExam, setSelectedExam] = useState('JEE Mock Test – Series 02');
  const [selectedSection, setSelectedSection] = useState<'All' | 'A' | 'B' | 'AtRisk'>('All');
  const [searchStudent, setSearchStudent] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'marks' | 'attendance' | 'name'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return STUDENTS_100_ROSTER.filter((s) => {
      if (selectedSection === 'A' && s.section !== 'A') return false;
      if (selectedSection === 'B' && s.section !== 'B') return false;
      if (selectedSection === 'AtRisk' && s.status === 'Passed' && s.attendancePercentage >= 75) return false;

      if (searchStudent.trim()) {
        const q = searchStudent.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      let comp = 0;
      if (sortBy === 'rank') comp = a.rank - b.rank;
      else if (sortBy === 'marks') comp = b.jeeMockScore - a.jeeMockScore;
      else if (sortBy === 'attendance') comp = b.attendancePercentage - a.attendancePercentage;
      else if (sortBy === 'name') comp = a.name.localeCompare(b.name);

      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [selectedSection, searchStudent, sortBy, sortOrder]);

  // Comprehensive Statistical Calculations across all 100 students
  const totalStudents = STUDENTS_100_ROSTER.length;
  const totalScore = STUDENTS_100_ROSTER.reduce((sum, s) => sum + s.jeeMockScore, 0);
  const avgScore = Math.round((totalScore / totalStudents) * 10) / 10;
  const avgPct = Math.round((avgScore / 300) * 1000) / 10;

  const topScorer = STUDENTS_100_ROSTER[0];
  const lowestScorer = STUDENTS_100_ROSTER[STUDENTS_100_ROSTER.length - 1];

  const passCount = STUDENTS_100_ROSTER.filter(s => s.status === 'Passed').length;
  const passPercentage = Math.round((passCount / totalStudents) * 1000) / 10;

  const atRiskCount = STUDENTS_100_ROSTER.filter(s => s.status === 'Needs Support' || s.attendancePercentage < 75).length;

  // Section A vs Section B comparative stats
  const secAStudents = STUDENTS_100_ROSTER.filter(s => s.section === 'A');
  const secBStudents = STUDENTS_100_ROSTER.filter(s => s.section === 'B');
  const secAAvg = Math.round((secAStudents.reduce((sum, s) => sum + s.jeeMockScore, 0) / secAStudents.length) * 10) / 10;
  const secBAvg = Math.round((secBStudents.reduce((sum, s) => sum + s.jeeMockScore, 0) / secBStudents.length) * 10) / 10;

  // Subject averages
  const avgPhysics = Math.round(STUDENTS_100_ROSTER.reduce((sum, s) => sum + s.physicsScore, 0) / totalStudents);
  const avgChemistry = Math.round(STUDENTS_100_ROSTER.reduce((sum, s) => sum + s.chemistryScore, 0) / totalStudents);
  const avgMath = Math.round(STUDENTS_100_ROSTER.reduce((sum, s) => sum + s.mathScore, 0) / totalStudents);

  // Distribution Histogram Bands
  const classDistData = useMemo(() => {
    let countDistinction = 0; // > 80% (>= 240)
    let countFirstClass = 0;  // 70-79% (210-239)
    let countSecondClass = 0; // 60-69% (180-209)
    let countPassClass = 0;   // 50-59% (150-179)
    let countBelowPass = 0;   // 40-49% (120-149)
    let countRemedial = 0;    // < 40% (< 120)

    STUDENTS_100_ROSTER.forEach(s => {
      const score = s.jeeMockScore;
      if (score >= 240) countDistinction++;
      else if (score >= 210) countFirstClass++;
      else if (score >= 180) countSecondClass++;
      else if (score >= 150) countPassClass++;
      else if (score >= 120) countBelowPass++;
      else countRemedial++;
    });

    return [
      { band: '≥ 80% (Distinction)', count: countDistinction, fill: '#16A34A' },
      { band: '70–79% (First Cls)', count: countFirstClass, fill: '#650000' },
      { band: '60–69% (Second Cls)', count: countSecondClass, fill: '#A60000' },
      { band: '50–59% (Pass Cls)', count: countPassClass, fill: '#E5BD55' },
      { band: '40–49% (Marginal)', count: countBelowPass, fill: '#F59E0B' },
      { band: '< 40% (Needs Aid)', count: countRemedial, fill: '#DC2626' },
    ];
  }, []);

  // Section comparison data
  const sectionCompData = [
    { name: 'Section A (1–50)', avg: secAAvg, attendance: 86.8 },
    { name: 'Section B (51–100)', avg: secBAvg, attendance: 84.1 },
  ];

  // Subject averages data
  const subjectAvgData = [
    { subject: 'Physics', average: avgPhysics, max: 100 },
    { subject: 'Chemistry', average: avgChemistry, max: 100 },
    { subject: 'Mathematics', average: avgMath, max: 100 },
  ];

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = 'Rank,Roll Number,Name,Section,JEE Mock (300),Physics (100),Chemistry (100),Mathematics (100),CET (180),Internal (30),Attendance %,Status,Email\n';
    const rows = filteredStudents.map(s =>
      `${s.rank},${s.rollNumber},"${s.name}",${s.section},${s.jeeMockScore},${s.physicsScore},${s.chemistryScore},${s.mathScore},${s.cetScore},${s.internalScore},${s.attendancePercentage}%,${s.status},${s.email}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sir_MV_100_Students_Analysis_${selectedSection}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <ChartNoAxesCombined size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                100-STUDENT BATCH ACADEMIC PERFORMANCE & COHORT ANALYTICS
              </h1>
              <p className="text-xs text-gray-500">
                5th Semester Computer Science Engineering • Cohort of 100 Students (Sections A & B)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full font-bold text-xs text-white shadow-sm hover:opacity-90 transition flex items-center gap-1.5"
              style={{ backgroundColor: '#166534' }}
            >
              <Download size={14} /> Export CSV Report
            </button>
          </div>
        </div>

        {/* 6 Key Macro Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Cohort</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{totalStudents}</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">50 Sec A • 50 Sec B</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Batch Average</span>
            <span className="text-2xl font-black text-maroon-deep mt-1 block">{avgScore}</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">{avgPct}% across batch</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Top Ranker</span>
            <span className="text-2xl font-black text-green-700 mt-1 block">{topScorer.jeeMockScore}</span>
            <span className="text-[10px] text-green-800 font-bold mt-0.5 block truncate px-1">
              {topScorer.name}
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Pass Rate</span>
            <span className="text-2xl font-black text-green-700 mt-1 block">{passPercentage}%</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">{passCount} of 100 cleared</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Lowest Score</span>
            <span className="text-2xl font-black text-red-600 mt-1 block">{lowestScorer.jeeMockScore}</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">Needs Intervention</span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">At-Risk Count</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{atRiskCount}</span>
            <span className="text-[10px] text-amber-700 font-bold mt-0.5 block">Low marks or attnd</span>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: 100-Student Score Distribution Bell-Curve */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-crimson" />
                  Cohort Grade Distribution (100 Students)
                </h3>
                <p className="text-xs text-gray-500">Number of students falling into distinct academic performance tiers</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                Score out of 300
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classDistData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="band" tick={{ fontSize: 10, fill: '#4B5563' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#4B5563' }} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} Students`, 'Count']}
                    contentStyle={{ borderRadius: 8, borderColor: '#DEDEDE', fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {classDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-institutional-border text-center text-xs">
              <div>
                <span className="text-gray-500">Distinction (≥ 80%):</span>
                <strong className="text-green-700 ml-1">{classDistData[0].count} Students</strong>
              </div>
              <div>
                <span className="text-gray-500">Average Tier (50–79%):</span>
                <strong className="text-maroon-deep ml-1">
                  {classDistData[1].count + classDistData[2].count + classDistData[3].count} Students
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Remedial (&lt; 40%):</span>
                <strong className="text-red-600 ml-1">{classDistData[5].count} Students</strong>
              </div>
            </div>
          </div>

          {/* Chart 2: Section A vs Section B & Subject Averages */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-institutional-border flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-base text-gray-900 pb-2 border-b">
                Section & Subject Diagnostics
              </h3>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Section A (Rolls 001–050)</span>
                    <span className="text-maroon-deep">{secAAvg} / 300</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-maroon-deep rounded-full" style={{ width: `${(secAAvg / 300) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Section B (Rolls 051–100)</span>
                    <span className="text-crimson">{secBAvg} / 300</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-crimson rounded-full" style={{ width: `${(secBAvg / 300) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-institutional-border">
                <span className="font-bold text-gray-700 block text-xs mb-2">Subject Means (out of 100):</span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 rounded-lg border">
                    <span className="text-[10px] text-gray-500 block">Physics</span>
                    <strong className="text-sm font-black text-gray-900">{avgPhysics}</strong>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg border">
                    <span className="text-[10px] text-gray-500 block">Chemistry</span>
                    <strong className="text-sm font-black text-gray-900">{avgChemistry}</strong>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg border">
                    <span className="text-[10px] text-gray-500 block">Mathematics</span>
                    <strong className="text-sm font-black text-gray-900">{avgMath}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Performers Callout */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block flex items-center gap-1">
                <Award size={14} /> Batch Toppers:
              </span>
              <p className="text-[11px] text-amber-800 mt-1">
                1. {STUDENTS_100_ROSTER[0].name} ({STUDENTS_100_ROSTER[0].jeeMockScore}m)<br />
                2. {STUDENTS_100_ROSTER[1].name} ({STUDENTS_100_ROSTER[1].jeeMockScore}m)<br />
                3. {STUDENTS_100_ROSTER[2].name} ({STUDENTS_100_ROSTER[2].jeeMockScore}m)
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-institutional-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-bold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter size={13} /> Cohort Filter:
            </span>
            {[
              { id: 'All', label: `All 100 Students (${totalStudents})` },
              { id: 'A', label: 'Section A (50)' },
              { id: 'B', label: 'Section B (50)' },
              { id: 'AtRisk', label: `Needs Support (${atRiskCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setSelectedSection(tab.id as any); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                  selectedSection === tab.id
                    ? 'bg-crimson text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, roll (e.g. 23CSE045)..."
                value={searchStudent}
                onChange={(e) => { setSearchStudent(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-institutional-border outline-none w-56 md:w-64"
              />
            </div>
          </div>
        </div>

        {/* 100-Student Roster Table */}
        <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Student Score Ledger ({filteredStudents.length} Students Displayed)
              </h3>
              <p className="text-xs text-gray-500">Click table headers to sort</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Page {currentPage} of {totalPages || 1}</span>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                className="px-2.5 py-1 rounded border border-gray-300 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                className="px-2.5 py-1 rounded border border-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-black"
                    onClick={() => { setSortBy('rank'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}
                  >
                    Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-3">Roll Number</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-black"
                    onClick={() => { setSortBy('name'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}
                  >
                    Candidate Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-2 text-center">Sec</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-black"
                    onClick={() => { setSortBy('marks'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}
                  >
                    Mock Score (300) {sortBy === 'marks' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-2 text-center">Phy (100)</th>
                  <th className="py-3 px-2 text-center">Chem (100)</th>
                  <th className="py-3 px-2 text-center">Math (100)</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-black"
                    onClick={() => { setSortBy('attendance'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}
                  >
                    Attendance {sortBy === 'attendance' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-3">Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.map((s) => {
                  const isTargetStudent = s.rollNumber === '23CSE001';
                  const isLowAttendance = s.attendancePercentage < 75;

                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors ${
                        isTargetStudent
                          ? 'bg-amber-50/70 font-bold border-l-4 border-l-crimson'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-gray-900">#{s.rank}</td>
                      <td className="py-3 px-3 font-mono text-gray-700">{s.rollNumber}</td>
                      <td className="py-3 px-3 text-gray-900">
                        {s.name}
                        {isTargetStudent && (
                          <span className="text-[10px] text-crimson font-normal ml-1.5">(Target Student)</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-gray-600">{s.section}</td>
                      <td className="py-3 px-3 font-extrabold text-gray-900">
                        {s.jeeMockScore} <span className="text-[10px] text-gray-400 font-normal">({Math.round((s.jeeMockScore / 300) * 100)}%)</span>
                      </td>
                      <td className="py-3 px-2 text-center text-gray-700">{s.physicsScore}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{s.chemistryScore}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{s.mathScore}</td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${isLowAttendance ? 'text-red-600' : 'text-green-700'}`}>
                          {s.attendancePercentage}%
                        </span>
                        {isLowAttendance && <span className="text-[10px] text-red-500 block">Below 75%</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === 'Passed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <span>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} students
            </span>

            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    currentPage === idx + 1
                      ? 'bg-crimson text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
