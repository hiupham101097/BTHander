import React from "react";
import ResponsiveImage from "./ResponsiveImage.jsx";

export default function BrandLogo({ compact = false }) {
  return (
    <span className="brand" aria-label="BThander">
      <ResponsiveImage loading="eager" sizes="48px" className="brand-mark brand-mark-image" src="/images/bthander-logo-mark.png" alt="" aria-hidden="true" />
      {!compact && <span className="brand-name">B<span>Thander</span></span>}
    </span>
  );
}
