import { useState, useEffect } from 'react';
import { 
  Shield, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  Users,
  Heart,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
  Loader,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  MessagesSquare,
  Target,
  Activity,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Zap,
  MoreVertical,
  Copy,
  ExternalLink,
  Bell,
  Settings,
  Command
} from 'lucide-react';
import { 
  verifyAdminKey, 
  getAllMessages, 
  approveMessage, 
  hideMessage, 
  deleteMessage,
  getAllTransactions,
  updateProgress,
  getAdminStats
} from '../services/api';

const Admin = () => {
  // Auth State
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Data State
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState({ goal_amount: 100000, current_amount: 0 });
  
  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check for existing session
  useEffect(() => {
    const savedKey = sessionStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      handleLogin(null, savedKey);
    }
  }, []);

  // Auto-dismiss success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogin = async (e, savedKey) => {
    if (e) e.preventDefault();
    
    const key = savedKey || adminKey.trim();
    if (!key) {
      setAuthError('Please enter admin key');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      await verifyAdminKey(key);
      
      sessionStorage.setItem('admin_key', key);
      setAdminKey(key);
      setIsAuthenticated(true);
      setAuthError('');
      
      await loadDashboardData();
    } catch (error) {
      if (error.response?.status === 403) {
        setAuthError('Invalid admin key');
      } else if (error.message === 'Network Error') {
        setAuthError('Cannot connect to server. Is the backend running?');
      } else {
        setAuthError(error.response?.data?.detail || 'Authentication failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setMessages([]);
    setTransactions([]);
    setStats(null);
    setActiveTab('dashboard');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [messagesRes, transactionsRes, statsRes] = await Promise.all([
        getAllMessages().catch(() => ({ data: [] })),
        getAllTransactions().catch(() => ({ data: [] })),
        getAdminStats().catch(() => ({ data: null })),
      ]);

      setMessages(messagesRes.data || []);
      setTransactions(transactionsRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load some data. Try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (donationId, currentVisibility) => {
    try {
      if (currentVisibility) {
        await hideMessage(donationId);
        setSuccessMessage('Message hidden from public view');
      } else {
        await approveMessage(donationId);
        setSuccessMessage('Message approved for public display');
      }
      
      setMessages(messages.map(msg => 
        msg.id === donationId ? { ...msg, is_public: !currentVisibility } : msg
      ));
    } catch (error) {
      setError('Failed to update message visibility');
    }
  };

  const handleDeleteMessage = async (donationId) => {
    try {
      await deleteMessage(donationId);
      setMessages(messages.filter(msg => msg.id !== donationId));
      setSuccessMessage('Message deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      setError('Failed to delete message');
      setShowDeleteConfirm(null);
    }
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProgress(progress);
      setSuccessMessage('Progress updated successfully');
    } catch (error) {
      setError('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search messages
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      (msg.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (msg.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'public') return matchesSearch && msg.is_public;
    if (filterStatus === 'hidden') return matchesSearch && !msg.is_public;
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'failed': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-10 border border-white/20 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 mb-6 shadow-xl shadow-emerald-500/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-gray-400 text-sm">Secure access to Kabanye Space management</p>
          </div>

          <form onSubmit={(e) => handleLogin(e)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={adminKey}
                  onChange={(e) => {
                    setAdminKey(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter your admin key"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <div className="flex items-center text-red-400 text-sm mt-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {authError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {authLoading ? (
                <span className="relative z-10 flex items-center justify-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center">
                  <Command className="w-5 h-5 mr-2" />
                  Access Dashboard
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Secure connection • <span className="text-emerald-400">Kabanye Space</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Kabanye Space</h1>
                <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={loadDashboardData}
                className="relative p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </button>
              
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Bell className="w-5 h-5" />
                {messages.filter(m => !m.is_public).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
              
              <div className="w-px h-6 bg-gray-200" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Alerts */}
          {successMessage && (
            <div className="mb-6 flex items-center justify-between bg-emerald-50 text-emerald-700 px-5 py-4 rounded-2xl border border-emerald-200 animate-slide-down shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-medium">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage('')} className="text-emerald-400 hover:text-emerald-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {error && (
            <div className="mb-6 flex items-center justify-between bg-red-50 text-red-700 px-5 py-4 rounded-2xl border border-red-200 animate-slide-down shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  label: 'Total Donations', 
                  value: stats.total_donations || 0, 
                  icon: DollarSign, 
                  gradient: 'from-blue-500 to-cyan-500',
                  bgGradient: 'from-blue-50 to-cyan-50',
                  iconBg: 'bg-blue-100',
                  iconColor: 'text-blue-600'
                },
                { 
                  label: 'Total Amount', 
                  value: `KES ${(stats.total_amount || 0).toLocaleString()}`, 
                  icon: TrendingUp, 
                  gradient: 'from-emerald-500 to-teal-500',
                  bgGradient: 'from-emerald-50 to-teal-50',
                  iconBg: 'bg-emerald-100',
                  iconColor: 'text-emerald-600'
                },
                { 
                  label: 'Messages', 
                  value: stats.total_messages || 0, 
                  icon: MessageSquare, 
                  gradient: 'from-purple-500 to-violet-500',
                  bgGradient: 'from-purple-50 to-violet-50',
                  iconBg: 'bg-purple-100',
                  iconColor: 'text-purple-600'
                },
                { 
                  label: 'Supporters', 
                  value: stats.unique_supporters || 0, 
                  icon: Users, 
                  gradient: 'from-orange-500 to-amber-500',
                  bgGradient: 'from-orange-50 to-amber-50',
                  iconBg: 'bg-orange-100',
                  iconColor: 'text-orange-600'
                },
              ].map((stat, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className={`relative bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                        <ArrowUp className="w-3 h-3" />
                        <span>+12%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 inline-flex gap-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'messages', label: 'Messages', icon: MessagesSquare },
              { id: 'progress', label: 'Progress', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'messages' && messages.filter(m => !m.is_public).length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold">
                    {messages.filter(m => !m.is_public).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Latest payment activities</p>
                  </div>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                    View All
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {transactions.slice(0, 10).map((tx, index) => (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-6">
                            <span className="font-semibold text-gray-900">KES {tx.amount?.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-600 font-mono text-sm">{tx.phone_number}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                tx.status === 'success' ? 'bg-emerald-500' :
                                tx.status === 'pending' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`} />
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(tx.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactions.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No transactions yet</p>
                    <p className="text-gray-400 text-sm mt-1">Transactions will appear here once donations start coming in</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-gray-600"
                    >
                      <option value="all">All Messages</option>
                      <option value="public">✓ Public</option>
                      <option value="hidden">✗ Hidden</option>
                    </select>
                    <button
                      onClick={loadDashboardData}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all text-gray-500 hover:text-emerald-600"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-3">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-600">
                              {(msg.name || 'A')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {msg.name || 'Anonymous Supporter'}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm text-emerald-600 font-medium">
                                KES {msg.amount?.toLocaleString()}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(msg.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            msg.is_public 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            {msg.is_public ? 'Public' : 'Hidden'}
                          </span>
                        </div>
                        {msg.message && (
                          <div className="bg-gray-50 rounded-xl p-4 ml-[52px]">
                            <p className="text-gray-700 text-sm leading-relaxed italic">
                              "{msg.message}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleVisibility(msg.id, msg.is_public)}
                          className={`p-2.5 rounded-xl transition-all ${
                            msg.is_public
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={msg.is_public ? 'Hide message' : 'Approve message'}
                        >
                          {msg.is_public ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(showDeleteConfirm === msg.id ? null : msg.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm === msg.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 ml-[52px]">
                        <div className="flex items-center justify-between bg-red-50 rounded-xl p-4 border border-red-100">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="text-sm font-medium text-red-700">Delete this message permanently?</p>
                              <p className="text-xs text-red-500 mt-0.5">This action cannot be undone</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredMessages.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                      <MessagesSquare className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No messages found</h3>
                    <p className="text-gray-500 text-sm">
                      {searchTerm ? 'Try adjusting your search or filters' : 'Messages from supporters will appear here'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Fundraising Progress</h2>
                <p className="text-sm text-gray-500 mt-0.5">Update your campaign goals</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleProgressUpdate} className="max-w-lg space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Goal Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">KES</span>
                      <input
                        type="number"
                        value={progress.goal_amount}
                        onChange={(e) => setProgress(p => ({ ...p, goal_amount: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-16 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg font-semibold"
                        placeholder="100,000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">KES</span>
                      <input
                        type="number"
                        value={progress.current_amount}
                        onChange={(e) => setProgress(p => ({ ...p, current_amount: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-16 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg font-semibold"
                        placeholder="50,000"
                      />
                    </div>
                  </div>

                  {/* Progress Preview */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {progress.goal_amount > 0 
                          ? Math.round((progress.current_amount / progress.goal_amount) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progress.goal_amount > 0 
                            ? Math.min((progress.current_amount / progress.goal_amount) * 100, 100) 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;