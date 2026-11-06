// Announcement ticker strip
interface TickerProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  '📢 Examination registration for Semester 5 is now open – Visit the Exam Cell before 15th November 2026.',
  '📢 Internal Assessment II (IA-2) scheduled from 18th to 25th November 2026 – All students must carry Hall Tickets.',
  '📢 New study materials for Data Structures Unit 4 have been uploaded – Download from the Study Materials section.',
  '📢 Annual Day Celebration on 20th November 2026 at the College Auditorium – 10:00 AM onwards.',
  '📢 Industry Visit to Infosys Bangalore on 25th November – Register with HOD office by 15th November.',
  '📢 Python Lab Records must be submitted by 7th November 2026 before 2:00 PM.',
];

export default function AnnouncementTicker({ items = DEFAULT_ITEMS }: TickerProps) {
  return (
    <div
      className="w-full flex items-center overflow-hidden"
      style={{ background: '#FFE59A', borderBottom: '2px solid #E5BD55', minHeight: 36 }}
    >
      <span
        className="shrink-0 font-bold text-xs px-3 py-1.5 text-white mr-2 whitespace-nowrap"
        style={{ background: '#A60000' }}
      >
        NOTICES
      </span>
      <div className="ticker-wrapper flex-1">
        <span className="ticker-content text-xs font-medium text-institutional-black">
          {items.join('   •   ')}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}

