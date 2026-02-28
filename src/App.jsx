import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  GitCommit, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  Code, 
  BarChart3, 
  Clock, 
  X, 
  Moon, 
  Sun, 
  Menu, 
  Save, 
  Trash2, 
  AlertCircle, 
  LogOut, 
  Shield, 
  UserCheck, 
  Lock, 
  ArrowLeft, 
  BrainCircuit, 
  FileText, 
  List, 
  CheckCircle, 
  Play, 
  Briefcase, 
  UserPlus, 
  Send, 
  Activity, 
  UserX, 
  Building2, 
  Calendar, 
  Zap, 
  FolderOpen, 
  Briefcase as ProjectIcon, 
  Trophy, 
  Edit3, 
  Filter, 
  Info, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  PlayCircle, 
  AlertTriangle,
  MessageSquare,
  PieChart,
  TrendingUp,
  Award,
  Star,
  Medal,
  Video,
  History,
  AlertOctagon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

// --- Logic & Helpers ---

const getToday = () => new Date().toISOString().split('T')[0];
const getPastDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

// --- Mock Data (Cleaned) ---

const INITIAL_PROJECTS = [];
const INITIAL_TASKS = [];

const INITIAL_USERS = [
  { id: 1, username: 'sudip17x@gmail.com', password: '123456', name: 'System Admin', role: 'Admin', isApproved: true, email: 'admin@agileroots.com', company: 'AgileRoots HQ' },
];

const INITIAL_LOGS = [];
const INITIAL_NOTIFICATIONS = [];

const WORKFLOW_STAGES = ["Todo", "In Progress", "Review", "Done"];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- Utility Components ---

const Toast = ({ message, type, onClose }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg mb-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
    type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
    type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
    'bg-slate-800 text-white'
  }`}>
    <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-auto opacity-50 hover:opacity-100">
      <X size={14} />
    </button>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, type = "default" }) => {
  const styles = {
    default: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    active: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Done: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Todo: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    Review: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-bold ${styles[type] || styles.default}`}>
      {children}
    </span>
  );
};

