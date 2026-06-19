"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const enrollmentData = [
  { month: "Jan", learners: 120, completions: 18, certificates: 14 },
  { month: "Feb", learners: 198, completions: 32, certificates: 28 },
  { month: "Mar", learners: 310, completions: 55, certificates: 49 },
  { month: "Apr", learners: 480, completions: 78, certificates: 71 },
  { month: "May", learners: 820, completions: 112, certificates: 98 },
  { month: "Jun", learners: 1284, completions: 156, certificates: 135 },
];

const courseData = [
  { name: "Career Readiness", enrolled: 420, completed: 68 },
  { name: "Digital Workplace", enrolled: 280, completed: 44 },
  { name: "Solar Installation", enrolled: 190, completed: 22 },
  { name: "Business Launchpad", enrolled: 160, completed: 18 },
  { name: "Chef Foundations", enrolled: 145, completed: 20 },
  { name: "School Bridge", enrolled: 89, completed: 12 },
];

const academyDistribution = [
  { name: "Upskilling Academy", value: 480, color: "#1166c8" },
  { name: "Skills Training", value: 290, color: "#20c7ff" },
  { name: "Business School", value: 210, color: "#f5c542" },
  { name: "Chef Academy", value: 145, color: "#ff7a59" },
  { name: "Private School", value: 99, color: "#19c37d" },
  { name: "University Online", value: 60, color: "#9b59b6" },
];

const revenueData = [
  { month: "Jan", revenue: 8400 },
  { month: "Feb", revenue: 14200 },
  { month: "Mar", revenue: 22800 },
  { month: "Apr", revenue: 31500 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 84000 },
];

const kpis = [
  { label: "Total learners", value: "1,284", change: "+156%", positive: true },
  { label: "Course completions", value: "312", change: "+88%", positive: true },
  { label: "Certificates issued", value: "271", change: "+91%", positive: true },
  { label: "Avg. assessment score", value: "76%", change: "+4%", positive: true },
  { label: "VR practice sessions", value: "487", change: "+214%", positive: true },
  { label: "Revenue (ZAR)", value: "R84,000", change: "+900%", positive: true },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="premium-card rounded-xl p-4">
            <p className="text-xs text-muted">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{kpi.value}</p>
            <p className={`mt-1 text-xs font-semibold ${kpi.positive ? "text-emerald-600" : "text-red-600"}`}>
              {kpi.change} this year
            </p>
          </div>
        ))}
      </div>

      {/* Enrollment growth + Revenue */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="premium-card rounded-2xl p-6">
          <h2 className="text-base font-semibold text-ink mb-1">Learner growth</h2>
          <p className="text-xs text-muted mb-5">Cumulative enrollments, completions, and certificates issued</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollmentData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradLearners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1166c8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1166c8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5c542" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f5c542" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5f7288" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5f7288" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="learners" stroke="#1166c8" strokeWidth={2} fill="url(#gradLearners)" name="Learners" />
              <Area type="monotone" dataKey="certificates" stroke="#f5c542" strokeWidth={2} fill="url(#gradCerts)" name="Certificates" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-card rounded-2xl p-6">
          <h2 className="text-base font-semibold text-ink mb-1">Revenue (ZAR)</h2>
          <p className="text-xs text-muted mb-5">Monthly PayFast-ready revenue placeholder</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#19c37d" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#19c37d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5f7288" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5f7288" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => [`R${Number(v ?? 0).toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#19c37d" strokeWidth={2} fill="url(#gradRev)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course performance + Academy distribution */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="premium-card rounded-2xl p-6">
          <h2 className="text-base font-semibold text-ink mb-1">Course performance</h2>
          <p className="text-xs text-muted mb-5">Enrollments vs completions per course</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={courseData} margin={{ top: 5, right: 0, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#5f7288" }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: "#5f7288" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 40 }} />
              <Bar dataKey="enrolled" name="Enrolled" fill="#1166c8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#f5c542" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-card rounded-2xl p-6">
          <h2 className="text-base font-semibold text-ink mb-1">Academy breakdown</h2>
          <p className="text-xs text-muted mb-4">Learner distribution by academy</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={academyDistribution} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                {academyDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {academyDistribution.map((a) => (
              <div key={a.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <p className="text-xs text-muted flex-1 truncate">{a.name}</p>
                <p className="text-xs font-semibold text-ink">{a.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
