// Shared institutional header used on login pages and homepage
export default function InstitutionHeader() {
  return (
    <header
      className="w-full text-white shadow-header"
      style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 60%, #7a0000 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <img src="/updated_logo.png" alt="Sir MV Logo" className="h-14 w-14 object-contain rounded" />
        <div className="flex-1">
          <h1 className="font-extrabold text-lg md:text-2xl tracking-wide text-white leading-tight">
            SIR MV GROUP OF INSTITUTIONS
          </h1>
          <p className="text-gold-light text-xs md:text-sm font-medium mt-0.5" style={{ color: '#FFE59A' }}>
            DAVANGERE &nbsp;|&nbsp; SHIVAMOGGA &nbsp;|&nbsp; BALLARI
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            Affiliated to VTU | Approved by AICTE | Accredited by NAAC
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1 text-xs text-white/70">
          <span>📞 0822-224455</span>
          <span>✉ info@sirmv.edu.in</span>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-1 overflow-x-auto">
          {['Home','About','Academics','Examinations','Results','Contact'].map(link => (
            <a key={link} href="#" className="nav-link text-sm whitespace-nowrap">{link}</a>
          ))}
        </div>
      </div>
    </header>
  );
}

