import { useRef, useEffect, RefObject } from "react";

export default function useAutoScroll(
  dependency: string
): RefObject<HTMLDivElement> {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dependency]);

  return scrollRef;
}
