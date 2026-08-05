import React from "react";
import { Sparkles } from "lucide-react";

export default function SectionEyebrow({ label }) {
  return (
    <div className="eyebrow">
      <Sparkles size={14} />
      <span>{label}</span>
    </div>
  );
}
