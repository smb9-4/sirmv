import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Activity,
  Battery,
  Clock,
  User,
  Tablet,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';

interface LiveExamMonitoringTableProps {
  records: StudentTabletRecord[];
  onSelectStudent: (student: StudentTabletRecord) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function LiveExamMonitoringTable({
  records,
  onSelectStudent,
  activeFilter: externalFilter,
  onFilterChange,
}: LiveExamMonitoringTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalFilter, setInternalFilter] = useState('All Students');
  const [sortField, setSortField] = useState<keyof StudentTabletRecord>('usn');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const activeFilter = externalFilter || internalFilter;
  const setFilter = (f: string) => {
    if (onFilterChange) onFilterChange(f);
    setInternalFilter(f);
    setCurrentPage(1);
  };

  // Filter chips as specified in prompt requirement #3
  const filterOptions = [
    'All Students',
    'Active',
    'Inactive',
    'Not Started',
    'Submitted',
    'Not Submitted',
    'Time Over',
    'Low Battery',
  ];

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Search matching
      const matchesSearch =
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assignedTabletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter matching
      if (activeFilter === 'Active') return r.deviceStatus === 'Active';
      if (activeFilter === 'Inactive') return r.deviceStatus === 'Inactive';
      if (activeFilter === 'Not Started') return r.submissionStatus === 'Not Started' || r.deviceStatus === 'Not Started';
      if (activeFilter === 'Submitted') return r.submissionStatus === 'Submitted';
      if (activeFilter === 'Not Submitted') return r.submissionStatus !== 'Submitted';
      if (activeFilter === 'Time Over') return r.timeRemainingMinutes === 'Time Over';
      if (activeFilter === 'Low Battery') return r.batteryPercentage <= 25;

