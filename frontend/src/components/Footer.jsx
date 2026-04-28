import { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Mail, 
  ArrowUpRight,
  Sparkles,
  Coffee,
  Copy,
  Check
} from 'lucide-react';

const Footer = ({ onSupportClick }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@kabanye.space');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      window.location.href = 'mailto:hello@kabanye.space';
    }
  };

  const quickLinks = [
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Resume', href: '#resume' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <footer className="relative bg-gray-950 text-gray-400">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Brand Section */}
            <div className="md:col-span-5 space-y-4">
              <a href="#" className="inline-flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-white">
                    Kabanye
                  </span>
                  <span className="text-lg font-light text-gray-500">Space</span>
                </div>
              </a>
              
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Building digital experiences with passion and precision. 
                Let's create something amazing together.
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500/70" />
                  <span>Nairobi, Kenya</span>
                </div>
                
                {/* Availability Status */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-xs text-emerald-400/80 font-medium">Available for hire</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-1 h-px bg-emerald-500 transition-all duration-200" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Section */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Let's Connect
              </h3>
              
              {/* Email with Copy */}
              <button
                onClick={copyEmail}
                className="group w-full flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800/80 border border-gray-800 hover:border-gray-700 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm text-gray-300 font-medium">hello@kabanye.space</div>
                </div>
                <div className="text-gray-600 group-hover:text-emerald-400 transition-colors">
                  {emailCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Social Links */}
              <div className="flex items-center gap-2 pt-2">
                {/* GitHub */}
                <a
                  href="#"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                {/* Twitter/X */}
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>© {currentYear} Kabanye Space</span>
              <span className="text-gray-800">•</span>
              <span>All rights reserved</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 hover:text-gray-400 transition-all duration-200 group"
              >
                <span>Back to top</span>
                <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              
              {/* Buy Me a Coffee - Opens Donation Modal */}
              <button
                onClick={onSupportClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30 transition-all duration-200 group"
              >
                <Coffee className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Buy me a coffee</span>
                <Sparkles className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Made with love */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-700">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>by Kabanye</span>
            <Sparkles className="w-3 h-3 text-emerald-600" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;