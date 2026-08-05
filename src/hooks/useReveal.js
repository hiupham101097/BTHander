import { useEffect, useRef, useState } from "react";

/**
 * Hook theo dõi khi phần tử xuất hiện trong viewport để kích hoạt animation.
 * Tách riêng logic (IntersectionObserver) khỏi UI theo đúng mô hình custom hook của React.
 */
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, shown];
}
