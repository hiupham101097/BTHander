import React from "react";

export default function BrandLogo({ compact = false }) {
  return (
    <span className="brand" aria-label="BThander">
      <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="11" />
        <path d="M22.8 7.5 12.6 21h7l-2.4 11.5L28 18.7h-7.1l1.9-11.2Z" />
      </svg>
      {!compact && <span className="brand-name">B<span>Thander</span></span>}
    </span>
  );
}
