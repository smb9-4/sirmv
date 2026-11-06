# Sir MV College – Student & Faculty Academic Portal

A complete, responsive institutional academic portal prototype built for **Sir MV Group of Institutions** (Davangere | Shivamogga | Ballari), adhering strictly to official college branding, color palettes, and VTU academic standards.

---

## 👥 Cohort Dataset: 100 Students & 2 Professors

### 👨‍🏫 Faculty / Professor Accounts (2 Professors)
1. **Dr. Priya Nayak**
   - **Email ID**: `priya.nayak@sirmv.edu.in`
   - **Password**: `prof123`
   - **Role**: Associate Professor, Department of Computer Science & Engineering
   - **Assigned Courses**: Data Structures, Algorithms, Theory of Computation

2. **Prof. Ravi Shankar**
   - **Email ID**: `ravi.shankar@sirmv.edu.in`
   - **Password**: `prof123`
   - **Role**: Professor & Head of Department (HOD), Department of CSE
   - **Assigned Courses**: Operating Systems, Computer Networks, Software Architecture

### 🎓 100-Student Cohort (5th Semester CSE)
- **Roll Numbers**: `23CSE001` through `23CSE100` (all 100 students can log in with password `student123`).
- **Sections**:
  - **Section A**: Rolls `23CSE001` to `23CSE050` (50 Students)
  - **Section B**: Rolls `23CSE051` to `23CSE100` (50 Students)
- **Sample Students for Quick Evaluation**:
  - **Rahul Sharma** (`23CSE001` / `student123`) – Rank #16 (212/300 marks, 86.4% attendance)
  - **Aditya Patil** (`23CSE002` / `student123`) – Rank #1 Topper (268/300 marks, 94.2% attendance)
  - **Prajwal M** (`23CSE055` / `student123`) – Section B Student (138/300 marks)

---

## 📊 Analytical Capabilities on the 100-Student Cohort

In the **Professor Portal** under **Student Results & Performance Analytics** (`/professor/results`):
1. **Macro Cohort Metrics**:
   - Total Evaluated: **100 Students**
   - Batch Average: **172.4 / 300 (57.5%)**
   - Top Performer: **Aditya Patil (268/300)**
   - Pass Rate: **90%**
   - At-Risk Students: **15 Students** (Below 40% score or < 75% attendance)
2. **Visual Distributions**:
   - **Score Distribution Bell-Curve**: Histogram across 6 performance tiers (Distinction ≥80%, First Class 70-79%, Second Class 60-69%, Pass Class 50-59%, Marginal 40-49%, Remedial <40%).
   - **Section Comparison**: Section A (Rolls 001-050) vs Section B (Rolls 051-100) comparative means.
   - **Subject Means**: Physics (64/100), Chemistry (59/100), Mathematics (52/100).
3. **Data Slicing & Export**:
   - Cohort filters: **All 100 Students**, **Section A (50)**, **Section B (50)**, **Needs Support (At-Risk)**.
   - Live Search by Name or Roll Number.
   - Dynamic Multi-column Sorting (Rank, Marks, Attendance %, Name).
   - **Export CSV Button**: Generates and downloads `Sir_MV_100_Students_Analysis_*.csv` with all 100 student records directly to your machine.

---

## 🎨 Design System & Color Palette

- **Deep Maroon (`#650000`)**: Institutional header, section banners, primary branding.
- **Dark Maroon (`#500000`)**: Header gradients, elevated surfaces.
- **Crimson Red (`#A60000`)**: Navigation buttons, active tab indicators, primary actions.
- **Golden Yellow (`#FFE59A`)**: Announcement tickers, highlight badges, notices.
- **Gold (`#E5BD55`)**: Secondary action buttons, accent details.
- **Institutional Black (`#080808`)**: Dark navigation sections, footers.
- **Pure White (`#FFFFFF`)**: Cards, forms, content areas.
- **Light Grey (`#F3F3F3`)**: Page backgrounds.
- **Border Grey (`#DEDEDE`)**: Form inputs, table borders.
- **Error Red (`#F37F84`)**: Validation and alert messages.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Sir MV institutional color theme
- **Icons**: Lucide React
- **Data Visualization**: Recharts (BarChart, RadarChart, PieChart)
- **Routing**: React Router v7 with role-based `ProtectedRoute` guards
- **Persistence**: `localStorage` synchronized state via `PortalContext`
