import { useEffect, useRef } from "react";

export default function useInfiniteScroll(onIntersect, enabled = true, rootMargin = "600px") {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { root: null, rootMargin, threshold: 0.1 }
    );

    obs.observe(node);
    return () => obs.unobserve(node);
  }, [onIntersect, enabled, rootMargin]);

  return ref;
}
