import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DonationModal from '../components/DonationModal';
import ProgressBar from '../components/ProgressBar';
import MessageWall from '../components/MessageWall';
import Footer from '../components/Footer';
import { 
  Heart, 
  Sparkles, 
  ArrowRight,
  Star,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  Coffee,
  Terminal,
  Database,
  Cloud,
  Target,
  Briefcase,
  Mail,
  ExternalLink,
  MapPin,
  GraduationCap,
  BadgeCheck,
  ShieldCheck,
  BrainCircuit,
  ShoppingCart,
  Leaf,
  Globe,
  Server,
  Fingerprint,
  Bot,
  Wrench,
  Lightbulb,
  Building2,
  Palette,
  LineChart,
  Eye,
} from 'lucide-react';

const HomePage = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
        25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        50% { transform: translateY(-10px) translateX(-10px); opacity: 0.5; }
        75% { transform: translateY(-30px) translateX(5px); opacity: 0.6; }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }
      .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      .animate-fade-in { animation: fadeIn 0.8s ease-out; }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const skillCategories = [
    {
      title: 'Frontend',
      icon: Palette,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      hoverBorder: 'hover:border-cyan-300',
      skills: ['HTML5 / CSS3', 'JavaScript (ES6+)', 'React / Next.js', 'Bootstrap / Tailwind'],
    },
    {
      title: 'Backend',
      icon: Server,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-300',
      skills: ['Python', 'Django / Flask', 'REST APIs', 'FastAPI'],
    },
    {
      title: 'Database',
      icon: Database,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-300',
      skills: ['SQL / PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    },
    {
      title: 'Cybersecurity',
      icon: ShieldCheck,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      hoverBorder: 'hover:border-red-300',
      skills: ['Linux / Kali', 'Network Security', 'Vulnerability Assessment', 'Penetration Testing'],
    },
    {
      title: 'AI & Machine Learning',
      icon: BrainCircuit,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-300',
      skills: ['TensorFlow / Keras', 'Scikit-learn', 'Neural Networks', 'Computer Vision / NLP'],
    },
    {
      title: 'Data Science',
      icon: LineChart,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hoverBorder: 'hover:border-orange-300',
      skills: ['Pandas / NumPy', 'Matplotlib / Seaborn', 'Data Visualization', 'EDA'],
    },
  ];

  const projects = [
    {
      title: 'MyFinder',
      subtitle: 'Smart Shopping Assistant',
      description: 'Jumia & Kilimall price comparison, price prediction, and product recommendation system powered by AI.',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-200',
      tech: ['React', 'FastAPI', 'AI/ML', 'Firebase'],
      link: 'https://myfinder.onrender.com',
    },
    {
      title: 'Agri AI',
      subtitle: 'Crop Disease Detection',
      description: 'Farmers upload crop images, the system identifies diseases and provides cures and preventive measures instantly.',
      icon: Leaf,
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-200',
      tech: ['Django', 'TensorFlow', 'PostgreSQL', 'React'],
      link: 'https://github.com/Kabanye/Agri_ai_app',
    },
    {
      title: 'Jangika House Rentals',
      subtitle: 'Rental Management System',
      description: 'A web app designed to advertise Jangika House rentals to the public and manage rental records efficiently.',
      icon: Building2,
      gradient: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-200',
      tech: ['React', 'Django', 'PostgreSQL', 'Tailwind'],
      link: 'https://jangika-house-rental.onrender.com/',
    },
    {
      title: 'Portfolio Terminal',
      subtitle: 'Interactive Developer Portfolio',
      description: 'A unique terminal-themed portfolio showcasing projects, skills, and experience in an engaging CLI interface.',
      icon: Terminal,
      gradient: 'from-purple-500 to-violet-500',
      shadow: 'shadow-purple-200',
      tech: ['React', 'Tailwind CSS', 'JavaScript'],
      link: 'https://vincent-terminal-portfolio.onrender.com/',
    },
  ];

  const highlights = [
    { icon: BadgeCheck, label: 'Built full-stack apps with Django, FastAPI & React' },
    { icon: Fingerprint, label: 'Exploring cybersecurity & ethical hacking' },
    { icon: Bot, label: 'Integrating AI into real-world applications' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onSupportClick={() => setShowDonationModal(true)} />
      
      <main className="flex-1">
        
        {/* ========== HERO SECTION ========== */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/10 rounded-full blur-[150px]" />
          
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s` }} />
            ))}
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-32 md:py-40">
            <div className="max-w-5xl mx-auto text-center">
              
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-sm font-semibold text-emerald-300">Open to Internships & Junior Developer Roles</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <a href="mailto:ngigivincent2022@gmail.com" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl">
                  <Briefcase className="w-4 h-4" />Hire Me<ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                <span className="block">Wanjiku</span>
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Vincent Ngigi</span>
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {[
                  { label: 'Junior Software Engineer', color: 'emerald' },
                  { label: 'Full Stack Developer', color: 'blue' },
                  { label: 'Ethical Hacking Student', color: 'purple' },
                ].map((tag, i) => (
                  <span key={i} className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm
                    ${tag.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : ''}
                    ${tag.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : ''}
                    ${tag.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : ''}
                  `}>{tag.label}</span>
                ))}
              </div>

              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                I build scalable web applications, developer tools, and AI-powered systems.
                Passionate about <span className="text-emerald-400 font-medium">open source</span>, <span className="text-blue-400 font-medium">cybersecurity</span>, and solving real-world problems.
              </p>

              <div className="flex items-center justify-center gap-4 mb-12">
                {[
                  { icon: 'github', href: '#', label: 'GitHub' },
                  { icon: 'linkedin', href: '#', label: 'LinkedIn' },
                  { icon: 'email', href: 'mailto:ngigivincent2022@gmail.com', label: 'Email' },
                  { icon: 'globe', href: 'https://vincent-terminal-portfolio.onrender.com/', label: 'Portfolio' },
                ].map((social, i) => (
                  <a key={i} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group" title={social.label}>
                    {social.icon === 'github' && <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                    {social.icon === 'linkedin' && <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                    {social.icon === 'email' && <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    {social.icon === 'globe' && <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  </a>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setShowDonationModal(true)} className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-3 text-lg"><Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />Support My Work<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                </button>
                <button onClick={() => setShowDonationModal(true)} className="group px-10 py-5 bg-amber-500/10 border-2 border-amber-500/20 text-amber-300 font-bold rounded-2xl hover:bg-amber-500/20 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg">
                  <Coffee className="w-5 h-5 group-hover:scale-110 transition-transform" />Buy Me a Coffee
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <a href="#about" className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors group">
              <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
              <div className="w-5 h-8 rounded-full border-2 border-gray-600 group-hover:border-emerald-400 flex justify-center pt-1.5 transition-colors"><div className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" /></div>
            </a>
          </div>
        </section>

        {/* ========== ABOUT SECTION ========== */}
        <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-16 lg:gap-20 items-center">
              
              <div className="lg:col-span-2 flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2.5rem] blur-2xl opacity-20" />
                  <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-[2rem] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 p-1 shadow-2xl shadow-green-200/50 overflow-hidden group">
                    <img src="/kabanye.png" alt="Wanjiku Vincent Ngigi" className="w-full h-full rounded-[1.7rem] object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full rounded-[1.7rem] bg-gray-900 flex items-center justify-center"><div class="text-center"><div class="w-28 h-28 rounded-full bg-emerald-500/20 mx-auto mb-4 flex items-center justify-center"><span class="text-6xl font-black text-emerald-400">VN</span></div></div></div>'; }} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-6 transition-transform">
                    <BadgeCheck className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* ===== AUTHENTIC M-PESA TILL CARD ===== */}
                <div className="w-full max-w-[320px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden border border-emerald-400/30 group hover:shadow-emerald-500/30 transition-shadow duration-300">
                  <div className="absolute inset-0 opacity-[0.08]">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
                  </div>

                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
                          <rect width="40" height="40" rx="8" fill="#059669"/>
                          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">M</text>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-extrabold tracking-tight leading-none">M-PESA</p>
                        <p className="text-[10px] font-medium text-emerald-100 tracking-wide">Lipa Na M-Pesa</p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="text-[9px] font-semibold text-emerald-100 uppercase tracking-[0.2em] mb-1.5">Till Number</p>
                      <p className="text-4xl font-black tracking-[0.12em] leading-none">4947204</p>
                      <p className="text-[9px] text-emerald-200/80 mt-1.5">Buy Goods & Services</p>
                    </div>

                    <div className="space-y-1.5">
                      {['Go to M-Pesa Menu', 'Select Lipa Na M-Pesa', 'Select Buy Goods & Services', 'Enter Till No: 4947204', 'Enter Amount & Send'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[10px] text-emerald-50/90">
                          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[9px] font-bold flex-shrink-0">{i + 1}</span>
                          <span className={i === 3 ? 'font-bold text-white' : ''}>{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-emerald-100 font-medium uppercase tracking-wider">Kabanye Space</p>
                        <p className="text-[8px] text-emerald-200/60 mt-0.5">Asante kwa usaidizi!</p>
                      </div>
                      <div className="bg-white/10 rounded-lg px-3 py-1.5">
                        <p className="text-[10px] font-black text-white tracking-[0.15em] leading-tight">TILL</p>
                        <p className="text-[10px] font-black text-white tracking-[0.15em] leading-tight">NUMBER</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">About Me</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
                  Crafting Digital<br />
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Experiences</span>
                </h2>
                
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg mb-10">
                  <p>I'm a passionate junior developer focused on building impactful real-world systems using modern technologies. From full-stack web applications to AI-powered tools, I thrive on turning complex challenges into elegant solutions.</p>
                  <p>Currently deepening my expertise in <span className="text-emerald-600 font-semibold">cybersecurity and ethical hacking</span>, while continuing to build and contribute to open-source projects that make a difference.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                  {highlights.map((item, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                      <item.icon className="w-5 h-5 text-emerald-600 mb-2" />
                      <p className="text-sm font-medium text-gray-700 leading-snug">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4 text-emerald-500" />Nairobi, Kenya</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><GraduationCap className="w-4 h-4 text-emerald-500" />Ethical Hacking Student</div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-600">Available for Hire</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SKILLS SECTION ========== */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Tech Stack</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">Technical Skills</h2>
              <p className="text-xl text-gray-500 max-w-xl mx-auto">Technologies I work with to bring ideas to life</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skillCategories.map((category, index) => (
                <div key={index} className={`group p-6 rounded-2xl ${category.bg} border-2 ${category.border} ${category.hoverBorder} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"><category.icon className={`w-5 h-5 ${category.color}`} /></div>
                    <h3 className="font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-gray-700 shadow-sm border border-gray-100 hover:border-gray-200 hover:text-gray-900 transition-all cursor-default">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PROJECTS SECTION ========== */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <Star className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Featured Work</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">Featured Projects</h2>
              <p className="text-xl text-gray-500">Real-world applications I've designed and built</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-6 shadow-xl ${project.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <project.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-600 mb-1">{project.subtitle}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all group/btn">
                      <Eye className="w-4 h-4" />View Project<ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SUPPORT SECTION ========== */}
        <section className="py-24 md:py-32 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Support the Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">Fuel the Journey</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">Your support helps me continue building open-source tools, learning advanced cybersecurity skills, and creating solutions that impact real users.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100"><ProgressBar /></div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button onClick={() => setShowDonationModal(true)} className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300/50 hover:-translate-y-1 transition-all flex items-center gap-3 text-lg">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />Support via M-Pesa<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setShowDonationModal(true)} className="group px-8 py-4 bg-amber-50 border-2 border-amber-200 text-amber-700 font-bold rounded-2xl hover:bg-amber-100 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-3 text-lg">
                <Coffee className="w-5 h-5 group-hover:scale-110 transition-transform" />Buy Me a Coffee
              </button>
            </div>
          </div>
        </section>

        {/* ========== MESSAGES SECTION ========== */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Community Love</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">Words from Supporters</h2>
              <p className="text-xl text-gray-500">Heartwarming messages from amazing people</p>
            </div>
            <MessageWall />
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[150px]" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-500/20 backdrop-blur-sm mb-10 ring-1 ring-emerald-500/20">
              <Lightbulb className="w-12 h-12 text-emerald-400" />
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Let's Build Something
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Amazing Together</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">Whether it's a project, internship, or collaboration — I'm ready to bring value to your team.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:ngigivincent2022@gmail.com" className="group px-10 py-5 bg-white text-gray-900 font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />Get in Touch<ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <button onClick={() => setShowDonationModal(true)} className="group px-10 py-5 bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />Support My Work
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer onSupportClick={() => setShowDonationModal(true)} />
      <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} />
    </div>
  );
};

export default HomePage;