import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  MapPin, 
  Phone, 
  Settings, 
  FileText, 
  Users, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  MoreHorizontal, 
  Search, 
  Plus, 
  Download, 
  MessageSquare, 
  ArrowRight,
  Info,
  Save,
  Upload,
  Eye,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Filter,
  RefreshCcw,
  Layers,
  ArrowUpRight,
  Calendar,
  Building2,
  History,
  ShieldCheck,
  Sticker,
  UserPlus,
  Mail,
  Briefcase,
  FileBadge,
  Tag
} from 'lucide-react';

// --- Constants ---

const ROLES = {
  PRACTICE_ADMIN: 'Practice Admin',
  INTERNAL_IMPLEMENTATION: 'Implementation Team'
};

const ROLLOUT_STAGES = [
  'Onboarding',
  'Kickoff',
  'Document Verification',
  'Device Ordering',
  'Porting',
  'Pre Go-Live',
  'Go Live'
];

const PROGRESS_STATES = [
  'Not Started',
  'In Progress',
  'Pending Review',
  'Changes Requested',
  'Completed'
];

const PRACTICE_BASE_DATA = {
  name: "BrightSmiles Dental Group",
  address: "500 N Michigan Ave, Suite 600, Chicago, IL 60611",
  totalLocations: 100,
  sharedProgress: 82,
  contractStatus: "Active - Annual Enterprise",
  contractRenewal: "Aug 12, 2025",
  salesNotes: "Aggressive expansion planned for Q4. Focus on high-quality audio branding. Primary competitor was RingCentral.",
  poc: {
    primary: { name: "Dr. Sarah Lee", role: "Owner / Lead Dentist", email: "dr.lee@brightsmiles.com", phone: "(312) 555-0192", pref: "Email" },
    backup: { name: "James Wilson", role: "Operations Manager", email: "j.wilson@brightsmiles.com", phone: "(312) 555-0195", pref: "Phone" }
  },
  stageDistribution: [
    { stage: 'Onboarding', count: 15 },
    { stage: 'Kickoff', count: 12 },
    { stage: 'Doc Verification', count: 8 },
    { stage: 'Device Ordering', count: 10 },
    { stage: 'Porting', count: 5 },
    { stage: 'Pre Go-Live', count: 6 },
    { stage: 'Go Live', count: 44 }
  ]
};

const MOCK_LOCATIONS = [
  { id: 1, name: "Downtown Main Clinic", city: "Chicago", stage: 'Porting', state: 'In Progress', progress: 65 },
  { id: 2, name: "North Hills Pediatric", city: "Evanston", stage: 'Onboarding', state: 'Changes Requested', progress: 15 },
  { id: 3, name: "Westside Family Dental", city: "Oak Park", stage: 'Device Ordering', state: 'Pending Review', progress: 45 },
  { id: 4, name: "Lakeside Specialists", city: "Chicago", stage: 'Go Live', state: 'Completed', progress: 100 },
];

// --- Sub-Components ---

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>{children}</span>;
};

