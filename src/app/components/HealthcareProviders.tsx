import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "../i18n";
import { usePortfolio } from "../portfolio";

const fallback = [
  { name: "Dr. Chloe Davis", col2: "Pathology", col3: "(505) 555-0123", available: true, rank: "1",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=56&h=56&fit=crop&auto=format" },
  { name: "Dr. Ben Carter", col2: "Orthopedics", col3: "(405) 654-7654", available: false, rank: "2",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=56&h=56&fit=crop&auto=format" },
  { name: "Dr. Alice Smith", col2: "Pathology", col3: "(504) 654-0543", available: true, rank: "3",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=56&h=56&fit=crop&auto=format" },
];

export function HealthcareProviders() {
  const { t } = useI18n();
  const { data } = usePortfolio();
  const board = data?.widgets?.pm_leaderboard;

  const filtered = board?.length
    ? board.map((b: any) => ({
        name: b.pm,
        col2: String(b.score),
        col3: `${b.projects_completed} • ${b.avg_ttm}d`,
        available: b.available,
        rank: `#${b.rank}`,
        img: `https://i.pravatar.cc/64?u=${encodeURIComponent(b.pm)}`,
      }))
    : fallback;

  return (
    <div className="p-6 flex flex-col gap-4" style={{ height: "100%" }}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a2030" }}>{t("healthcare_providers")}</span>
        <div className="flex gap-2">
          <button style={{ width: 32, height: 32, borderRadius: 8, background: "#f0f4f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={14} color="#6b7a8d" />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 4, height: 32, borderRadius: 8, background: "#f0f4f7", border: "none", cursor: "pointer", padding: "0 10px", fontSize: "0.75rem", color: "#6b7a8d" }}>
            <SlidersHorizontal size={12} /> {t("filter")}
          </button>
        </div>
      </div>

      {/* Header row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.3fr 40px", fontSize: "0.72rem", color: "#9aa5b4", paddingBottom: 4, borderBottom: "1px solid #e4eaef" }}>
        <span>{t("provider_name")}</span>
        <span>{t("department")}</span>
        <span>{t("contact")}</span>
        <span>{t("action")}</span>
      </div>

      {filtered.map((p: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.2fr 1.3fr 40px",
            alignItems: "center",
            paddingBottom: i < filtered.length - 1 ? 12 : 0,
            borderBottom: i < filtered.length - 1 ? "1px solid #f0f4f7" : "none",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={p.img}
              alt={p.name}
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 300, color: "#1a2030" }}>{p.name}</div>
              <div className="flex items-center gap-1">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.available ? "#2d7a5f" : "#e53e3e" }} />
                <span style={{ fontSize: "0.65rem", color: "#9aa5b4" }}>{p.available ? t("available") : t("absent")}</span>
              </div>
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#6b7a8d" }}>{p.col2}</span>
          <span style={{ fontSize: "0.75rem", color: "#6b7a8d" }}>{p.col3}</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a2030", textAlign: "right" }}>{p.rank}</span>
        </motion.div>
      ))}
    </div>
  );
}
