import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Download, Calendar, MapPin, Phone, 
  ChevronRight, CheckCircle, Target, Radio, 
  Globe, ChevronDown, X, Layers, Search,
  TrendingUp, ListFilter, Info, UserPlus, UserCheck, Zap, Filter
} from 'lucide-react';

// --- DATASET: MASTER PERFORMANCE REPOSITORY ---
const MASTER_DATA = [
  { id: '1', location: 'Dallas', source: 'Google Organic', channelType: 'Static', campaign: 'SEO_Primary', keyword: 'dentist', tracker: 'Organic', total: 236, answered: 210, missed: 26, npTotal: 130, npOpp: 236, npBooked: 84, npNotBooked: 152, epTotal: 106, epOpp: 70, epBooked: 30, epNotBooked: 40 },
  { id: '2', location: 'Dallas', source: 'Google ads', channelType: 'Dynamic', campaign: 'DSA_Generic_Ads', keyword: 'Dentist near me', tracker: 'Morrocco', total: 82, answered: 78, missed: 4, npTotal: 40, npOpp: 82, npBooked: 37, npNotBooked: 45, epTotal: 42, epOpp: 85, epBooked: 58, epNotBooked: 27 },
  { id: '2b', location: 'Dallas', source: 'Google ads', channelType: 'Dynamic', campaign: 'Implants_Focus', keyword: 'cheap dental implants', tracker: 'DNI_Pool_01', total: 45, answered: 40, missed: 5, npTotal: 25, npOpp: 45, npBooked: 15, npNotBooked: 30, epTotal: 20, epOpp: 30, epBooked: 12, epNotBooked: 8 },
  { id: '3', location: 'Dallas', source: 'Facebook', channelType: 'Dynamic', campaign: 'Emergency_Dental', keyword: 'teeth ache', tracker: 'England', total: 72, answered: 65, missed: 7, npTotal: 32, npOpp: 72, npBooked: 42, npNotBooked: 30, epTotal: 40, epOpp: 70, epBooked: 47, epNotBooked: 23 },
  { id: '4', location: 'Dallas', source: 'Bing', channelType: 'Dynamic', campaign: 'Search_Brand', keyword: 'clinic', tracker: 'London', total: 107, answered: 100, missed: 7, npTotal: 100, npOpp: 107, npBooked: 59, npNotBooked: 48, epTotal: 7, epOpp: 24, epBooked: 17, epNotBooked: 7 },
  { id: '5', location: 'East Town', source: 'Google ads', channelType: 'Dynamic', campaign: 'DSA_Generic_Ads', keyword: 'Dentist near me', tracker: 'Morrocco', total: 82, answered: 75, missed: 7, npTotal: 40, npOpp: 82, npBooked: 37, npNotBooked: 45, epTotal: 42, epOpp: 85, epBooked: 58, epNotBooked: 27 },
  { id: '6', location: 'East Town', source: 'Facebook', channelType: 'Dynamic', campaign: 'Emergency_Dental', keyword: 'implant', tracker: 'England', total: 72, answered: 70, missed: 2, npTotal: 32, npOpp: 72, npBooked: 42, npNotBooked: 30, epTotal: 40, epOpp: 70, epBooked: 47, epNotBooked: 23 },
  { id: '6b', location: 'East Town', source: 'Facebook', channelType: 'Dynamic', campaign: 'Retargeting_Lapsed', keyword: 'n/a', tracker: 'DNI_Pool_02', total: 30, answered: 28, missed: 2, npTotal: 10, npOpp: 30, npBooked: 8, npNotBooked: 22, epTotal: 20, epOpp: 25, epBooked: 15, epNotBooked: 5 },
  { id: '7', location: 'East Town', source: 'Bing', channelType: 'Static', campaign: '', keyword: 'braces', tracker: 'Main_Line', total: 107, answered: 105, missed: 2, npTotal: 100, npOpp: 107, npBooked: 59, npNotBooked: 48, epTotal: 7, epOpp: 24, epBooked: 17, epNotBooked: 7 },
];