const Avatar = ({ name, size = "md" }) => {
  const sizeClass = size === "lg" ? "w-10 h-10 text-base" : size === "sm" ? "w-6 h-6 text-[10px]" : size === "full" ? "w-full h-full text-3xl" : "w-8 h-8 text-xs";
  const initial = name ? name.charAt(0) : "?";
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0`}>
      {initial}
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input 
      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
      {...props}
    />
  </div>
);

// --- Feature: Gamification Profile Component ---
const GamificationProfile = ({ user, tasks, logs }) => {
  // Calculate Stats
  const completedTasks = tasks.filter(t => t.assignee === user.name && t.status === 'Done').length;
  const totalCommits = logs.filter(l => l.userId === user.id).length;
  const bugFixes = logs.filter(l => l.userId === user.id && l.commitType === 'Bug Fix').length;

  // Level Logic: 1 level per 5 tasks
  const level = Math.floor(completedTasks / 5) + 1;
  const nextLevelProgress = (completedTasks % 5) / 5 * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-400 p-1 mb-2">
             <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold overflow-hidden">
               {user.name ? user.name.charAt(0) : "?"}
             </div>
          </div>
          <div className="px-3 py-1 bg-indigo-500 rounded-full text-xs font-bold">Level {level}</div>
        </div>

        <div className="flex-1 w-full">
          <h3 className="text-xl font-bold text-center md:text-left">{user.name}</h3>
          <p className="text-indigo-200 text-sm text-center md:text-left mb-4">{user.designation || user.role}</p>
          
          <div className="mb-4">
             <div className="flex justify-between text-xs mb-1 font-semibold text-indigo-200">
               <span>XP Progress</span>
               <span>{completedTasks % 5} / 5 Tasks to Lvl {level + 1}</span>
             </div>
             <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden">
               <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-1000" style={{width: `${nextLevelProgress}%`}}></div>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
             <div className="bg-white/10 rounded-lg p-2 text-center">
                <Trophy size={16} className="mx-auto mb-1 text-yellow-400"/>
                <div className="text-lg font-bold">{completedTasks}</div>
                <div className="text-[10px] opacity-70">Tasks Done</div>
             </div>
             <div className="bg-white/10 rounded-lg p-2 text-center">
                <GitCommit size={16} className="mx-auto mb-1 text-blue-400"/>
                <div className="text-lg font-bold">{totalCommits}</div>
                <div className="text-[10px] opacity-70">Commits</div>
             </div>
             <div className="bg-white/10 rounded-lg p-2 text-center">
                <Zap size={16} className="mx-auto mb-1 text-orange-400"/>
                <div className="text-lg font-bold">{bugFixes}</div>
                <div className="text-[10px] opacity-70">Bugs Fixed</div>
             </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">Earned Badges</h4>
        <div className="flex gap-3 flex-wrap justify-center md:justify-start">
           {completedTasks >= 1 && (
             <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/30" title="First Task Completed">
               <CheckCircle size={14} className="text-green-400"/> <span className="text-xs font-bold">Getting Started</span>
             </div>
           )}
           {bugFixes >= 1 && (
             <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-500/30" title="Fixed a Bug">
               <Zap size={14} className="text-orange-400"/> <span className="text-xs font-bold">Bug Hunter</span>
             </div>
           )}
           {completedTasks >= 10 && (
             <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/30" title="10 Tasks Done">
               <Medal size={14} className="text-yellow-400"/> <span className="text-xs font-bold">Productivity Pro</span>
             </div>
           )}
           {totalCommits >= 5 && (
             <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30" title="5 Commits">
               <Code size={14} className="text-blue-400"/> <span className="text-xs font-bold">Committer</span>
             </div>
           )}
           {completedTasks === 0 && bugFixes === 0 && <span className="text-xs text-indigo-300 italic">Complete tasks to earn badges!</span>}
        </div>
      </div>
    </div>
  );
};

// --- Feature: Analytics Dashboard Component ---
const ProjectAnalytics = ({ tasks, logs }) => {
  // Data Prep for Recharts
  const taskStatusData = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'Todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Review', value: tasks.filter(t => t.status === 'Review').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
  ].filter(d => d.value > 0);

  const logsByDate = logs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + 1;
    return acc;
  }, {});

  const commitActivityData = Object.keys(logsByDate).map(date => ({
    date: date.split('-').slice(1).join('/'), // MM/DD
    commits: logsByDate[date]
  })).sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-7); // Last 7 days

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Task Distribution */}
        <Card className="p-6">
           <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
             <PieChart size={18} className="text-indigo-500"/> Task Distribution
           </h3>
           <div className="h-[250px] w-full">
             {taskStatusData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                     <Pie
                       data={taskStatusData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {taskStatusData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}} itemStyle={{color: '#fff'}}/>
                     <Legend />
                   </RePieChart>
                 </ResponsiveContainer>
             ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">No task data available</div>
             )}
           </div>
        </Card>

        {/* Chart 2: Commit Activity */}
        <Card className="p-6">
           <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
             <TrendingUp size={18} className="text-green-500"/> Commit Velocity
           </h3>
           <div className="h-[250px] w-full">
             {commitActivityData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={commitActivityData}>
                     <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                     <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                        contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px'}}
                     />
                     <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                   </BarChart>
                 </ResponsiveContainer>
             ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">No activity data available</div>
             )}
           </div>
        </Card>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-none">
             <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Total Tasks</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white">{tasks.length}</div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-none">
             <div className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Completed</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white">{tasks.filter(t=>t.status === 'Done').length}</div>
          </Card>
          <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-none">
             <div className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase">High Priority</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white">{tasks.filter(t=>t.priority === 'High' || t.priority === 'Critical').length}</div>
          </Card>
          <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-none">
             <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase">Team Velocity</div>
             <div className="text-2xl font-bold text-slate-800 dark:text-white">{Math.round(logs.length / 7)} <span className="text-xs font-normal opacity-70">commits/day</span></div>
          </Card>
      </div>
    </div>
  );
};

// --- Mobile Navigation ---
const MobileBottomNav = ({ activeTab, navigateTo, onMenuClick, userRole, hasActiveProject }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 h-16 flex items-center justify-around z-40 px-2 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] safe-area-pb">
      <button 
        onClick={() => navigateTo(userRole === 'Admin' ? 'users' : 'dashboard')} 
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'dashboard' || (userRole === 'Admin' && activeTab === 'users') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
      >
        {userRole === 'Admin' ? <Users size={20} /> : <LayoutDashboard size={20} />}
        <span className="text-[10px] font-medium">{userRole === 'Admin' ? 'Users' : 'Home'}</span>
      </button>

      {(userRole === 'Admin' || (userRole === 'Manager' && !hasActiveProject)) && (
         <button 
           onClick={() => navigateTo(userRole === 'Admin' ? 'projects' : 'dashboard')} 
           className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'projects' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
         >
           <FolderOpen size={20} />
           <span className="text-[10px] font-medium">Projects</span>
         </button>
      )}

      {(userRole === 'Manager' && hasActiveProject) && (
         <button 
           onClick={() => navigateTo('project_tasks')} 
           className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'tasks' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
         >
           <CheckSquare size={20} />
           <span className="text-[10px] font-medium">Tasks</span>
         </button>
      )}

      <button 
        onClick={onMenuClick} 
        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500"
      >
        <Menu size={20} />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  );
};

// --- Auth Component ---

const LoginScreen = ({ onLogin, onRegister }) => {
  const [loginMode, setLoginMode] = useState('system');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', company: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister(formData);
    } else {
      onLogin(formData.username, formData.password, loginMode); 
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-sans relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 z-10 relative animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex text-sm font-bold border-b border-slate-200/50 dark:border-slate-700/50">
            <button onClick={() => { setLoginMode('system'); setIsRegistering(false); }} className={`flex-1 py-4 text-center transition-colors ${loginMode === 'system' ? 'text-indigo-600 bg-white/50 dark:bg-slate-800/50' : 'text-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>System Login</button>
            <button onClick={() => { setLoginMode('team'); setIsRegistering(false); }} className={`flex-1 py-4 text-center transition-colors ${loginMode === 'team' ? 'text-green-600 bg-white/50 dark:bg-slate-800/50' : 'text-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>MyTeam Login</button>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4 transition-transform hover:scale-105 duration-300 ${loginMode === 'system' ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-green-500 to-teal-600'}`}>
               A
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
               AgileRoots
             </h2>
             <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 text-center font-medium">
               {loginMode === 'system' ? 'Management Console' : 'Team Portal'}
             </p>
          </div>
          
          {loginMode === 'system' && (
            <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl mb-6">
              <button onClick={() => setIsRegistering(false)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isRegistering ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Sign In</button>
              <button onClick={() => setIsRegistering(true)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isRegistering ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Request Access</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                 <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                 <Input label="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required placeholder="e.g. Acme Corp" />
                 <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </>
            )}
            <Input label={loginMode === 'team' ? "Team Username" : "Username"} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            
            <button type="submit" className={`w-full font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 mt-2 text-white ${loginMode === 'system' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-green-500 to-teal-600'}`}>
              {isRegistering ? 'Request Approval' : 'Secure Login'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

// --- MyTeam Member Dashboard ---

const TeamMemberDashboard = ({ user, project, allUsers, teamLogs, tasks, notifications, meetingConfig, onCommit, onUpdateTaskStatus }) => {
  const [commitMessage, setCommitMessage] = useState("");
  const [commitType, setCommitType] = useState("Feature");
  const [myLogs, setMyLogs] = useState(teamLogs.filter(l => l.userId === user.id && l.projectId === user.projectId));
    
  const projectTasks = tasks.filter(t => t.projectId === user.projectId);
  const myAssignedTasks = projectTasks.filter(t => t.assignee === user.name);
  const myNotifications = notifications.filter(n => n.userId === user.id);

  const handleCommit = (e) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    
    const newLog = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      role: user.designation || "Team Member", 
      message: commitMessage,
      commitType: commitType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: getToday(),
      type: "commit",
      projectId: user.projectId
    };

    onCommit(newLog); 
    setMyLogs([newLog, ...myLogs]); 
    setCommitMessage("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in pb-16 md:pb-0">
       
       {/* Feature: Gamification Header */}
       <GamificationProfile user={user} tasks={tasks} logs={teamLogs} />
       
       {/* Feature: Upcoming Meeting Card (Shown if configured and user is invited) */}
       {meetingConfig.link && meetingConfig.attendees.includes(user.id) && (
          <Card className="p-0 overflow-hidden border-indigo-200 dark:border-indigo-900 shadow-lg shadow-indigo-500/10">
             <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-lg"><Video size={20}/></div>
                   <div>
                      <h4 className="font-bold text-sm uppercase tracking-wide opacity-90">Upcoming Team Meeting</h4>
                      <div className="font-bold text-lg">{meetingConfig.topic || "Project Sync"}</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-xs opacity-80 mb-1">Scheduled For</div>
                   <div className="font-bold flex items-center gap-1 justify-end"><Clock size={14}/> {meetingConfig.date || "TBD"}</div>
                </div>
             </div>
             <div className="p-4 bg-indigo-50 dark:bg-slate-800 flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[70%]">{meetingConfig.link}</span>
                <a href={meetingConfig.link} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Join Now</a>
             </div>
          </Card>
       )}

       {/* PROJECT CONTEXT CARD */}
       {project ? (
         <Card className="p-0 overflow-hidden border-indigo-200 dark:border-indigo-900">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{project.name}</h2>
                        <div className="flex items-center gap-4 text-indigo-100 text-xs">
                            <span className="flex items-center gap-1"><Building2 size={14}/> {project.client}</span>
                        </div>
                    </div>
                </div>
            </div>
         </Card>
       ) : (
         <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <AlertCircle size={48} className="mx-auto text-slate-400 mb-4"/>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Project Assigned</h3>
            <p className="text-slate-500">You are not currently assigned to any active project.</p>
         </div>
       )}

       {/* MY ASSIGNED TASKS & NOTIFICATIONS */}
       {project && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                   <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <CheckSquare className="text-indigo-600"/> My Tasks
                   </h3>
                   {myAssignedTasks.length > 0 ? (
                       <div className="space-y-4">
                           {myAssignedTasks.map(task => (
                               <div key={task.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                   <div className="flex justify-between items-start mb-3">
                                       <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white text-base">{task.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge type={task.priority}>{task.priority}</Badge>
                                                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{task.tag}</span>
                                            </div>
                                       </div>
                                       <Badge type={task.status}>{task.status}</Badge>
                                   </div>
                                   
                                   {/* TASK STATUS CONTROLS */}
                                   <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                       <button 
                                            onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                                            disabled={task.status === 'In Progress'}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                                                task.status === 'In Progress' 
                                                ? 'bg-blue-50 text-blue-400 cursor-default opacity-50' 
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                                            }`}
                                       >
                                            <PlayCircle size={14} /> Start
                                       </button>
                                       
                                       <button 
                                            onClick={() => onUpdateTaskStatus(task.id, 'Done')}
                                            disabled={task.status === 'Done'}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                                                task.status === 'Done' 
                                                ? 'bg-green-50 text-green-400 cursor-default opacity-50' 
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                                            }`}
                                       >
                                            <CheckCircle2 size={14} /> Complete
                                       </button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <div className="text-center py-10 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                           <CheckSquare size={32} className="mx-auto mb-2 opacity-50"/>
                           <p>No tasks assigned yet.</p>
                       </div>
                   )}
                </Card>

                {/* COMMIT FORM */}
                <Card className="p-6">
                   <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <GitCommit className="text-green-600"/> Log Daily Progress
                   </h3>
                   <form onSubmit={handleCommit}>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="md:col-span-1">
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Commit Type</label>
                              <select 
                                value={commitType}
                                onChange={(e) => setCommitType(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                              >
                                  <option value="Feature">Feature</option>
                                  <option value="Bug Fix">Bug Fix</option>
                                  <option value="Update">Update</option>
                                  <option value="Refactor">Refactor</option>
                              </select>
                          </div>
                          <div className="md:col-span-3">
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Description</label>
                              <textarea 
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="What did you achieve today? e.g. Implemented login API..."
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                              ></textarea>
                          </div>
                      </div>
                      <div className="flex justify-end">
                          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-600/20">
                             <Send size={16}/> Commit Work
                          </button>
                      </div>
                   </form>
                </Card>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
               {/* Feature: Notifications Widget */}
               <Card className="p-0 overflow-hidden">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2"><Bell size={16} className="text-orange-500"/> Notifications</h4>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">{myNotifications.length}</span>
                   </div>
                   <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[300px] overflow-y-auto">
                      {myNotifications.length > 0 ? myNotifications.map(notif => (
                         <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                               <span className={`w-2 h-2 rounded-full mt-1.5 ${notif.read ? 'bg-slate-300' : 'bg-orange-500'}`}></span>
                               <span className="text-xs text-slate-400">{notif.date}</span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 ml-4">{notif.message}</p>
                         </div>
                      )) : (
                         <div className="p-6 text-center text-slate-400 text-xs">No new notifications.</div>
                      )}
                   </div>
               </Card>

               {/* Recent Logs */}
               <Card className="p-0 overflow-hidden">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Recent Commits</h4>
                   </div>
                   <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[300px] overflow-y-auto">
                      {myLogs.map(log => (
                         <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{log.commitType || "Update"}</span>
                               <span className="text-xs text-slate-400">{log.date}</span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">{log.message}</p>
                         </div>
                      ))}
                      {myLogs.length === 0 && <div className="p-6 text-center text-slate-400 text-xs">No logs yet.</div>}
                   </div>
               </Card>
            </div>
         </div>
       )}
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tabHistory, setTabHistory] = useState(['dashboard']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // -- LOCAL STORAGE PERSISTENCE --
  const loadFromStorage = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      console.error("Storage load error", e);
      return defaultVal;
    }
  };

  const [currentUser, setCurrentUser] = useState(null); // Session only
  const [users, setUsers] = useState(() => loadFromStorage('users', INITIAL_USERS));
  const [projects, setProjects] = useState(() => loadFromStorage('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState(() => loadFromStorage('tasks', INITIAL_TASKS));
  const [teamLogs, setTeamLogs] = useState(() => loadFromStorage('logs', INITIAL_LOGS));
  const [isDarkMode, setIsDarkMode] = useState(() => loadFromStorage('theme', true));
  
  // Feature: Confirmation States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Save to storage on change
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('logs', JSON.stringify(teamLogs)); }, [teamLogs]);
  useEffect(() => { localStorage.setItem('theme', JSON.stringify(isDarkMode)); }, [isDarkMode]);

  // Feature: Notification System State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  
  const [toasts, setToasts] = useState([]);
  
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projectTab, setProjectTab] = useState('overview'); 
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Feature: Assign Requirements (Restored)
  const [showAssignReqModal, setShowAssignReqModal] = useState(false);
  const [memberForReq, setMemberForReq] = useState(null);

  // Feature: Team Meeting Config & Selection
  const [meetingConfig, setMeetingConfig] = useState({
      link: "",
      date: "",
      topic: "",
      attendees: [] // List of user IDs
  });
  const [selectedMeetingMembers, setSelectedMeetingMembers] = useState([]);

  // Feature: Renamed App
  const [config, setConfig] = useState({ projectName: "AgileRoots" });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const addNotification = (userId, message) => {
    const newNotif = {
        id: Date.now(),
        userId,
        message,
        date: getToday(),
        read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Feature: Send Meeting Handler with Selection Logic
  const handleSendMeeting = () => {
        if (!meetingConfig.topic || !meetingConfig.link || !meetingConfig.date) {
            addToast("Please fill in all meeting details", "error");
            return;
        }
        if (selectedMeetingMembers.length === 0) {
            addToast("Please select at least one team member", "error");
            return;
        }

        // Save attendees to config so they can see the card
        setMeetingConfig(prev => ({ ...prev, attendees: selectedMeetingMembers }));

        // Notify selected users
        selectedMeetingMembers.forEach(userId => {
            addNotification(userId, `Meeting: ${meetingConfig.topic} scheduled for ${meetingConfig.date}`);
        });
        
        addToast(`Meeting invites sent to ${selectedMeetingMembers.length} member(s)!`, "success");
        setShowSettingsModal(false);
        setSelectedMeetingMembers([]); // Reset selection
  };

  const toggleMeetingMember = (userId) => {
      setSelectedMeetingMembers(prev => 
          prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
      );
  };

  const calculateProjectProgress = (pid) => {
     const projectTasks = tasks.filter(t => t.projectId === pid);
     if (projectTasks.length === 0) return 0;
     const doneTasks = projectTasks.filter(t => t.status === 'Done').length;
     return Math.round((doneTasks / projectTasks.length) * 100);
  };

  const navigateTo = (tab) => {
    if (tab === 'project_tasks') {
        if (!activeProjectId) return; 
        setProjectTab('tasks');
        return;
    }

    if (tab === activeTab) return;
    setTabHistory(prev => [...prev, tab]);
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleBack = () => {
    if (tabHistory.length > 1) {
        const newHistory = tabHistory.slice(0, -1);
        setTabHistory(newHistory);
        setActiveTab(newHistory[newHistory.length - 1]);
        if (newHistory[newHistory.length - 1] === 'dashboard') {
            setActiveProjectId(null);
            setProjectTab('overview');
        }
    }
  };

  const handleLogin = (username, password, mode) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (mode === 'system' && (user.role === 'TeamMember')) { addToast("Please use MyTeam Login for this account.", "error"); return; }
      if (mode === 'team' && (user.role !== 'TeamMember')) { addToast("Admins/Managers must use System Login.", "error"); return; }
      if (!user.isApproved) { addToast("Account pending approval.", "error"); return; }
      
      setCurrentUser(user);
      const startTab = user.role === 'Admin' ? 'users' : 'dashboard'; 
      setActiveTab(startTab);
      setTabHistory([startTab]);
      addToast(`Welcome, ${user.name}!`, "success");
    } else {
      addToast("Invalid credentials", "error");
    }
  };

  const handleRegister = (data) => {
    if (users.find(u => u.username === data.username)) { addToast("Username taken", "error"); return; }
    setUsers([...users, { id: users.length + 1, ...data, role: 'Manager', isApproved: false }]);
    addToast("Registration successful! Wait for Admin approval.", "success");
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newProject = { 
      id: Date.now(), 
      name: fd.get('name'), 
      client: fd.get('client'), 
      manager: currentUser.name, 
      status: "Active",
      description: fd.get('description')
    };
    setProjects([...projects, newProject]);
    setShowAddProjectModal(false);
    addToast("Project created successfully!", "success");
  };

  const createTeamMember = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get('username');
    if (users.find(u => u.username === username)) { addToast("Username already exists", "error"); return; }
    
    const newUser = { 
        id: Date.now(), 
        username: username, 
        password: fd.get('password'), 
        name: fd.get('name'), 
        role: 'TeamMember', 
        isApproved: true, 
        email: 'team@project.com', 
        designation: fd.get('designation'),
        projectId: activeProjectId,
        addedBy: currentUser.name
    };
    
    setUsers([...users, newUser]);
    addToast(`Added ${newUser.name} to this project`, "success");
    e.target.reset();
    setShowAddMemberModal(false); 
  };

  const handleTeamCommit = (newLog) => {
     setTeamLogs([newLog, ...teamLogs]);
     addToast("Work committed successfully!", "success");
  };

  const updateUserStatus = (userId, status) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isApproved: status } : u));
    addToast(status ? "User Approved" : "User Access Revoked", status ? "success" : "warning");
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
        setUsers(users.filter(u => u.id !== userToDelete));
        addToast("User removed", "success");
        setUserToDelete(null);
    }
  };

  const confirmLogout = () => {
      setCurrentUser(null);
      addToast("Logged out successfully");
      setActiveProjectId(null);
      setShowLogoutModal(false);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newTask = {
      id: Date.now(),
      title: fd.get('title'),
      assignee: fd.get('assignee') || "Unassigned",
      status: WORKFLOW_STAGES[0],
      priority: fd.get('priority'),
      tag: "Feature",
      projectId: activeProjectId
    };
    setTasks([...tasks, newTask]);
    setShowNewTaskModal(false);
    
    // Feature: Add Notification for Assignee (if assigned on creation)
    if (newTask.assignee !== "Unassigned") {
        const assigneeUser = users.find(u => u.name === newTask.assignee);
        if (assigneeUser) {
            addNotification(assigneeUser.id, `New task assigned: ${newTask.title}`);
        }
    }

    addToast("Task created successfully", "success");
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const assigneeName = fd.get('assignee');
    setTasks(tasks.map(t => t.id === taskToAssign.id ? { ...t, assignee: assigneeName } : t));
    
    // Feature: Add Notification for Assignee
    const assigneeUser = users.find(u => u.name === assigneeName);
    if (assigneeUser) {
        addNotification(assigneeUser.id, `You have been assigned to task: ${taskToAssign.title}`);
    }

    setShowAssignModal(false);
    setTaskToAssign(null);
    addToast("Task assigned", "success");
  };

  // Feature: Handle Assigning Requirement directly from table
  const handleAssignRequirement = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newTask = {
        id: Date.now(),
        title: fd.get('title'),
        assignee: memberForReq.name, // Direct assignment
        status: WORKFLOW_STAGES[0],
        priority: fd.get('priority'),
        tag: fd.get('tag') || "Requirement",
        projectId: activeProjectId
    };
    setTasks([...tasks, newTask]);
    
    // Feature: Add Notification for Assignee
    addNotification(memberForReq.id, `New requirement assigned: ${newTask.title}`);

    setShowAssignReqModal(false);
    setMemberForReq(null);
    addToast(`Requirement assigned successfully`, "success");
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
      const task = tasks.find(t => t.id === taskId);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      
      const msg = newStatus === 'Done' ? "Task Completed!" : "Task Updated";
      const type = newStatus === 'Done' ? 'success' : 'info';
      
      addToast(msg, type);
  };

  const moveTask = (taskId, newStatus) => {
    handleUpdateTaskStatus(taskId, newStatus);
  };

  if (!currentUser) return (
      <>
        <div className="fixed top-4 right-4 z-[60] flex flex-col items-end w-full max-w-sm">{toasts.map(t => <Toast key={t.id} message={t.msg} type={t.type} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />)}</div>
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
      </>
  );

  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Admin';
  const isTeamMember = currentUser.role === 'TeamMember';
  const isAdmin = currentUser.role === 'Admin';
  const activeProjectDetails = projects.find(p => p.id === activeProjectId);
  const activeProjectProgress = activeProjectId ? calculateProjectProgress(activeProjectId) : 0;
  const projectMembers = activeProjectId ? users.filter(u => u.projectId === activeProjectId) : [];
  
  const availableMeetingAttendees = activeProjectId 
      ? users.filter(u => u.projectId === activeProjectId) 
      : users.filter(u => u.role !== 'Admin'); 

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:translate-x-0 z-[60] flex flex-col items-end w-full max-w-sm px-4 md:px-0 pointer-events-none">
        {toasts.map(t => <div key={t.id} className="pointer-events-auto"><Toast message={t.msg} type={t.type} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} /></div>)}
      </div>

      {/* CONFIRMATION MODALS */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Logout">
         <div className="text-center p-4">
             <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} />
             </div>
             <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Are you sure?</h4>
             <p className="text-slate-500 text-sm mb-6">You will be logged out of your session.</p>
             <div className="flex gap-3 justify-center">
                 <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                 <button onClick={confirmLogout} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/30">Yes, Logout</button>
             </div>
         </div>
      </Modal>

      <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Confirm Removal">
         <div className="text-center p-4">
             <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertOctagon size={32} />
             </div>
             <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Remove User?</h4>
             <p className="text-slate-500 text-sm mb-6">This action cannot be undone. The user will be permanently removed.</p>
             <div className="flex gap-3 justify-center">
                 <button onClick={() => setUserToDelete(null)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                 <button onClick={confirmDeleteUser} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/30">Confirm Remove</button>
             </div>
         </div>
      </Modal>

      {/* MODALS */}
      <Modal isOpen={showAddProjectModal} onClose={() => setShowAddProjectModal(false)} title="Create New Project">
         <form onSubmit={handleAddProject}>
            <Input name="name" label="Project Name" placeholder="e.g. Mobile App" required />
            <Input name="client" label="Client Name" placeholder="e.g. Corp" required />
            <div className="mb-3">
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Description</label>
               <textarea name="description" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm min-h-[80px]" placeholder="Brief project goal..."></textarea>
            </div>
            <div className="flex justify-end mt-6"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold w-full md:w-auto">Create Project</button></div>
         </form>
      </Modal>

      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title={`Add Member to ${activeProjectDetails?.name || 'Project'}`}>
         <form onSubmit={createTeamMember}>
            <div className="grid grid-cols-1 gap-4">
               <Input name="name" label="Full Name" placeholder="e.g. John Doe" required />
               <Input name="designation" label="Job Title" placeholder="e.g. Frontend" required />
               <Input name="username" label="Set Username" placeholder="e.g. dev_john" required />
               <Input name="password" label="Set Password" type="text" placeholder="e.g. 12345" required />
            </div>
            <div className="mt-6 flex justify-end"><button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 w-full md:w-auto"><UserPlus size={18}/> Add to Project</button></div>
         </form>
      </Modal>

      <Modal isOpen={showNewTaskModal} onClose={() => setShowNewTaskModal(false)} title="Create Project Task">
         <form onSubmit={handleCreateTask}>
            <Input name="title" label="Task Title" placeholder="e.g. Database Setup" required />
            <div className="mb-3"><label className="block text-xs font-semibold text-slate-500 uppercase">Priority</label><select name="priority" defaultValue="Medium" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
            <div className="flex justify-end mt-6"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold w-full md:w-auto">Create Task</button></div>
         </form>
      </Modal>

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Task">
         <form onSubmit={handleAssignTask}>
            <p className="mb-4 text-sm text-slate-500">Assigning task: <strong>{taskToAssign?.title}</strong></p>
            <div className="mb-6"><label className="block text-xs font-semibold text-slate-500 uppercase">Select Member</label><select name="assignee" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm" required><option value="">Choose...</option>{projectMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
            <div className="flex justify-end"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold w-full md:w-auto">Assign</button></div>
         </form>
      </Modal>

      <Modal isOpen={showAssignReqModal} onClose={() => setShowAssignReqModal(false)} title={`Assign Requirement to ${memberForReq?.name}`}>
         <form onSubmit={handleAssignRequirement}>
            <Input name="title" label="Requirement / Task" placeholder="e.g. Optimize Database Queries" required />
            <div className="mb-3">
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Priority</label>
               <select name="priority" defaultValue="High" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option></select>
            </div>
            <div className="mb-3">
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Category</label>
               <select name="tag" defaultValue="Requirement" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm"><option value="Requirement">Requirement</option><option value="Feature">Feature</option><option value="Bug">Bug</option><option value="Optimization">Optimization</option></select>
            </div>
            <div className="flex justify-end mt-6"><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold w-full md:w-auto">Assign</button></div>
         </form>
      </Modal>

      {/* Feature: Settings Modal (Cleaned up) */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="System Settings">
         <div className="space-y-6">
            
            {/* Feature: Team Meeting Config with Selection */}
            <div className="space-y-3">
               <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                 <Video size={16}/> Team Meeting Setup
               </h4>
               <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <Input label="Meeting Topic" placeholder="e.g. Weekly Sync" value={meetingConfig.topic} onChange={e => setMeetingConfig({...meetingConfig, topic: e.target.value})} />
                  <Input label="Meeting Link" placeholder="https://zoom.us/j/..." value={meetingConfig.link} onChange={e => setMeetingConfig({...meetingConfig, link: e.target.value})} />
                  <Input label="Date & Time" placeholder="e.g. Mon, 10:00 AM" value={meetingConfig.date} onChange={e => setMeetingConfig({...meetingConfig, date: e.target.value})} />
                  
                  {/* Select Attendees Feature */}
                  <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Attendees</label>
                      <div className="max-h-[150px] overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 space-y-1">
                          {availableMeetingAttendees.length > 0 ? availableMeetingAttendees.map(u => (
                              <div key={u.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded cursor-pointer" onClick={() => toggleMeetingMember(u.id)}>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedMeetingMembers.includes(u.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                      {selectedMeetingMembers.includes(u.id) && <CheckCircle size={10} />}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                      <Avatar name={u.name} size="sm" />
                                      <span className="text-slate-700 dark:text-slate-200 font-medium">{u.name}</span>
                                      <span className="text-xs text-slate-400">({u.role})</span>
                                  </div>
                              </div>
                          )) : (
                              <div className="text-xs text-slate-400 p-2 text-center">No members available to invite.</div>
                          )}
                      </div>
                  </div>

                  <div className="flex justify-end mt-2">
                     <button onClick={handleSendMeeting} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                        <Send size={14}/> Send Invite
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </Modal>

      {/* Sidebar & Layout */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}/>}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative flex flex-col hidden md:flex`}>
        <div className="p-6 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg ${isTeamMember ? 'bg-green-600' : 'bg-indigo-600'}`}>A</div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AgileRoots</span>
        </div>
        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {!isAdmin && <button onClick={() => navigateTo('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'dashboard' ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400"}`}><LayoutDashboard size={20} /> {isTeamMember ? 'My Dashboard' : (activeProjectId ? 'Project Home' : 'All Projects')}</button>}
          {isAdmin && <button onClick={() => navigateTo('users')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users' ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400"}`}><Users size={20} /> Admins & Managers</button>}
          
          {(isManager || isAdmin) && (
              <button onClick={() => setShowSettingsModal(true)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-slate-600 hover:bg-slate-50 dark:text-slate-400`}><Settings size={20} /> System Settings</button>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">{isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? "Light" : "Dark"}</button>
           <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <Menu size={24} />
             </button>
             <span className="md:hidden font-bold text-xl text-slate-900 dark:text-white tracking-tight">AgileRoots</span>
             
             {tabHistory.length > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-300" title="Go Back">
                   <ArrowLeft size={20} />
                   <span className="hidden sm:inline text-sm font-medium">Back</span>
                </button>
             )}
           </div>
           
           <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
              {config.projectName} / <span className="text-slate-900 dark:text-white ml-1">
                  {activeProjectId 
                    ? `Project: ${activeProjectDetails?.name || '...'}` 
                    : activeTab === 'progress' && !activeProjectId ? 'Global Activity Feed' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1">
                 <Shield size={12} className={`mr-2 ${isManager ? 'text-indigo-600 dark:text-indigo-400' : 'text-green-600'}`} />
                 <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{currentUser.role}</span>
              </div>

              <button 
                onClick={() => setShowLogoutModal(true)}
                className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Logout"
              >
                <LogOut size={20} />
              </button>

              <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                 <div className="text-right hidden sm:block">
                   <div className="text-sm font-medium text-slate-900 dark:text-white leading-none mb-1">{currentUser.name}</div>
                   <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">{currentUser.username}</div>
                 </div>
                 <Avatar name={currentUser.name} />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
           
           {/* VIEW: Team Member Dashboard */}
           {activeTab === 'dashboard' && isTeamMember && (
              <TeamMemberDashboard 
                 user={currentUser} 
                 project={projects.find(p => p.id === currentUser.projectId)}
                 allUsers={users} 
                 teamLogs={teamLogs} 
                 tasks={tasks}
                 notifications={notifications}
                 meetingConfig={meetingConfig}
                 onCommit={handleTeamCommit} 
                 onUpdateTaskStatus={handleUpdateTaskStatus}
              />
           )}

           {/* VIEW: Manager Dashboard (Project List OR Active Project Dashboard) */}
           {activeTab === 'dashboard' && isManager && !isAdmin && (
              <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
                 
                 {/* STATE 1: List of All Projects - FIXED CRASH CONDITION HERE */}
                 {!activeProjectId || !activeProjectDetails ? (
                    <>
                       <div className="flex justify-between items-center mb-6">
                          <div><h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Your Projects</h2><p className="text-slate-500 text-xs md:text-sm">Select a project to manage.</p></div>
                          <button onClick={() => setShowAddProjectModal(true)} className="bg-indigo-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><Plus size={16}/> <span className="hidden md:inline">New Project</span><span className="md:hidden">New</span></button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                          {projects.length > 0 ? projects.map(p => {
                             const prog = calculateProjectProgress(p.id);
                             return (
                               <Card key={p.id} className="p-5 md:p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-indigo-500" onClick={() => { setActiveProjectId(p.id); setProjectTab('overview'); }}>
                                  <div className="flex justify-between items-start mb-4"><div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400"><ProjectIcon size={24}/></div><Badge type={p.status === 'Active' ? 'success' : 'default'}>{p.status}</Badge></div>
                                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{p.name}</h3>
                                  <p className="text-xs text-slate-500 mb-4">{p.client}</p>
                                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3"><div className="bg-indigo-600 h-full rounded-full" style={{width: `${prog}%`}}></div></div>
                                  <div className="flex justify-between items-center text-xs text-slate-500"><span>{prog}% Complete</span><span className="flex items-center gap-1"><Users size={12}/> {users.filter(u => u.projectId === p.id).length} Members</span></div>
                               </Card>
                             );
                          }) : (
                             <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <FolderOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No projects yet</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mt-1 mb-4 text-sm">Get started by creating a new project to manage tasks and team members.</p>
                                <button onClick={() => setShowAddProjectModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700">Create First Project</button>
                             </div>
                          )}
                       </div>
                    </>
                 ) : (
                    <>
                       {/* STATE 2: Project Detail View - FIXED OPTIONAL CHAINING */}
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div className="flex items-center gap-3">
                             <button onClick={() => { setActiveProjectId(null); setProjectTab('overview'); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"><ArrowLeft/></button>
                             <div><h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{activeProjectDetails?.name}</h2><p className="text-slate-500 text-xs md:text-sm">Client: {activeProjectDetails?.client}</p></div>
                          </div>
                          <div className="flex gap-2">
                             {/* Settings Button */}
                             <button onClick={() => setShowSettingsModal(true)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200">
                                 <Settings size={20}/>
                             </button>
                             <button onClick={() => setShowAddMemberModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><UserPlus size={16}/> Add Member</button>
                          </div>
                       </div>

                       <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
                          {['overview', 'tasks', 'analytics', 'history'].map(tab => (
                             <button key={tab} onClick={() => setProjectTab(tab)} className={`px-6 py-3 text-sm font-medium border-b-2 capitalize transition-colors flex-shrink-0 ${projectTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>
                          ))}
                       </div>

                       {projectTab === 'overview' && (
                         <div className="space-y-6 animate-in fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                               <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
                                  <h3 className="text-lg font-bold opacity-90 mb-1">Status</h3>
                                  <div className="text-3xl font-bold mb-4">{activeProjectDetails?.status}</div>
                                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden"><div className="bg-white h-full" style={{width: `${activeProjectProgress}%`}}></div></div>
                                  <div className="mt-2 text-xs opacity-70">{activeProjectProgress}% Completion</div>
                               </Card>
                               <Card className="p-6 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setProjectTab('analytics')}>
                                   <div className="flex justify-between items-center mb-2">
                                       <div className="text-sm text-slate-500">Total Commits</div>
                                       <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg flex items-center justify-center"><GitCommit size={18}/></div>
                                   </div>
                                   <div className="text-3xl font-bold text-slate-800 dark:text-white">{teamLogs.filter(l => l.projectId === activeProjectId).length}</div>
                                   <div className="text-xs text-indigo-600 mt-2 font-medium">View Analytics</div>
                               </Card>
                               <Card className="p-6 flex items-center justify-between"><div><div className="text-sm text-slate-500 mb-1">Members</div><div className="text-3xl font-bold text-slate-800 dark:text-white">{projectMembers.length}</div></div><div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center"><Users /></div></Card>
                            </div>

                            <Card className="overflow-hidden">
                               <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2"><Trophy size={18} className="text-orange-500"/> <h3 className="font-bold text-slate-800 dark:text-white">Member Performance</h3></div>
                               <div className="overflow-x-auto">
                                  <table className="w-full text-sm text-left">
                                     <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/30"><tr><th className="px-6 py-3">Member</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Commits</th><th className="px-6 py-3">Tasks</th><th className="px-6 py-3">Done</th><th className="px-6 py-3">Action</th></tr></thead>
                                     <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {projectMembers.map(m => {
                                           const memberCommits = teamLogs.filter(l => l.userId === m.id && l.projectId === activeProjectId).length;
                                           const tasksAssigned = tasks.filter(t => t.assignee === m.name && t.projectId === activeProjectId).length;
                                           const tasksDone = tasks.filter(t => t.assignee === m.name && t.projectId === activeProjectId && t.status === 'Done').length;
                                           
                                           return (
                                              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                 <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3"><Avatar name={m.name} /> {m.name}</td>
                                                 <td className="px-6 py-4 text-slate-500">{m.designation}</td>
                                                 <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{memberCommits}</td>
                                                 <td className="px-6 py-4">{tasksAssigned}</td>
                                                 <td className="px-6 py-4 text-green-600 font-medium">{tasksDone}</td>
                                                 <td className="px-6 py-4 flex items-center">
                                                    <button 
                                                       onClick={() => { setMemberForReq(m); setShowAssignReqModal(true); }}
                                                       className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded mr-2"
                                                    >
                                                       <FileText size={14} /> Assign
                                                    </button>
                                                    <button 
                                                       onClick={() => setUserToDelete(m.id)}
                                                       className="text-red-600 hover:text-red-900 dark:hover:text-red-400 flex items-center gap-1 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                                                    >
                                                       <Trash2 size={14} /> Remove
                                                    </button>
                                                 </td>
                                              </tr>
                                           );
                                        })}
                                        {projectMembers.length === 0 && <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400">No members assigned. <button onClick={() => setShowAddMemberModal(true)} className="text-indigo-600 font-bold hover:underline">Add Now</button></td></tr>}
                                     </tbody>
                                  </table>
                               </div>
                            </Card>
                         </div>
                       )}

                       {/* Feature: Customizable Kanban Board (Fixed Stages) */}
                       {projectTab === 'tasks' && (
                          <div className="h-full flex flex-col animate-in fade-in">
                             <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800 dark:text-white">Project Tasks</h3><button onClick={() => setShowNewTaskModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Create Task</button></div>
                             <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
                               {WORKFLOW_STAGES.map(status => (
                                  <div key={status} className="flex-1 min-w-[280px] md:min-w-[300px] flex flex-col gap-4 snap-center">
                                     <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-700"><h3 className="font-bold text-slate-700 dark:text-slate-200">{status}</h3><span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{tasks.filter(t => t.projectId === activeProjectId && t.status === status).length}</span></div>
                                     <div className="flex flex-col gap-3">
                                        {tasks.filter(t => t.projectId === activeProjectId && t.status === status).map(task => (
                                           <Card key={task.id} className="p-4 group hover:shadow-md">
                                              <div className="flex justify-between items-start mb-2"><Badge type={task.priority}>{task.priority}</Badge><button onClick={() => { setTaskToAssign(task); setShowAssignModal(true); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-indigo-600"><UserPlus size={16}/></button></div>
                                              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3">{task.title}</h4>
                                              <div className="flex justify-between items-center">
                                                 <div className="flex items-center gap-2 text-xs text-slate-500"><Avatar name={task.assignee} /> {task.assignee}</div>
                                                 <div className="flex gap-1">
                                                    {/* Move to next stage logic */}
                                                    {status !== WORKFLOW_STAGES[WORKFLOW_STAGES.length - 1] && (
                                                       <button onClick={() => moveTask(task.id, WORKFLOW_STAGES[WORKFLOW_STAGES.indexOf(status) + 1])} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 p-1 rounded"><ChevronRight size={14}/></button>
                                                    )}
                                                 </div>
                                              </div>
                                           </Card>
                                        ))}
                                     </div>
                                  </div>
                               ))}
                             </div>
                          </div>
                       )}

                       {/* Feature: Analytics Dashboard Tab */}
                       {projectTab === 'analytics' && (
                          <ProjectAnalytics tasks={tasks.filter(t => t.projectId === activeProjectId)} logs={teamLogs.filter(l => l.projectId === activeProjectId)} />
                       )}

                       {/* Feature: History Tab */}
                       {projectTab === 'history' && (
                          <Card className="p-0 overflow-hidden animate-in fade-in">
                             <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><History size={18} className="text-slate-500"/> Project Commit History</h3>
                             </div>
                             <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                                {teamLogs.filter(l => l.projectId === activeProjectId).length > 0 ? (
                                    teamLogs.filter(l => l.projectId === activeProjectId).map(log => (
                                       <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4">
                                          <div className="w-10 h-10 flex-shrink-0"><Avatar name={log.userName}/></div>
                                          <div className="flex-1">
                                             <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-sm text-slate-900 dark:text-white">{log.userName}</span>
                                                <span className="text-xs text-slate-400">{log.date} • {log.timestamp}</span>
                                             </div>
                                             <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{log.commitType || "Update"}</span>
                                                <span className="text-xs text-indigo-600 dark:text-indigo-400">{log.role}</span>
                                             </div>
                                             <p className="text-sm text-slate-600 dark:text-slate-300">{log.message}</p>
                                          </div>
                                       </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400">No activity recorded yet.</div>
                                )}
                             </div>
                          </Card>
                       )}
                    </>
                 )}
              </div>
           )}

           {/* ... (Admin Views - Projects / Users) ... */}
           {activeTab === 'users' && isAdmin && (
             <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
               <Card className="overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center"><h3 className="font-bold text-lg text-slate-800 dark:text-white">Active System Users</h3></div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                     {users.map(u => (
                        <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                           <div className="flex items-center gap-4"><Avatar name={u.name} /><div><div className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</div><div className="text-xs text-slate-500">{u.role}</div>{u.company && <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">{u.company}</div>}</div></div>
                           <div className="flex items-center gap-4">{u.isApproved ? <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold">Active</span> : <span className="bg-orange-100 text-orange-700 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-bold">Pending</span>} {u.role !== 'Admin' && (<div className="flex gap-2"><button onClick={() => updateUserStatus(u.id, !u.isApproved)} className="text-green-500 p-2"><UserCheck size={16}/></button><button onClick={() => setUserToDelete(u.id)} className="text-red-500 p-2"><Trash2 size={16}/></button></div>)}</div>
                        </div>
                     ))}
                  </div>
               </Card>
             </div>
           )}
        </div>
        
        {/* Feature: Mobile Friendly Bottom Nav */}
        <MobileBottomNav 
            activeTab={activeTab} 
            navigateTo={navigateTo} 
            onMenuClick={() => setIsSidebarOpen(true)}
            userRole={currentUser.role}
            hasActiveProject={!!currentUser.projectId || !!activeProjectId}
        />
      </main>
    </div>
  );
}