const ContactCard = ({ title, data, onEdit, isBackup = false }) => (
  <div className={`p-5 rounded-3xl border ${isBackup ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl ${isBackup ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
          <Users size={16} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      </div>
      <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Edit</button>
    </div>
    {data ? (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Name & Role</p>
          <p className="text-sm font-bold text-slate-700">{data.name}</p>
          <p className="text-xs text-slate-500">{data.role}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
            <p className="text-xs text-slate-700 truncate">{data.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
            <p className="text-xs text-slate-700">{data.phone}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
           <Badge variant="info">Prefers: {data.pref}</Badge>
        </div>
      </div>
    ) : (
      <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:bg-white transition-all flex items-center justify-center gap-2">
        <Plus size={14} /> Add Backup POC
      </button>
    )}
  </div>
);

const LifecycleTracker = ({ currentStage, currentState }) => {
  const activeIndex = ROLLOUT_STAGES.indexOf(currentStage);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Lifecycle Stage</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{currentStage}</h3>
            <Badge variant={
              currentState === 'Completed' ? 'success' : 
              currentState === 'Changes Requested' ? 'error' : 
              currentState === 'Pending Review' ? 'warning' : 'info'
            }>{currentState}</Badge>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Completion</p>
           <p className="text-xl font-black text-blue-600">{( (activeIndex + 1) / ROLLOUT_STAGES.length * 100).toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="relative flex justify-between">
        <div className="absolute top-[15px] left-0 right-0 h-1 bg-slate-100 -z-10 rounded-full">
          <div className="h-full bg-blue-600 transition-all duration-500 rounded-full" style={{ width: `${(activeIndex / (ROLLOUT_STAGES.length - 1)) * 100}%` }}></div>
        </div>
        {ROLLOUT_STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-col items-center group relative cursor-help">
            <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${
              i < activeIndex ? 'bg-emerald-500' : 
              i === activeIndex ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-200'
            }`}>
              {i < activeIndex ? <CheckCircle2 size={14} className="text-white" /> : <span className={`text-[10px] font-bold ${i === activeIndex ? 'text-white' : 'text-slate-500'}`}>{i + 1}</span>}
            </div>
            <p className={`absolute -bottom-8 whitespace-nowrap text-[9px] font-black uppercase tracking-tighter transition-all ${i === activeIndex ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
              {stage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [role, setRole] = useState(ROLES.PRACTICE_ADMIN);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeLocation, setActiveLocation] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Layout logic
  const renderPracticeDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">{PRACTICE_BASE_DATA.name}</h1>
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <MapPin size={16} className="text-blue-500" />
            <span className="text-sm">{PRACTICE_BASE_DATA.address}</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span className="text-sm font-bold text-slate-700">{PRACTICE_BASE_DATA.totalLocations} Locations</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowInviteModal(true)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <UserPlus size={18} /> Invite Team
          </button>
          <button onClick={() => setShowExportModal(true)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={18} /> Export Workspace
          </button>
        </div>
      </header>

      {/* Stage Summary Rollup */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Rollout Portfolio Summary</h3>
              <p className="text-sm text-slate-400">Distribution of 100 locations by lifecycle stage</p>
           </div>
           <Badge variant="indigo">Live Tracker</Badge>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {PRACTICE_BASE_DATA.stageDistribution.map((item, i) => (
            <div key={item.stage} className="text-center group">
              <div className="relative h-32 bg-slate-50 rounded-2xl flex items-end justify-center overflow-hidden mb-3">
                 <div 
                  className={`w-full transition-all duration-1000 ${i === 6 ? 'bg-emerald-500' : 'bg-blue-600 opacity-80 group-hover:opacity-100'}`} 
                  style={{ height: `${(item.count / 50) * 100}%` }}
                 ></div>
                 <span className="absolute top-2 font-black text-slate-700 text-lg">{item.count}</span>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase leading-tight px-1">{item.stage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Location Board */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
               <h3 className="font-black text-slate-800">Active Execution Board</h3>
               <div className="relative">
                  <input type="text" placeholder="Search site..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-100 w-48" />
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle Stage</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">State</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_LOCATIONS.map(loc => (
                    <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{loc.name}</p>
                        <p className="text-xs text-slate-400">{loc.city}</p>
                      </td>
                      <td className="px-6 py-5 font-bold text-xs text-slate-600 uppercase tracking-tight">
                        {loc.stage}
                      </td>
                      <td className="px-6 py-5">
                         <Badge variant={
                          loc.state === 'Completed' ? 'success' : 
                          loc.state === 'Changes Requested' ? 'error' : 
                          loc.state === 'Pending Review' ? 'warning' : 'info'
                        }>{loc.state}</Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <button 
                          onClick={() => { setActiveLocation(loc); setCurrentPage('location-detail'); }}
                          className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                         >
                           <ArrowUpRight size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales & Contract Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><FileBadge size={20}/></div>
                 <h3 className="font-black text-slate-800">Contract Status</h3>
               </div>
               <div className="space-y-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tier & Status</p>
                    <p className="text-sm font-bold text-slate-700">{PRACTICE_BASE_DATA.contractStatus}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Renewal Date</p>
                    <p className="text-sm font-bold text-slate-700">{PRACTICE_BASE_DATA.contractRenewal}</p>
                 </div>
                 <button className="w-full py-3 bg-slate-50 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-100">View Contract PDF</button>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Tag size={20}/></div>
                 <h3 className="font-black text-slate-800">Sales Snippet</h3>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed italic">
                 "{PRACTICE_BASE_DATA.salesNotes}"
               </p>
               <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Account Exec: Ryan G.</span>
                  <button className="text-[10px] text-blue-600 font-bold hover:underline">Edit Notes</button>
               </div>
            </div>
          </div>
        </div>

        {/* Practice POCs & Side Info */}
        <div className="space-y-6">
          <ContactCard title="Primary Practice POC" data={PRACTICE_BASE_DATA.poc.primary} />
          <ContactCard title="Backup Practice POC" data={PRACTICE_BASE_DATA.poc.backup} isBackup />
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-lg font-black tracking-tight mb-2">Practice Team</h4>
               <p className="text-slate-400 text-xs mb-6 leading-relaxed">Manage other practice managers and contributors who have access to this workspace.</p>
               <div className="space-y-3 mb-8">
                  {[
                    { name: 'Dr. Sarah Lee', initial: 'SL', role: 'Owner' },
                    { name: 'James Wilson', initial: 'JW', role: 'Ops' },
                  ].map(user => (
                    <div key={user.name} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">{user.initial}</div>
                          <div>
                            <p className="text-xs font-bold">{user.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase">{user.role}</p>
                          </div>
                       </div>
                       <button className="p-1.5 text-slate-500 hover:text-white"><MoreHorizontal size={14}/></button>
                    </div>
                  ))}
               </div>
               <button onClick={() => setShowInviteModal(true)} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50">
                 <UserPlus size={16} /> Invite New Manager
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationDetail = () => {
    if (!activeLocation) return null;
    return (
      <div className="space-y-8 animate-in slide-in-from-right-10 duration-500 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPage('dashboard')} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter">{activeLocation.name}</h1>
              <p className="text-sm font-bold text-slate-500 flex items-center gap-2 mt-1">
                <MapPin size={16} className="text-blue-500" /> {activeLocation.city} Branch • Site ID: #VOX-L1102
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCloneModal(true)} className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm text-sm">
              <Copy size={18} /> Clone Setup
            </button>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 flex items-center gap-2 text-sm">
              Submit Review <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
           <LifecycleTracker currentStage={activeLocation.stage} currentState={activeLocation.state} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Location Information</h3>
                    <Badge variant="indigo">Required</Badge>
                 </div>
                 <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Name</label>
                        <input type="text" value={activeLocation.name} readOnly className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-bold outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Address</label>
                        <input type="text" placeholder="123 Dental Lane, Chicago IL 60614" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-6">
                       <ContactCard title="Primary Location POC" data={PRACTICE_BASE_DATA.poc.primary} />
                       <ContactCard title="Backup Location POC" />
                    </div>
                 </div>
              </div>

              {/* Internal Notes at Location Level */}
              {role === ROLES.INTERNAL_IMPLEMENTATION && (
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black flex items-center gap-3 tracking-tight"><ShieldCheck size={28} className="text-blue-500" /> Internal Site Implementation Notes</h3>
                    <Badge variant="indigo">Implementation Only</Badge>
                  </div>
                  <div className="space-y-6 mb-8 text-sm">
                    <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 relative">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-blue-400">System Bot</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Today 10:45 AM</span>
                       </div>
                       <p className="text-slate-300 italic leading-relaxed">"Site verified at 123 Dental Lane. IP whitelisting complete. Ready for porting stage."</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea placeholder="Add a secure internal note for this location..." className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-white placeholder:text-slate-600 outline-none h-32 resize-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
                    <button className="absolute bottom-4 right-4 bg-blue-600 p-3 rounded-2xl hover:bg-blue-700 shadow-xl transition-all"><ArrowRight size={20}/></button>
                  </div>
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                 <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between">
                    Site Timeline 
                    <History size={18} className="text-slate-300" />
                 </h3>
                 <div className="space-y-8 relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-50"></div>
                    {[
                      { t: 'Stage: Onboarding', d: 'Sep 01', s: 'done' },
                      { t: 'Stage: Kickoff', d: 'Sep 03', s: 'done' },
                      { t: 'Stage: Doc Verification', d: 'Sep 05', s: 'done' },
                      { t: 'Stage: Device Ordering', d: 'Sep 08', s: 'done' },
                      { t: 'Stage: Porting', d: 'Current', s: 'active' },
                      { t: 'Stage: Pre Go-Live', d: 'Pending', s: 'todo' },
                      { t: 'Stage: Go Live', d: 'Target: Oct 12', s: 'todo' },
                    ].map(ev => (
                      <div key={ev.t} className="relative pl-10">
                         <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm ${
                           ev.s === 'done' ? 'bg-emerald-500' : 
                           ev.s === 'active' ? 'bg-blue-600 animate-pulse' : 'bg-slate-100'
                         }`}>
                           {ev.s === 'done' && <CheckCircle2 size={14} className="text-white" />}
                         </div>
                         <div>
                           <p className={`text-xs font-black uppercase tracking-widest ${ev.s === 'todo' ? 'text-slate-400' : 'text-slate-800'}`}>{ev.t}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-0.5">{ev.d}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
                 <h4 className="text-lg font-black tracking-tight mb-4">Location Checklist</h4>
                 <div className="space-y-3">
                   {[
                     { l: 'Business Hours Defined', c: true },
                     { l: 'Call Flow Documented', c: true },
                     { l: 'POC Information Complete', c: true },
                     { l: 'Provider Bill Uploaded', c: false },
                     { l: 'E911 Confirmed', c: false },
                   ].map(item => (
                     <div key={item.l} className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl border border-white/5">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${item.c ? 'bg-emerald-500' : 'bg-white/20'}`}>
                          {item.c && <CheckCircle2 size={12} />}
                        </div>
                        <span className="text-xs font-bold">{item.l}</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderInviteModal = () => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
       <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-400">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Invite Team Member</h2>
              <p className="text-slate-400 text-sm mt-1">Grant access to the BrightSmiles Workspace.</p>
            </div>
            <button onClick={() => setShowInviteModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"><Plus size={24} className="rotate-45" /></button>
          </div>

          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <input type="text" placeholder="John Doe" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                   <input type="email" placeholder="john@example.com" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Scope</label>
                <div className="grid grid-cols-2 gap-4">
                   <button className="p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl text-xs font-black text-blue-700 text-left">Full Practice Access</button>
                   <button className="p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl text-xs font-black text-slate-400 text-left">Specific Locations Only</button>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permission Level</label>
                <select className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none bg-slate-50 font-bold appearance-none">
                   <option>Workspace Admin (Edit everything)</option>
                   <option>Contributor (Fill forms only)</option>
                   <option>Viewer (Read-only)</option>
                </select>
             </div>

             <div className="flex gap-4 pt-6">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 uppercase text-xs tracking-widest">Cancel</button>
                <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Mail size={18} /> Send Invitation
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Role Switcher Bar */}
      <div className="bg-slate-900 text-white py-1.5 px-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest sticky top-0 z-[110] border-b border-white/5 shadow-lg">
        <div className="flex gap-6">
          <span className="text-blue-400 flex items-center gap-2"><Layers size={12}/> Rollout Environment v2.7</span>
          <span className="text-slate-400">Internal & Practice Collaborative Shell</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Security: HIPAA Locked</span>
          <div className="flex gap-1 p-0.5 bg-slate-800 rounded-lg">
            {Object.values(ROLES).map(r => (
              <button 
                key={r}
                onClick={() => { setRole(r); setCurrentPage('dashboard'); }}
                className={`px-3 py-1 rounded-md transition-all ${role === r ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-80 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col h-screen sticky top-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-blue-200">VS</div>
            <div>
              <h2 className="text-2xl font-black leading-none tracking-tighter">VoiceStack</h2>
              <p className="text-[11px] text-blue-500 font-black uppercase tracking-widest mt-1">Rollout Workspace</p>
            </div>
          </div>

          <div className="space-y-2 flex-grow">
            <button onClick={() => setCurrentPage('dashboard')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${currentPage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                <LayoutDashboard size={20} /> Practice Rollout
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
                <FileBadge size={20} /> Contract & Billing
            </button>
            <button className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3"><MapPin size={20} /> Site Portfolio</div>
                <Badge variant="indigo">100</Badge>
            </button>
            <div className="pt-8 border-t border-slate-50 space-y-2">
              <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
                <MessageSquare size={20} /> Clarifications
              </button>
              <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
                <History size={20} /> Audit Trail
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-slate-900/10">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs shadow-lg">SL</div>
               <div className="overflow-hidden">
                 <p className="text-xs font-bold truncate">Dr. Sarah Lee</p>
                 <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Practice Admin</p>
               </div>
             </div>
             <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-all">SIGN OUT</button>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-grow p-6 lg:p-12 overflow-y-auto max-h-screen">
           {currentPage === 'dashboard' && renderPracticeDashboard()}
           {currentPage === 'location-detail' && renderLocationDetail()}
        </main>
      </div>

      {showInviteModal && renderInviteModal()}
      
      {showCloneModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-400 text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm"><Copy size={36}/></div>
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Clone Site Configuration</h3>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">Save time by copying the configuration from an existing location to this site.</p>
              
              <div className="space-y-3 mb-10">
                <select className="w-full p-5 border-2 border-slate-100 bg-slate-50 rounded-3xl text-sm font-bold text-slate-700 outline-none appearance-none">
                   <option>Lakeside Specialists (Live)</option>
                   <option>Downtown Main Clinic (95%)</option>
                </select>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowCloneModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 uppercase text-xs tracking-widest">Cancel</button>
                 <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">Apply Setup</button>
              </div>
           </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-400 text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm"><Download size={36}/></div>
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Structured Data Export</h3>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">Generate an implementation-ready export for your selected rollout scope.</p>
              
              <div className="space-y-3 mb-10">
                <button className="w-full p-5 border-2 border-blue-600 bg-blue-50/50 rounded-3xl text-sm font-bold text-blue-800 text-left flex justify-between items-center group transition-all">
                   <div className="flex flex-col">
                      <span>Full Rollout Data</span>
                      <span className="text-[10px] text-blue-500 font-medium">All 100 Sites + Practice Defaults</span>
                   </div>
                   <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white" />
                </button>
                <button className="w-full p-5 border-2 border-slate-100 bg-slate-50 rounded-3xl text-sm font-bold text-slate-400 text-left flex justify-between items-center hover:border-slate-200 transition-all">
                   <div className="flex flex-col">
                      <span>Live Sites Only</span>
                      <span className="text-[10px] text-slate-400 font-medium">44 Locations • Production Ready</span>
                   </div>
                   <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white" />
                </button>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowExportModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 uppercase text-xs tracking-widest">Cancel</button>
                 <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">Download .XLSX</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
