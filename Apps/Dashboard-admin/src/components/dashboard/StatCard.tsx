import React, { useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";

interface Props {
  label:    string;
  value:    number | string;
  icon:     string;
  color?:   string;
  bg?:      string;
  trend?:   number;
  suffix?:  string;
  delay?:   number;
  animated?: boolean;
}

const StatCard: React.FC<Props> = ({
  label, value, icon, color="#3b7ef8", bg="#EEF2FF",
  trend, suffix="", delay=0, animated=true,
}) => {
  const [displayed, setDisplayed] = useState(0);
  const numeric = typeof value === "number" ? value : parseFloat(value as string) || 0;
  const isNum   = typeof value === "number";

  useEffect(() => {
    if (!animated || !isNum) return;
    let start = 0;
    const step = numeric / 40;
    const t = setInterval(() => {
      start = Math.min(start + step, numeric);
      setDisplayed(Math.round(start));
      if (start >= numeric) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [numeric, animated, isNum]);

  return (
    <div className="card" style={{
      margin:15,
      padding: "22px 24px",
      animation: `fadeUp .55s ${delay}s ease both`,
      opacity: 0,
      animationFillMode: "forwards",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Bg circle */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 90, height: 90, borderRadius: "50%",
        background: bg, opacity: .5,
      }}/>

      <div style={{  display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: bg, border: `1px solid ${color}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 12px ${color}22`,
        }}>
          <IonIcon icon={icon} style={{ fontSize: 20, color }} />
        </div>
        {trend !== undefined && (
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            fontSize: 11, fontWeight: 700,
            color: trend >= 0 ? "#10b981" : "#ef4444",
            background: trend >= 0 ? "#D1FAE5" : "#FEE2E2",
            padding: "3px 8px", borderRadius: 50,
          }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="stat-num" style={{
        fontSize: "clamp(26px,3vw,34px)", color: "#1e293b",
        animationDelay: `${delay + .1}s`,
      }}>
        {isNum ? displayed.toLocaleString("fr-FR") : value}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 5, fontWeight: 500 }}>{label}</div>
    </div>
  );
};

export default StatCard;