const COLORS = {
  new: '#6366F1',
  ex: '#D1D5DB'
};

// --- HELPER: Percentage Formatting ---
const formatValue = (val, total, isOpp = false, rowTotalOpp = 0) => {
  if (!total || total === 0) return `${val}(0%)`;
  if (isOpp) {
    const pct = rowTotalOpp > 0 ? ((val / rowTotalOpp) * 100).toFixed(2) : '0';
    return `${val}(${pct}%)`;
  }
  const pct = ((val / total) * 100).toFixed(2).replace(/\.00$/, '');
  return `${val}(${pct}%)`;
};

// --- MULTI-SELECT FILTER COMPONENT ---
const MultiSelectFilter = ({ label, options, selected, onToggle, onClear, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filtered = options.filter(o => (o || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`flex flex-col gap-1 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} ref={ref}>
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">{label}</span>
      <div className="relative">
        <div 
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="flex items-center gap-2 min-h-[40px] min-w-[200px] bg-white border border-slate-200 p-2 rounded-xl text-[11px] font-black shadow-sm cursor-pointer hover:border-indigo-400 transition-all"
        >
          {selected.length === 0 ? (
            <span className="text-slate-400 px-2 italic font-medium">All...</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selected.map(s => (
                <div key={s} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-indigo-200 group">
                  {s || 'None'}
                  <X size={10} className="cursor-pointer hover:text-rose-500" onClick={(e) => { e.stopPropagation(); onToggle(s); }} />
                </div>
              ))}
            </div>
          )}
          <ChevronDown size={14} className={`ml-auto text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[200] p-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mb-2">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs tracking-widest"><Search size={12} /></div>
              <input autoFocus type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs font-bold outline-none" />
            </div>
            <div className="max-h-56 overflow-y-auto custom-scrollbar">
              <button onClick={() => { onClear(); setIsOpen(false); }} className="w-full text-left px-3 py-1.5 text-[10px] font-black text-rose-500 hover:bg-rose-50 rounded-lg uppercase mb-1">Reset</button>
              {filtered.map(opt => (
                <button key={opt} onClick={() => onToggle(opt)} className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-black rounded-xl transition-colors ${selected.includes(opt) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {opt || '(empty)'}
                  {selected.includes(opt) && <CheckCircle size={14} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- REUSABLE DROPDOWN ---
const GlobalDropdown = ({ label, icon: Icon, value, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="flex flex-col gap-0.5 relative" ref={ref}>
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{String(label)}</span>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-black cursor-pointer hover:text-indigo-400 transition-colors whitespace-nowrap"
      >
        {React.createElement(Icon, { size: 12, className: "text-indigo-500 shrink-0" })}
        {String(value)} 
        {React.createElement(ChevronDown, { size: 12, className: `transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}` })}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-[#2d3748] border border-white/10 rounded-xl shadow-2xl z-[200] p-1 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.map(opt => (
              <button key={opt} onClick={() => { onSelect(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-colors ${value === opt ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}>{String(opt)}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  // --- STATE ---
  const [viewMode, setViewMode] = useState('Source'); // Source, Campaign, Keyword
  const [location, setLocation] = useState('All Locations');
  const [dateRange, setDateRange] = useState('Last 7 days');

  // --- TABLE FILTERS ---
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All'); 

  const uniqueSources = useMemo(() => [...new Set(MASTER_DATA.map(i => i.source))], []);
  const uniqueCampaigns = useMemo(() => [...new Set(MASTER_DATA.filter(i => i.channelType === 'Dynamic').map(i => i.campaign))].filter(Boolean), []);

  // --- DYNAMIC AGGREGATION & FILTERING ENGINE ---
  const aggregatedRows = useMemo(() => {
    const groups = {};
    let pool = MASTER_DATA;

    // Apply Global and Table Filters
    if (location !== 'All Locations') pool = pool.filter(i => i.location === location);
    if (typeFilter !== 'All') pool = pool.filter(i => i.channelType === typeFilter);
    if (selectedSources.length > 0) pool = pool.filter(i => selectedSources.includes(i.source));
    if (selectedCampaigns.length > 0 && typeFilter !== 'Static') {
      pool = pool.filter(i => selectedCampaigns.includes(i.campaign));
    }

    pool.forEach(item => {
      // Define row identifier based on ViewMode
      let identifier = `${item.location}-`;
      if (viewMode === 'Source') identifier += `${item.source}`;
      else if (viewMode === 'Campaign') identifier += `${item.campaign || 'None'}`;
      else if (viewMode === 'Keyword') identifier += `${item.keyword || 'None'}`;
      
      if (!groups[identifier]) {
        groups[identifier] = { 
          ...item,
          total: 0, answered: 0, missed: 0,
          npTotal: 0, npOpp: 0, npBooked: 0, npNotBooked: 0,
          epTotal: 0, epOpp: 0, epBooked: 0, epNotBooked: 0
        };
      }
      
      groups[identifier].total += item.total;
      groups[identifier].answered += item.answered;
      groups[identifier].missed += item.missed;
      groups[identifier].npTotal += item.npTotal;
      groups[identifier].npOpp += item.npOpp;
      groups[identifier].npBooked += item.npBooked;
      groups[identifier].npNotBooked += item.npNotBooked;
      groups[identifier].epTotal += item.epTotal;
      groups[identifier].epOpp += item.epOpp;
      groups[identifier].epBooked += item.epBooked;
      groups[identifier].epNotBooked += item.epNotBooked;
    });

    return Object.values(groups).sort((a, b) => 
        a.location.localeCompare(b.location) || 
        b.total - a.total
    );
  }, [viewMode, location, selectedSources, selectedCampaigns, typeFilter]);

  const tableSpans = useMemo(() => {
    const locSpans = {};
    const processedLocs = new Set();

    aggregatedRows.forEach((row, index) => {
      if (!processedLocs.has(row.location)) {
        let count = 0;
        for (let i = index; i < aggregatedRows.length; i++) {
          if (aggregatedRows[i].location === row.location) count++; else break;
        }
        locSpans[index] = count;
        processedLocs.add(row.location);
      }
    });

    return { locSpans };
  }, [aggregatedRows]);

  const toggleSource = (val) => setSelectedSources(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  const toggleCampaign = (val) => setSelectedCampaigns(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-10 flex flex-col">
      <header className="bg-[#1e293b] text-white py-4 sticky top-0 z-[100] shadow-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Global Perspective</span>
              <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
                {[
                    { id: 'Source', icon: Globe }, 
                    { id: 'Campaign', icon: Layers }, 
                    { id: 'Keyword', icon: Search }
                ].map(v => (
                  <button key={v.id} onClick={() => setViewMode(v.id)} className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${viewMode === v.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                    {React.createElement(v.icon, { size: 12 })} {v.id}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-8 border-l border-white/10 pl-8">
               <GlobalDropdown label="Location Area" icon={MapPin} value={location} options={['All Locations', 'Dallas', 'East Town']} onSelect={setLocation} />
               <GlobalDropdown label="Timeframe" icon={Calendar} value={dateRange} options={['Last 7 days', 'Last 30 days']} onSelect={setDateRange} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-8 flex-1">
        {/* CHARTS */}
        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <StackedBarChart title={`Total Calls Distribution`} metricLabel="Calls" data={aggregatedRows.map(r => ({ name: r[viewMode.toLowerCase()] || (viewMode === 'Source' ? r.source : 'Static'), np: r.npTotal, ep: r.epTotal, total: r.total }))} />
          <StackedBarChart title={`Qualified Opportunities`} metricLabel="Opps" data={aggregatedRows.map(r => ({ name: r[viewMode.toLowerCase()] || (viewMode === 'Source' ? r.source : 'Static'), np: r.npOpp, ep: r.epOpp, total: r.npOpp + r.epOpp }))} />
          <StackedBarChart title={`Confirmed Bookings`} metricLabel="Booked" data={aggregatedRows.map(r => ({ name: r[viewMode.toLowerCase()] || (viewMode === 'Source' ? r.source : 'Static'), np: r.npBooked, ep: r.epBooked, total: r.npBooked + r.epBooked }))} />
        </section>

        {/* MASTER INTELLIGENCE LEDGER */}
        <section className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-wrap items-end gap-6 bg-slate-50/40">
             <div className="flex flex-col gap-1 mr-4">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Concept Filter</span>
                <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm h-[40px]">
                   {['All', 'Static', 'Dynamic'].map(t => (
                     <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${typeFilter === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                   ))}
                </div>
             </div>

             <MultiSelectFilter label="Filter Source" options={uniqueSources} selected={selectedSources} onToggle={toggleSource} onClear={() => setSelectedSources([])} />
             
             <MultiSelectFilter 
                label="Filter Campaign" 
                options={uniqueCampaigns} 
                selected={selectedCampaigns} 
                onToggle={toggleCampaign} 
                onClear={() => setSelectedCampaigns([])} 
                disabled={typeFilter === 'Static'}
             />

             <div className="ml-auto flex items-center gap-3 mb-0.5">
                <button onClick={() => { setSelectedSources([]); setSelectedCampaigns([]); setTypeFilter('All'); }} className="flex items-center gap-2 text-[10px] font-black text-rose-500 hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 transition-colors">
                    <X size={14} /> Reset
                </button>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-500 transition-all shadow-lg uppercase tracking-tight">
                    <Download size={14} /> Export Table
                </button>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                  <th rowSpan="2" className="px-4 py-4 border-r border-slate-200 min-w-[100px]">Location</th>
                  
                  {viewMode === 'Source' && <th rowSpan="2" className="px-4 py-4 border-r border-slate-200 min-w-[140px]">Source</th>}
                  {viewMode === 'Campaign' && <th rowSpan="2" className="px-4 py-4 border-r border-slate-200 min-w-[160px]">Campaign</th>}
                  {viewMode === 'Keyword' && <th rowSpan="2" className="px-4 py-4 border-r border-slate-200 min-w-[160px]">Keyword</th>}
                  
                  <th rowSpan="2" className="px-4 py-4 border-r border-slate-200 text-center bg-indigo-50/20">Total<br/>Calls</th>
                  <th rowSpan="2" className="px-3 py-4 border-r border-slate-200 text-center">Answered</th>
                  <th rowSpan="2" className="px-3 py-4 border-r border-slate-200 text-center">Missed</th>
                  <th colSpan="4" className="px-4 py-3 text-center border-b border-r border-slate-200 bg-indigo-50/40 text-indigo-700 font-black tracking-wider">New Patient Performance</th>
                  <th colSpan="4" className="px-4 py-3 text-center border-b border-r border-slate-200 bg-emerald-50/40 text-emerald-700 font-black tracking-wider">Existing Patient Performance</th>
                </tr>
                <tr className="bg-slate-50/50 text-[9px] font-bold text-slate-400 border-b border-slate-100">
                  <th className="px-3 py-3 text-center">Total</th><th className="px-3 py-3 text-center">Opportunity</th><th className="px-3 py-3 text-center">Booked</th><th className="px-3 py-3 text-center border-r border-slate-200">Not Booked</th>
                  <th className="px-3 py-3 text-center">Total</th><th className="px-3 py-3 text-center">Opportunity</th><th className="px-3 py-3 text-center">Booked</th><th className="px-3 py-3 text-center">Not Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {aggregatedRows.length > 0 ? aggregatedRows.map((row, idx) => {
                  const locSpan = tableSpans.locSpans[idx];
                  const totalOpps = row.npOpp + row.epOpp;
                  
                  return (
                    <tr key={idx} className="hover:bg-indigo-50/5 transition-all group">
                      {locSpan && (
                        <td rowSpan={locSpan} className="px-4 py-5 font-black text-slate-900 border-r border-slate-100 bg-slate-50/10 align-top">
                          {row.location}
                        </td>
                      )}
                      
                      {viewMode === 'Source' && (
                        <td className="px-4 py-5 font-black text-slate-900 border-r border-slate-50">
                          {row.source}
                        </td>
                      )}

                      {viewMode === 'Campaign' && (
                        <td className="px-4 py-5 font-black text-indigo-600 border-r border-slate-50">
                          {row.campaign || 'N/A'}
                        </td>
                      )}

                      {viewMode === 'Keyword' && (
                        <td className="px-4 py-5 font-medium text-slate-500 border-r border-slate-50">
                           {row.keyword || '-'}
                        </td>
                      )}

                      <td className="px-4 py-5 text-center font-black text-slate-900 border-r border-slate-100 bg-indigo-50/10">{row.total}</td>
                      <td className="px-3 py-5 text-center text-slate-500 border-r border-slate-50">{row.answered}</td>
                      <td className="px-3 py-5 text-center text-rose-300 border-r border-slate-100">{row.missed}</td>
                      
                      {/* New Patient Segment */}
                      <td className="px-3 py-5 text-center text-slate-600 font-bold bg-indigo-50/5">{formatValue(row.npTotal, row.total)}</td>
                      <td className="px-3 py-5 text-center text-slate-600 font-bold bg-indigo-50/5">{formatValue(row.npOpp, row.total, true, totalOpps)}</td>
                      <td className="px-3 py-5 text-center text-indigo-600 font-black bg-indigo-50/15">{formatValue(row.npBooked, row.total)}</td>
                      <td className="px-3 py-5 text-center text-rose-400 font-bold border-r border-slate-100 bg-indigo-50/5">{formatValue(row.npNotBooked, row.total)}</td>

                      {/* Existing Patient Segment */}
                      <td className="px-3 py-5 text-center text-slate-600 font-bold bg-emerald-50/5">{row.epTotal}</td>
                      <td className="px-3 py-5 text-center text-slate-600 font-bold bg-emerald-50/5">{formatValue(row.epOpp, row.total, true, totalOpps)}</td>
                      <td className="px-3 py-5 text-center text-emerald-600 font-black bg-emerald-50/15">{formatValue(row.epBooked, row.total)}</td>
                      <td className="px-3 py-5 text-center text-rose-400 font-bold bg-emerald-50/5">{formatValue(row.epNotBooked, row.total)}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="14" className="px-8 py-32 text-center text-slate-300 uppercase font-black tracking-widest opacity-40">No data matching filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- STACKED HORIZONTAL BAR CHART COMPONENT ---
const StackedBarChart = ({ title, metricLabel, data }) => {
  const sortedData = useMemo(() => [...data].sort((a, b) => b.total - a.total).slice(0, 10), [data]);
  const [hoveredKey, setHoveredKey] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && hoveredKey) {
      const dataPoint = payload.find(p => p.dataKey === hoveredKey);
      const total = payload[0].payload.total;
      const labelPrefix = hoveredKey === 'np' ? 'New Patient' : 'Existing Patient';
      return (
        <div className="bg-[#2b579a] text-white p-3 rounded shadow-2xl text-[12px] font-bold animate-in fade-in duration-150">
          <p className="whitespace-nowrap">{labelPrefix} {metricLabel}: {dataPoint.value}</p>
          <p className="whitespace-nowrap border-t border-white/20 mt-1.5 pt-1.5 opacity-80 font-medium">Total Volume: {total}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[320px] min-w-0">
      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">{String(title)}</h4>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={sortedData} margin={{ top: 5, right: 40, left: 80, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="np" stackId="a" fill={COLORS.new} barSize={16} onMouseEnter={() => setHoveredKey('np')} onMouseLeave={() => setHoveredKey(null)} />
            <Bar dataKey="ep" stackId="a" fill={'#D1D5DB'} radius={[0, 4, 4, 0]} barSize={16} onMouseEnter={() => setHoveredKey('ep')} onMouseLeave={() => setHoveredKey(null)} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-end gap-4 text-[8px] font-black uppercase tracking-widest text-slate-400">
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: COLORS.new }}></div> New Patient</div>
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Existing Patient</div>
      </div>
    </div>
  );
};

export default App;
