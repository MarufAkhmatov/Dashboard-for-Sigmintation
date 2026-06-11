import { useState } from "react";
import { motion } from "motion/react";
import {
  Calendar, Users, LayoutGrid, FileText,
  Search, Settings, Bell, ChevronDown, MessageCircle, Sparkles,
} from "lucide-react";
import { WellnessChart } from "./components/WellnessChart";
import { StressRecoveryChart } from "./components/StressRecoveryChart";
import { HRVChart } from "./components/HRVChart";
import { GlucoseGauge } from "./components/GlucoseGauge";
import { PatientFlowChart } from "./components/PatientFlowChart";
import { HealthcareProviders } from "./components/HealthcareProviders";
import { AriaPanel } from "./components/AriaPanel";

/* ---------- glass tokens (nav) ---------- */
const glassPanel: React.CSSProperties = {
  background: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  border: "1px solid rgba(255,255,255,0.5)",
  boxShadow: "0 8px 26px rgba(20,40,55,0.10), inset 0 1px 1px rgba(255,255,255,0.6)",
};
const glassCircle: React.CSSProperties = {
  background: "rgba(255,255,255,0.3)",
  border: "1px solid rgba(255,255,255,0.45)",
  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.45), 0 3px 8px rgba(20,40,55,0.08)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

/* ---------- white card ---------- */
const card: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  overflow: "hidden",
};
const innerDivider = "1px solid #eef1f4";

const navIcons = [
  { icon: Calendar, label: "Calendar" },
  { icon: Users, label: "Patients" },
  { icon: LayoutGrid, label: "Records" },
  { icon: FileText, label: "Documents" },
];

/* ---------- header metric sparkline (thin white bars, glow) ---------- */
function MetricBars() {
  const bars = [6, 10, 7, 13, 9, 15, 8, 14, 10, 16, 9, 12, 7, 11, 8];
  const max = Math.max(...bars);
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-end", gap: 3, height: 46,
        filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
      }}
    >
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(b / max) * 100}%` }}
          transition={{ duration: 0.5, delay: i * 0.02, ease: "easeOut" }}
          style={{ width: 2, borderRadius: 2, background: "rgba(255,255,255,0.55)" }}
        />
      ))}
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{ display: "flex", alignItems: "center", gap: 18 }}
    >
      <MetricBars />
      <div>
        <div style={{ fontSize: 50, fontWeight: 400, color: "#ffffff", lineHeight: 1, letterSpacing: "-1.5px" }}>
          {value}
        </div>
        <div style={{ fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.75)", marginTop: 7 }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeNav] = useState("Dashboard");

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #7A9AA8 0%, #B7CFD7 50%, #DCECEF 100%)",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ===================== TOP NAV ===================== */}
      <header
        style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "20px 32px 8px",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", ...glassCircle }}>
            <Sparkles size={18} color="#0c5563" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#ffffff" }}>CareNest</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* centered neo-glass nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: 6, borderRadius: 999, ...glassPanel }}>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 16px 8px 8px", borderRadius: 999,
              background: "#ffffff", border: "none", cursor: "pointer",
              boxShadow: "0 3px 12px rgba(20,40,55,0.12)",
              fontSize: "0.83rem", fontWeight: 500, color: "#1a2030",
            }}
          >
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#e9f2f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageCircle size={14} color="#0c5563" />
            </span>
            Dashboard
            <ChevronDown size={14} color="#9aa5b4" />
          </button>
          {navIcons.map(({ icon: Icon, label }) => (
            <button key={label} title={label} style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3f5560", ...glassCircle }}>
              <Icon size={17} />
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, borderRadius: 999, padding: "9px 18px", width: 210, ...glassPanel }}>
            <Search size={15} color="#52707c" />
            <input
              placeholder="Search..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.82rem", color: "#1a2030", fontFamily: "var(--font-sans)", width: "100%" }}
            />
          </div>
          <button style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3f5560", ...glassCircle }}>
            <Settings size={17} />
          </button>
          <button style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", color: "#3f5560", ...glassCircle }}>
            <Bell size={17} />
            <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: "50%", background: "#e53e3e", border: "1.5px solid #cfe0e2" }} />
          </button>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format"
            alt="User"
            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.7)", cursor: "pointer" }}
          />
        </div>
      </header>

      {/* ===================== CONTENT ===================== */}
      <main style={{ flex: 1, padding: "4px 32px 32px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Title */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 50, fontWeight: 400, color: "#ffffff", letterSpacing: "-1.5px", margin: 0, lineHeight: 1.05 }}
          >
            Dashboard Overview
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ fontSize: 19, fontWeight: 300, color: "rgba(255,255,255,0.85)", margin: "8px 0 0 0" }}
          >
            Welcome back! Here's what's happening with your clients today
          </motion.p>
        </div>

        {/* Metrics — grouped analytics cluster (not full width) */}
        <div style={{ display: "flex", alignItems: "center", gap: 120, padding: "2px 4px" }}>
          <Metric value="1,360" label="Total Appointments" />
          <Metric value="2,654" label="Active Patients" />
          <Metric value="54" label="Critical Alerts" />
        </div>

        {/* Top row — 3 tightly packed white cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr 0.95fr", gap: 10, alignItems: "stretch", flex: "1.7 1 0", minHeight: 0 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ ...card }}>
            <WellnessChart />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={{ ...card, display: "flex", flexDirection: "column" }}>
            <div style={{ borderBottom: innerDivider }}>
              <StressRecoveryChart />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1 }}>
              <div style={{ borderRight: innerDivider }}>
                <HRVChart />
              </div>
              <GlucoseGauge />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} style={{ ...card }}>
            <PatientFlowChart />
          </motion.div>
        </div>

        {/* Bottom row — aligned baseline */}
        <div style={{ display: "grid", gridTemplateColumns: "1.75fr 1fr", gap: 10, alignItems: "stretch", flex: "1 1 0", minHeight: 0 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} style={{ ...card }}>
            <HealthcareProviders />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
            <AriaPanel />
          </motion.div>
        </div>

      </main>
    </div>
  );
}
