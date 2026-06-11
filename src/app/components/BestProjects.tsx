import { motion } from "motion/react";
import { useI18n } from "../i18n";

const projects = [
  { name: "Cardio Care", pct: 82, color: "#2d7a5f" },
  { name: "Wellness 2.0", pct: 64, color: "#9b59b6" },
  { name: "Lab Sync", pct: 47, color: "#d4a84b" },
];

export function BestProjects() {
  const { t } = useI18n();
  return (
    <div className="p-6 flex flex-col gap-4" style={{ height: "100%" }}>
      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a2030" }}>
        {t("best_projects")}
      </span>

      <div className="flex flex-col gap-5" style={{ flex: 1, justifyContent: "center" }}>
        {projects.map((p, i) => (
          <div key={p.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "0.78rem", fontWeight: 300, color: "#1a2030" }}>{p.name}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: p.color }}>{p.pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "#eef1f4", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 6, background: p.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
