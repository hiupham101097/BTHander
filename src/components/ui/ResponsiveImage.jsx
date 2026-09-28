import React from "react";
import images from "../../constants/image-manifest.json";

export default function ResponsiveImage({ src, alt = "", sizes = "(max-width: 760px) 100vw, 50vw", loading = "lazy", ...props }) {
  const image = images[src];
  return <img {...image} src={image?.src || src} sizes={image ? sizes : undefined} alt={alt} loading={loading} decoding="async" {...props} />;
}
