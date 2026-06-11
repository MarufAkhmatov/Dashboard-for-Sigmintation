import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Calendar, Users, BarChart2, Database,
  Search, Settings, Bell, TrendingUp, ArrowUpRight,
} from "lucide-react";
import { WellnessChart } from "./components/WellnessChart";
import { StressRecoveryChart } from "./components/StressRecoveryChart";
import { HRVChart } from "./components/HRVChart";
import { GlucoseGauge } from "./components/GlucoseGauge";
import { PatientFlowChart } from "./components/PatientFlowChart";
import { SuggestedSteps } from "./components/SuggestedSteps";
import { HealthcareProviders } from "./components/HealthcareProviders";
import { AriaPanel } from "./components/AriaPanel";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Calendar, label: "Calendar" },
  { icon: Users, label: "Patients" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Database, label: "Records" },
];

function Sparkline({ up = true }: { up?: boolean }) {
  const h = up
    ? [6, 4, 7, 5, 8, 6, 9, 7, 10]
    : [10, 9, 8, 7, 9, 6, 8, 5, 7];
  const max = Math.max(...h);
  const pts = h.map((v, i) => `${(i / (h.length - 1)) * 40},${12 - (v / max) * 10}`).join(" ");
  return (
    <svg width="40" height="14" viewBox="0 0 40 14">
      <polyline
        points={pts}
        fill="none"
        stroke={up ? "#2d7a5f" : "#e53e3e"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ value, label, delta, up }: { value: string; label: string; delta?: string; up?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.7)",
        borderRadius: 14, padding: "8px 14px",
        border: "1px solid rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        minWidth: 160,
      }}
    >
      <div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a2030" }}>{value}</span>
          {delta && (
            <span style={{
              display: "flex", alignItems: "center", gap: 1,
              fontSize: "0.65rem", fontWeight: 600,
              color: up ? "#2d7a5f" : "#e53e3e",
              background: up ? "#e8f4ef" : "#fce8e8",
              borderRadius: 6, padding: "1px 5px",
            }}>
              <ArrowUpRight size={9} style={{ transform: up ? "none" : "rotate(90deg)" }} />
              {delta}
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.65rem", color: "#9aa5b4" }}>{label}</div>
      </div>
      <Sparkline up={up} />
    </motion.div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #d0d8e4 0%, #c8d4e0 40%, #bfcdd8 100%)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP NAV */}
      <header
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 24px",
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.5)",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2" style={{ marginRight: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #2d7a5f, #9b59b6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>CN</span>
          </div>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a2030" }}>CareNest</span>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 14px",
                borderRadius: 10,
                border: "none",
                background: activeNav === label ? "rgba(255,255,255,0.85)" : "transparent",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: activeNav === label ? 600 : 400,
                color: activeNav === label ? "#1a2030" : "#6b7a8d",
                transition: "all 0.2s",
                boxShadow: activeNav === label ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Icon size={14} />
              {label}
              {activeNav === label && (
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2d7a5f", marginLeft: 2 }} />
              )}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(255,255,255,0.8)",
          borderRadius: 12,
          padding: "6px 14px",
          width: 180,
        }}>
          <Search size={13} color="#9aa5b4" />
          <input
            placeholder="Search..."
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: "0.78rem", color: "#1a2030", fontFamily: "DM Sans, sans-serif", width: "100%",
            }}
          />
        </div>

        {/* Icons */}
        <button style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Settings size={15} color="#6b7a8d" />
        </button>
        <button style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={15} color="#6b7a8d" />
          <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#e53e3e", border: "1.5px solid #fff" }} />
        </button>
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=56&h=56&fit=crop&auto=format"
          alt="User"
          style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.9)", cursor: "pointer" }}
        />
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Hero + Stats row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a2030", margin: 0 }}
            >
              Dashboard Overview
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{ fontSize: "0.8rem", color: "#6b7a8d", margin: "2px 0 0 0" }}
            >
              Welcome back! Here's what's happening with your clients today.
            </motion.p>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatCard value="1,360" label="Total Appointments" delta="↑" up />
            <StatCard value="2,654" label="Active Patients" delta="↑" up />
            <StatCard value="54" label="Critical Alerts" delta="!" up={false} />
          </div>
        </div>

        {/* Row 1: Wellness + (Stress/Recovery over HRV+Glucose) + Patient Flow */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1.15fr 1fr",
          gap: 14,
          alignItems: "stretch",
        }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ height: "100%" }}>
            <WellnessChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <StressRecoveryChart />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <HRVChart />
              <GlucoseGauge />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ height: "100%" }}>
            <PatientFlowChart />
          </motion.div>
        </div>

        {/* Row 2: Suggested Steps + Healthcare Providers + Aria */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1.8fr 1.1fr",
          gap: 14,
          alignItems: "start",
        }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <SuggestedSteps />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}>
            <HealthcareProviders />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
            <AriaPanel />
          </motion.div>
        </div>

      </main>
    </div>
  );
}