      return true;
    });
  }, [records, searchQuery, activeFilter]);

  // Sort logic
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'usn') {
        return sortAsc
          ? parseInt(a.usn, 10) - parseInt(b.usn, 10)
          : parseInt(b.usn, 10) - parseInt(a.usn, 10);
      }

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredRecords, sortField, sortAsc]);

  // Pagination for 3,000+ support
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: keyof StudentTabletRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Export utility
  const exportToCSV = () => {
    const headers = [
      'Student Name',
      'USN',
      'Tablet ID',
      'Battery %',
      'Device Status',
      'Current Question',
      'Questions Attempted',
      'Questions Remaining',
      'Questions Skipped',
      'Time Remaining',
      'Submission Status',
      'Last Activity',
    ];

    const rows = sortedRecords.map(r => [
      `"${r.studentName}"`,
      `"${r.usn}"`,
      `"${r.assignedTabletId}"`,
      r.batteryPercentage,
      `"${r.deviceStatus}"`,
      r.currentQuestion,
      r.questionsAttempted,
      r.questionsRemaining,
      r.questionsSkipped,
      `"${r.timeRemainingMinutes}"`,
      `"${r.submissionStatus}"`,
      `"${r.lastActivity}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SirMV_Live_Exam_Monitoring_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
      {/* Table Header: Title, Search & Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
            <h2 className="text-lg font-black uppercase tracking-tight text-stone-900">
              Live Examination Monitoring Terminal
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800">
              Telemetry Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">
            Showing {sortedRecords.length} of {records.length} students • Click any row to inspect individual examination profile
          </p>
        </div>

        {/* Controls: Search & CSV Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search name, USN, or Tablet ID..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50/70 focus:bg-white focus:border-[#650000] focus:outline-none transition shadow-inner"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 font-bold text-xs text-stone-700 flex items-center gap-1.5 transition apple-button shadow-2xs"
            title="Export filtered records to CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Chips (Requirement #3) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-stone-400 font-bold flex items-center gap-1 shrink-0 mr-1 text-[11px] uppercase">
          <Filter size={12} /> Filters:
        </span>
        {filterOptions.map(f => {
          const isSelected = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                isSelected
                  ? 'bg-[#650000] text-[#FFE59A] shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* 12-Column Interactive Live Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200/90 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/80 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
              <th className="py-3 px-3 cursor-pointer hover:bg-stone-200/70 transition" onClick={() => handleSort('usn')}>
                <div className="flex items-center gap-1">
                  <span>USN</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:bg-stone-200/70 transition" onClick={() => handleSort('studentName')}>
                <div className="flex items-center gap-1">
                  <span>1. Student Name</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:bg-stone-200/70 transition" onClick={() => handleSort('assignedTabletId')}>
                <div className="flex items-center gap-1">
                  <span>3. Tablet ID</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:bg-stone-200/70 transition" onClick={() => handleSort('batteryPercentage')}>
                <div className="flex items-center gap-1">
                  <span>4. Battery %</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3">5. Device Status</th>
              <th className="py-3 px-3 cursor-pointer hover:bg-stone-200/70 transition" onClick={() => handleSort('currentQuestion')}>
                <div className="flex items-center gap-1">
                  <span>6. Current Q</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:bg-stone-200/70 transition" onClick={() => handleSort('questionsAttempted')}>
                <div className="flex items-center gap-1">
                  <span>7. Attempted</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-3 px-3">8. Remaining</th>
              <th className="py-3 px-3">9. Skipped</th>
              <th className="py-3 px-3">10. Time Remaining</th>
              <th className="py-3 px-3">11. Submission</th>
              <th className="py-3 px-3">12. Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-stone-400 font-bold">
                  No student records match the active filter criteria.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r, idx) => {
                const isCriticalBattery = r.batteryPercentage <= 20;
                const isSubmitted = r.submissionStatus === 'Submitted';

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectStudent(r)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors group select-none"
                  >
                    {/* USN */}
                    <td className="py-3 px-3 font-mono font-bold text-stone-600">
                      {r.usn}
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-stone-900 group-hover:text-[#650000] transition">
                          {r.studentName}
                        </span>
                        {r.securityIncident && (
                          <span title={`Security Alert: ${r.securityIncident.type}`}>
                            <Shield size={12} className="text-red-600" />
                          </span>
                        )}
                        {r.aiPrediction && (
                          <span title={`AI Early Warning: ${r.aiPrediction.pattern}`}>
                            <Sparkles size={12} className="text-purple-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tablet ID */}
                    <td className="py-3 px-3 font-mono font-bold text-stone-700">
                      <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {r.assignedTabletId}
                      </span>
                    </td>

                    {/* Battery % */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[11px] border ${
                          isCriticalBattery
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : r.batteryPercentage <= 35
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {r.batteryPercentage}%
                      </span>
                    </td>

                    {/* Device Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.deviceStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.deviceStatus === 'Critical Battery' || r.deviceStatus === 'Error'
                            ? 'bg-red-100 text-red-800'
                            : r.deviceStatus === 'Offline'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.deviceStatus}
                      </span>
                    </td>

                    {/* Current Question */}
                    <td className="py-3 px-3 font-bold text-stone-900">
                      Q #{r.currentQuestion}
                    </td>

                    {/* Attempted */}
                    <td className="py-3 px-3 font-black text-emerald-700">
                      {r.questionsAttempted}
                    </td>

                    {/* Remaining */}
                    <td className="py-3 px-3 text-stone-600 font-bold">
                      {r.questionsRemaining}
                    </td>

                    {/* Skipped */}
                    <td className="py-3 px-3 text-amber-700 font-bold">
                      {r.questionsSkipped}
                    </td>

                    {/* Time Remaining */}
                    <td className="py-3 px-3 font-bold">
                      <span
                        className={
                          r.timeRemainingMinutes === 'Time Over'
                            ? 'text-red-600 font-black'
                            : r.timeRemainingMinutes <= 15
                            ? 'text-amber-700'
                            : 'text-stone-800'
                        }
                      >
                        {r.timeRemainingMinutes === 'Time Over'
                          ? 'Time Over'
                          : `${r.timeRemainingMinutes} mins`}
                      </span>
                    </td>

                    {/* Submission Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isSubmitted
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.submissionStatus === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {r.submissionStatus}
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="py-3 px-3 font-mono text-[11px] text-stone-500 font-medium">
                      {r.lastActivity}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 pt-2 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg border border-stone-200 bg-stone-50 text-xs font-bold focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-stone-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-stone-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

