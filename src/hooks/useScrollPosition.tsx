import { useEffect, useRef, useState } from "react";

export type ScrollPostion = {
  x: number;
  y: number;
};
function useScrollPosition<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [scrollPosition, setScrollPosition] = useState<ScrollPostion>({
    x: 0,
    y: 0,
  });
  const { x, y } = scrollPosition;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const updatePosition = () => {
      setScrollPosition({
        x: el.scrollLeft,
        y: el.scrollTop,
      });
    };
    el.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => el.removeEventListener("scroll", updatePosition);
  }, []);

  return {
    ref,
    x,
    y,
  };
}

export default useScrollPosition;
