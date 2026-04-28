import { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Sparkles, 
  Mail, 
  MapPin, 
  Globe,
  FileText,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Zap,
  ExternalLink,
  Download
} from 'lucide-react';

const Navbar = ({ onSupportClick, onSectionClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [localTime, setLocalTime] = useState('');
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Get time of day for personalized greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
    
    // Update local time every minute
    const updateTime = () => {
      setLocalTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // External links configuration
  const portfolioUrl = 'https://vincent-terminal-portfolio.onrender.com/';
  
  // For React + FastAPI, the resume should be:
  // Option 1: A static file in the public folder or hosted separately
  // Option 2: Served via FastAPI static files endpoint
  // Option 3: Hosted on cloud storage (Google Drive, AWS S3, etc.)
  
  // Common approaches for React apps:
  const resumeOptions = {
    // If resume.pdf is in your React public folder
    publicFolder: `${portfolioUrl}resume.pdf`,
    
    // If FastAPI serves static files at /static/
    fastApiStatic: `${portfolioUrl}static/resume.pdf`,
    
    // If you have a dedicated downloads endpoint in FastAPI
    apiDownload: `${portfolioUrl}api/download/resume`,
    
    // If hosted on cloud storage (recommended for production)
    cloudStorage: 'https://your-cloud-storage.com/resume.pdf', // Replace with actual URL
  };

  // Choose the appropriate resume URL based on your setup
  // Option 1: If resume.pdf is in your React app's public/ folder
  const resumeUrl = resumeOptions.publicFolder;

  const quickLinks = [
    { 
      name: 'Portfolio', 
      icon: Globe, 
      href: portfolioUrl,
      isExternal: true,
      description: 'Explore my curated projects',
      badge: 'Visit',
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
    },
    { 
      name: 'Resume', 
      icon: FileText, 
      href: resumeUrl,
      isExternal: true,
      isDownload: true,
      description: 'Download my resume',
      badge: 'PDF',
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    },
  ];

  // Handle navigation
  const handleNavigation = (href, isExternal, isDownload = false) => {
    if (isExternal) {
      if (isDownload) {
        // For downloads, create a temporary link and click it
        const link = document.createElement('a');
        link.href = href;
        link.download = 'Vincent_Resume.pdf'; // Suggested filename
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(href, '_blank', 'noopener noreferrer');
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Rest of your component remains the same...
  // [Previous JSX code follows here]

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50">
      {/* Ultra-thin announcement bar - visible only on top */}
      <div className={`hidden md:block transition-all duration-700 ease-in-out ${
        isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-8 opacity-100'
      }`}>
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 via-emerald-950/50 to-gray-950 border-b border-gray-800/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-8 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="text-gray-400 font-light tracking-wide">
                  Good {timeOfDay} — Available for collaborations
                </span>
              </div>
              <span className="w-px h-3 bg-gray-800" />
              <span className="text-gray-300 flex items-center gap-1.5 font-light">
                <Clock className="w-3 h-3 text-emerald-400/70" />
                <span className="text-gray-500">Local Time</span>
                <span className="text-gray-300">{localTime} EAT</span>
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a 
                href="mailto:hello@kabanye.space" 
                className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-300 transition-all duration-300 group"
              >
                <Mail className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-light tracking-wide">hello@kabanye.space</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
              
              <span className="w-px h-3 bg-gray-800" />
              
              <div className="flex items-center gap-3">
                {[
                  { name: 'github', label: 'GitHub', url: 'https://github.com' },
                  { name: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
                  { name: 'twitter', label: 'Twitter', url: 'https://twitter.com' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative p-1.5 text-gray-500 hover:text-emerald-400 rounded-md transition-all duration-300 group/social"
                    aria-label={social.label}
                  >
                    <svg className="w-3.5 h-3.5 group-hover/social:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      {social.name === 'github' && <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>}
                      {social.name === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                      {social.name === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>}
                    </svg>
                    <span className="absolute inset-0 rounded-md bg-emerald-400/20 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Enhanced */}
      <nav className={`transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-2xl shadow-lg shadow-black/[0.03] border-b border-gray-200/50 mt-0' 
          : 'bg-white/90 backdrop-blur-xl border-b border-transparent mt-0'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px] md:h-[80px]">
            
            {/* Logo and brand section - same as before */}
            <a 
              href="/" 
              className="flex items-center gap-4 group/logo"
              onMouseEnter={() => setActiveItem('logo')}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className="relative">
                <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-[14px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-[1.5px] shadow-lg shadow-gray-900/5 group-hover/logo:shadow-emerald-500/10 transition-all duration-500 group-hover/logo:scale-[1.02]">
                  <div className="w-full h-full rounded-[12px] bg-white overflow-hidden flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      alt="Kabanye Space" 
                      className="w-7 h-7 md:w-8 md:h-8 object-contain group-hover/logo:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const monogram = document.createElement('div');
                        monogram.className = 'w-8 h-8 flex items-center justify-center';
                        monogram.innerHTML = `
                          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="url(#monogramGradient)"/>
                            <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui" font-weight="bold" font-size="18">K</text>
                            <defs>
                              <linearGradient id="monogramGradient" x1="0" y1="0" x2="32" y2="32">
                                <stop offset="0%" stop-color="#059669"/>
                                <stop offset="100%" stop-color="#0D9488"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        `;
                        e.target.parentElement.appendChild(monogram);
                      }}
                    />
                  </div>
                </div>
                
                <div className="absolute -inset-1 rounded-[16px] bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover/logo:opacity-100 blur-sm transition-opacity duration-500" />
                
                <div className="absolute -bottom-0.5 -right-0.5">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white shadow-sm" />
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-[5px]">
                  <span className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-gray-900">
                    Kabanye
                  </span>
                  <span className="text-[22px] md:text-[26px] font-light tracking-[-0.02em] text-emerald-500">
                    Space
                  </span>
                </div>
                <div className="flex items-center gap-1.5 -mt-0.5">
                  <span className="text-[10px] md:text-[11px] text-gray-400 font-medium tracking-[0.1em] uppercase">
                    Design & Code
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[10px] md:text-[11px] text-gray-400 font-medium tracking-[0.1em] uppercase">
                    Creative Studio
                  </span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-50/80 rounded-2xl p-1 backdrop-blur-sm border border-gray-100/50">
                {quickLinks.map((link, index) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.href, link.isExternal, link.isDownload)}
                    onMouseEnter={() => setActiveItem(link.name)}
                    onMouseLeave={() => setActiveItem(null)}
                    className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2.5 ${
                      activeItem === link.name
                        ? 'bg-white text-gray-900 shadow-sm shadow-black/5'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
                      activeItem === link.name
                        ? link.iconBg
                        : 'bg-transparent group-hover:bg-gray-100'
                    }`}>
                      {link.isDownload ? (
                        <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <link.icon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                      )}
                    </span>
                    
                    <span>{link.name}</span>
                    
                    {link.isExternal && (
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    )}
                    
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border transition-all duration-300 ${
                      activeItem === link.name
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-gray-100 text-gray-400 border-gray-200 group-hover:border-gray-300'
                    }`}>
                      {link.badge}
                    </span>
                  </button>
                ))}
              </div>
            
              <div className="w-px h-7 bg-gray-200 mx-1" />
              
              {/* Support Button */}
              <button
                onClick={onSupportClick}
                onMouseEnter={() => setActiveItem('support')}
                onMouseLeave={() => setActiveItem(null)}
                className={`group relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-500 flex items-center gap-2 overflow-hidden ${
                  activeItem === 'support'
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-[1.02]'
                    : 'bg-gray-900 text-white shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:scale-[1.02]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="absolute -top-1 -right-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </span>
                
                <Heart className={`w-4 h-4 transition-all duration-300 ${
                  activeItem === 'support' ? 'scale-110 text-emerald-400' : ''
                }`} />
                <span className="relative z-10 tracking-wide">Support</span>
                <Sparkles className={`w-3.5 h-3.5 transition-all duration-300 ${
                  activeItem === 'support' ? 'opacity-100 rotate-12' : 'opacity-60'
                }`} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
              aria-label="Toggle menu"
            >
              <div className={`transition-all duration-500 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-[700px] opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
          }`}>
            <div className="pb-8 space-y-3 border-t border-gray-100 pt-6">
              
              {/* Mobile Brand Card */}
              <div className="px-4 pb-6 mb-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 border border-gray-200/50">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">Kabanye Space</div>
                      <div className="text-xs text-gray-500 font-medium">Design & Code Studio</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Crafting digital experiences with precision and creativity.
                  </p>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="px-4 space-y-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.href, link.isExternal, link.isDownload)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${link.iconBg}`}>
                        {link.isDownload ? (
                          <Download className="w-5 h-5" />
                        ) : (
                          <link.icon className="w-5 h-5" />
                        )}
                      </span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
                          {link.name}
                          {link.isExternal && (
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{link.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                        {link.badge}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile Support Card */}
              <div className="px-4 mt-3">
                <button
                  onClick={() => {
                    onSupportClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full relative p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white text-left group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-emerald-400" />
                      </span>
                      <div>
                        <div className="font-semibold text-base">Support My Work</div>
                        <div className="text-sm text-gray-400 mt-0.5">Help fuel creativity</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  </div>
                </button>
              </div>

              {/* Mobile Contact Section */}
              <div className="px-4 pt-4 space-y-2">
                <a 
                  href="mailto:hello@kabanye.space"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 font-medium">Email</div>
                    <div className="text-sm font-semibold text-gray-900">hello@kabanye.space</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </a>
                
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Location</div>
                    <div className="text-sm font-semibold text-gray-900">Nairobi, Kenya</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;