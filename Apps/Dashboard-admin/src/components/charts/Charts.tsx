import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#fff", border:"1px solid rgba(59,126,248,.15)",
      borderRadius:10, padding:"10px 14px",
      boxShadow:"0 8px 24px rgba(0,0,0,.12)", fontSize:12,
    }}>
      {label && <p style={{ fontWeight:600, marginBottom:6, color:"#1e293b" }}>{label}</p>}
      {payload.map((p:any) => (
        <p key={p.name} style={{ color:p.color, margin:"2px 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ═══ AREA CHART — évolution alertes ═══ */
export const AlertesAreaChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={data} margin={{ top:10, right:10, left:-20, bottom:0 }}>
      <defs>
        <linearGradient id="gTotal"   x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#3b7ef8" stopOpacity={0.25}/>
          <stop offset="95%" stopColor="#3b7ef8" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="gTraites" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
      <XAxis dataKey="jour" tick={{ fontSize:11, fill:"#94a3b8" }}
        tickFormatter={v => new Date(v).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})}/>
      <YAxis tick={{ fontSize:11, fill:"#94a3b8" }}/>
      <Tooltip content={<CustomTooltip/>}/>
      <Legend iconSize={8} wrapperStyle={{ fontSize:12 }}/>
      <Area type="monotone" dataKey="total"   name="Total"   stroke="#3b7ef8" strokeWidth={2} fill="url(#gTotal)"   dot={false}/>
      <Area type="monotone" dataKey="traites" name="Traités" stroke="#10b981" strokeWidth={2} fill="url(#gTraites)" dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

/* ═══ BAR CHART — alertes par zone ═══ */
export const ZoneBarChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} margin={{ top:5, right:10, left:-20, bottom:0 }} barSize={18}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
      <XAxis dataKey="zone" tick={{ fontSize:11, fill:"#94a3b8" }}/>
      <YAxis tick={{ fontSize:11, fill:"#94a3b8" }}/>
      <Tooltip content={<CustomTooltip/>}/>
      <Bar dataKey="count"   name="Total"   radius={[4,4,0,0]} fill="#3b7ef8"/>
      <Bar dataKey="traites" name="Traités" radius={[4,4,0,0]} fill="#10b981"/>
    </BarChart>
  </ResponsiveContainer>
);

/* ═══ DONUT — par priorité ═══ */
const PRIO_COLORS = { elevee:"#ef4444", moyenne:"#f59e0b", faible:"#10b981" };

export const PrioriteDonut: React.FC<{ data: any[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div style={{ position:"relative", height:200 }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={58} outerRadius={82}
            dataKey="count" nameKey="priorite" paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={(PRIO_COLORS as any)[d.priorite] || "#94a3b8"}/>
            ))}
          </Pie>
          <Tooltip formatter={(v:any, n:any) => [`${v} alertes`, n]}/>
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        textAlign:"center", pointerEvents:"none",
      }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:26, color:"#1e293b" }}>{total}</div>
        <div style={{ fontSize:11, color:"#94a3b8" }}>alertes</div>
      </div>
    </div>
  );
};

/* ═══ PERFORMANCE LINE ═══ */
export const PerformanceLine: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={160}>
    <LineChart data={data} margin={{ top:5, right:10, left:-25, bottom:0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
      <XAxis dataKey="date" tick={{ fontSize:10, fill:"#94a3b8" }}
        tickFormatter={v => new Date(v).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})}/>
      <YAxis tick={{ fontSize:10, fill:"#94a3b8" }}/>
      <Tooltip content={<CustomTooltip/>}/>
      <Line type="monotone" dataKey="totalCollectes" name="Collectes" stroke="#3b7ef8" strokeWidth={2} dot={false}/>
      <Line type="monotone" dataKey="totalAlertes"   name="Alertes"  stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2"/>
    </LineChart>
  </ResponsiveContainer>
);
