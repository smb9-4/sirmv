import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, Building2, Phone, Mail,
  ChevronRight, Calendar, Bell, ShieldCheck, MapPin, ExternalLink,
  Users, CheckCircle2
} from 'lucide-react';
import InstitutionHeader from '../components/InstitutionHeader';
import AnnouncementTicker from '../components/AnnouncementTicker';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'about' | 'campuses' | 'admissions'>('about');

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      {/* 1. Main Header */}
      <InstitutionHeader />

      {/* 2. Announcement Ticker */}
      <AnnouncementTicker />

      {/* 3. Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '520px' }}>
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Deep Maroon / Dark Gradient Overlay to match branding strictly */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(80,0,0,0.92) 0%, rgba(101,0,0,0.85) 50%, rgba(8,8,8,0.92) 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          {/* Logo Badge */}
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 mb-6 shadow-2xl">
            <img
              src="/logo.png"
              alt="Sir MV Logo"
              className="h-24 w-24 object-contain filter drop-shadow-lg"
            />
          </div>

          {/* Welcome Tag */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase mb-4"
            style={{ background: '#FFE59A', color: '#500000' }}
          >
            <ShieldCheck size={16} /> Official Academic Portal
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            SIR MV GROUP OF INSTITUTIONS
          </h1>
          <p className="mt-3 text-base md:text-xl font-medium max-w-2xl text-white/90" style={{ color: '#FFE59A' }}>
            Nurturing Excellence, Inspiring Innovation
          </p>
          <p className="mt-2 text-xs md:text-sm text-white/75 max-w-2xl">
            Founded on the visionary ideals of Bharat Ratna Sir M. Visvesvaraya. Affiliated to VTU Belagavi, Approved by AICTE, Accredited with NAAC A+ Grade.
          </p>

          {/* Login Buttons - Strict Red Rounded Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-md">
            <Link
              to="/login/student"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base md:text-lg text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5"
              style={{
                backgroundColor: '#A60000',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <GraduationCap size={22} />
              <span>STUDENT LOGIN</span>
            </Link>

            <Link
              to="/login/professor"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base md:text-lg text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5"
              style={{
                backgroundColor: '#650000',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <Users size={22} />
              <span>PROFESSOR LOGIN</span>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-400" /> VTU Affiliated</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-400" /> AICTE Approved</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-400" /> NAAC A+ Grade</span>
          </div>
        </div>
      </section>

      {/* 4. Institutional Highlights Stats Bar */}
      <section className="bg-white border-y border-institutional-border py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-institutional-border last:border-r-0 px-2">
            <div className="text-2xl md:text-3xl font-extrabold" style={{ color: '#650000' }}>35+</div>
            <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Years of Academic Legacy</div>
          </div>
          <div className="border-r border-institutional-border last:border-r-0 px-2">
            <div className="text-2xl md:text-3xl font-extrabold" style={{ color: '#650000' }}>3 Campuses</div>
            <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Davangere • Shivamogga • Ballari</div>
          </div>
          <div className="border-r border-institutional-border last:border-r-0 px-2">
            <div className="text-2xl md:text-3xl font-extrabold" style={{ color: '#650000' }}>15,000+</div>
            <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Alumni Worldwide</div>
          </div>
          <div className="px-2">
            <div className="text-2xl md:text-3xl font-extrabold" style={{ color: '#650000' }}>94.8%</div>
            <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Campus Placement Rate</div>
          </div>
        </div>
      </section>

      {/* 5. Quick Portals & Notice Board Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border">
              <div className="flex items-center justify-between border-b border-institutional-border pb-4 mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#650000' }}>
                  <Building2 size={22} className="text-crimson" />
                  Institutional Information
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      activeTab === 'about'
                        ? 'bg-crimson text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => setActiveTab('campuses')}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      activeTab === 'campuses'
                        ? 'bg-crimson text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Our Campuses
                  </button>
                </div>
              </div>

              {activeTab === 'about' ? (
                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <p>
                    Sir MV Group of Institutions was established with the vision of providing world-class technical and scientific education inspired by the legendary engineer-statesman, <strong>Bharat Ratna Sir M. Visvesvaraya</strong>.
                  </p>
                  <p>
                    Our institutions offer undergraduate, postgraduate, and doctoral programs in Engineering, Technology, Applied Sciences, and Management with modern laboratories, digital libraries, and industry-partnered research centers.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-institutional-border">
                    <div className="bg-institutional-bg p-3.5 rounded-lg border-l-4" style={{ borderColor: '#650000' }}>
                      <h4 className="font-bold text-xs uppercase text-gray-800">Mission</h4>
                      <p className="text-xs text-gray-600 mt-1">To impart value-based technical education fostering scientific temper and professional ethics.</p>
                    </div>
                    <div className="bg-institutional-bg p-3.5 rounded-lg border-l-4" style={{ borderColor: '#A60000' }}>
                      <h4 className="font-bold text-xs uppercase text-gray-800">Vision</h4>
                      <p className="text-xs text-gray-600 mt-1">To emerge as a premier center of excellence in engineering and management education.</p>
                    </div>
                    <div className="bg-institutional-bg p-3.5 rounded-lg border-l-4" style={{ borderColor: '#E5BD55' }}>
                      <h4 className="font-bold text-xs uppercase text-gray-800">Core Values</h4>
                      <p className="text-xs text-gray-600 mt-1">Integrity, Innovation, Social Responsibility, and Continuous Academic Growth.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-institutional-border rounded-lg p-4 bg-gray-50">
                    <div className="font-bold text-sm text-maroon-deep flex items-center gap-1.5">
                      <MapPin size={16} className="text-crimson" /> Davangere Campus
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Main Engineering Campus, Vidyanagar, Davangere - 577004</p>
                    <p className="text-xs text-gray-500 mt-2">Ph: 08192-221100</p>
                  </div>
                  <div className="border border-institutional-border rounded-lg p-4 bg-gray-50">
                    <div className="font-bold text-sm text-maroon-deep flex items-center gap-1.5">
                      <MapPin size={16} className="text-crimson" /> Shivamogga Campus
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Technology Campus, Sagar Road, Shivamogga - 577204</p>
                    <p className="text-xs text-gray-500 mt-2">Ph: 08182-243300</p>
                  </div>
                  <div className="border border-institutional-border rounded-lg p-4 bg-gray-50">
                    <div className="font-bold text-sm text-maroon-deep flex items-center gap-1.5">
                      <MapPin size={16} className="text-crimson" /> Ballari Campus
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Institutions Complex, Cantonment, Ballari - 583104</p>
                    <p className="text-xs text-gray-500 mt-2">Ph: 08392-265500</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card border-l-4 hover:border-l-8 transition-all" style={{ borderLeftColor: '#A60000' }}>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg" style={{ background: '#FFE59A', color: '#650000' }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-institutional-black">Academic Curricula</h3>
                    <p className="text-xs text-gray-600 mt-1">VTU 2022/2026 scheme syllabi, credit structures, and scheme of evaluation.</p>
                    <Link to="/login/student" className="inline-flex items-center gap-1 text-xs font-bold text-crimson mt-2 hover:underline">
                      View Syllabus & Notes <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card border-l-4 hover:border-l-8 transition-all" style={{ borderLeftColor: '#650000' }}>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg" style={{ background: '#FFE59A', color: '#650000' }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-institutional-black">Competitive Exam Cell</h3>
                    <p className="text-xs text-gray-600 mt-1">Comprehensive practice mocks, question banks for JEE, NEET, and CET aspirants.</p>
                    <Link to="/login/student" className="inline-flex items-center gap-1 text-xs font-bold text-crimson mt-2 hover:underline">
                      Practice Tests <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Notice Board */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border">
              <div className="flex items-center justify-between pb-3 border-b border-institutional-border mb-4">
                <h3 className="font-bold text-base flex items-center gap-2" style={{ color: '#650000' }}>
                  <Bell size={18} className="text-crimson" />
                  Official Circulars
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FFE59A', color: '#500000' }}>
                  November 2026
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100/60 transition-colors">
                  <span className="inline-block bg-crimson text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Urgent</span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1.5">IA-2 Internal Examinations Schedule</h4>
                  <p className="text-[11px] text-gray-600 mt-1">Commencing from 18th to 25th Nov 2026 for all semesters. Hall ticket is mandatory.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">Nov 05, 2026 • Principal Office</span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                  <span className="inline-block bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Academics</span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1.5">New Study Materials – Data Structures Unit 4</h4>
                  <p className="text-[11px] text-gray-600 mt-1">Unit notes and previous VTU solved questions now available on student portal.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">Nov 04, 2026 • CSE Dept</span>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                  <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Event</span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1.5">College Annual Day 2026</h4>
                  <p className="text-[11px] text-gray-600 mt-1">Scheduled for 20th November at College Auditorium. Cultural registrations open.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">Nov 02, 2026 • Student Affairs</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-institutional-border text-center">
                <Link to="/login/student" className="text-xs font-bold text-crimson hover:underline">
                  Sign in to view all departmental notices →
                </Link>
              </div>
            </div>

            {/* Helpline Box */}
            <div
              className="rounded-xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 100%)' }}
            >
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Phone size={16} style={{ color: '#FFE59A' }} /> Student Support Desk
              </h4>
              <p className="text-xs text-white/80 mt-2">
                Facing issues with login, attendance, or exam submissions? Contact the academic cell.
              </p>
              <div className="mt-3 text-xs space-y-1 text-white/90">
                <p>📞 Phone: <strong>+91 (08192) 224455</strong></p>
                <p>✉ Email: <strong>support@sirmv.edu.in</strong></p>
                <p>⏱ Timings: <strong>Mon - Sat (9:00 AM - 5:00 PM)</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-institutional-black text-white/80 pt-10 pb-6 border-t-4" style={{ borderColor: '#A60000' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain rounded" />
              <span className="font-extrabold text-white text-sm">SIR MV INSTITUTIONS</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Committed to technical excellence and character building in engineering, sciences and management since 1986.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3" style={{ color: '#FFE59A' }}>Campuses</h5>
            <ul className="space-y-1.5 text-white/70">
              <li>• Davangere Main Campus</li>
              <li>• Shivamogga Technical Campus</li>
              <li>• Ballari Engineering College</li>
              <li>• Sir MV Research Foundation</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3" style={{ color: '#FFE59A' }}>Academic Portals</h5>
            <ul className="space-y-1.5 text-white/70">
              <li><Link to="/login/student" className="hover:text-white">Student Academic Dashboard</Link></li>
              <li><Link to="/login/professor" className="hover:text-white">Faculty Portal & Marks Entry</Link></li>
              <li><a href="#" className="hover:text-white">Examination Cell Circulars</a></li>
              <li><a href="#" className="hover:text-white">VTU Results Portal</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3" style={{ color: '#FFE59A' }}>Head Office</h5>
            <p className="text-white/70 leading-relaxed">
              Vidyanagar, PB Road,<br />
              Davangere – 577004, Karnataka, India.<br />
              Email: info@sirmv.edu.in<br />
              Website: www.sirmv.edu.in
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/50">
          <p>© {new Date().getFullYear()} Sir MV Group of Institutions. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Android Institutional Tablets & Desktop Browsers</p>
        </div>
      </footer>
    </div>
  );
}

