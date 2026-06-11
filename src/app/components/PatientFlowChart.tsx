import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { useI18n } from "../i18n";

const data = [
  { name: "Completed", value: 650, color: "#d4a84b" },
  { name: "Upcoming", value: 326, color: "#9b59b6" },
  { name: "Remaining", value: 884 - 650 - 326 + 860, color: "#2d7a5f" },
];

const segments = [
  { value: 650, color: "#d4a84b", label: "Completed" },
  { value: 326, color: "#9b59b6", label: "Upcoming" },
  { value: 210, color: "#2d7a5f", label: "Other" },
];

export function PatientFlowChart() {
  const { t } = useI18n();
  return (
    <div className="p-6 flex flex-col gap-3" style={{ height: "100%" }}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.85rem", fontWeight: 300, color: "#1a2030" }}>{t("patient_flow")}</span>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa5b4", fontSize: "1rem" }}>···</button>
      </div>

      <div className="flex items-center gap-4" style={{ flex: 1 }}>
        <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={50}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
                animationBegin={200}
                animationDuration={1200}
              >
                {segments.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#1a2030" }}>860</span>
            <span style={{ fontSize: "0.6rem", color: "#9aa5b4" }}>{t("capacity68")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a2030" }}>650</div>
            <div style={{ fontSize: "0.7rem", color: "#9aa5b4" }}>{t("completed")}</div>
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a2030" }}>326</div>
            <div style={{ fontSize: "0.7rem", color: "#9aa5b4" }}>{t("upcoming")}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e8f0e8", flexShrink: 0, overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=56&h=56&fit=crop&auto=format" alt="Doctor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <p style={{ fontSize: "0.65rem", color: "#6b7a8d", lineHeight: 1.4 }}>
          {t("recovery_note")}
        </p>
      </div>
    </div>
  );
}
