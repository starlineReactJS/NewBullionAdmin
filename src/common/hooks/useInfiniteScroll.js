import { useState, useEffect, useCallback, useRef } from 'react';
import { toastFn } from '@/utils';

const useInfiniteScroll = (fetchFunction, extraParams = {}, offsetLimit = 40, scrollRef) => {
  const [data, setData] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [reset, setReset] = useState(false);

  // Keep mutable values in refs so callbacks don't go stale
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchMore = useCallback(async (currentOffset) => {
    if (isFetchingRef.current || !hasMoreRef.current) return;


    const fetchOffset = currentOffset ?? offsetRef.current;
    const isInitialLoad = fetchOffset === 0;  // ← only first load shows skeleton

    isFetchingRef.current = true;
    setIsFetchingMore(true);
    if (isInitialLoad) setIsLoading(true);   // ← only set on initial load

    try {
      const result = await fetchFunction({
        ...extraParams,
        offset: fetchOffset,
        limit: offsetLimit,
      });

      if (!result?.success) {
        toastFn("error", result?.message || "Something went wrong!");
        return;
      }

      const newData = result.data || [];
      if (newData.length) {
        setData(prev => [...prev, ...newData]);
        offsetRef.current = fetchOffset + offsetLimit;
      } else {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      isFetchingRef.current = false;
      setIsFetchingMore(false);
      setIsLoading(false);
    }
  }, [fetchFunction, extraParams, offsetLimit]);

  // Scroll listener — targets the ref'd container, falls back to window
  useEffect(() => {
    const el = scrollRef?.current ?? window;

    const handleScroll = () => {
      if (isFetchingRef.current || !hasMoreRef.current) return;

      // Works for both a div and window
      const { scrollTop, scrollHeight, clientHeight } =
        el === window
          ? {
            scrollTop: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: window.innerHeight,
          }
          : el;

      if (scrollHeight - scrollTop - clientHeight < 100) {
        fetchMore();
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef, fetchMore]);

  // Initial load / when extraParams change
  useEffect(() => {
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setData([]);
    setHasMore(true);
    setIsLoading(true);

    const el = scrollRef?.current ?? window;
    if (el === window) window.scrollTo({ top: 0, behavior: "smooth" });
    else el.scrollTop = 0;

    fetchMore(0);
  }, [extraParams]); // intentionally omit fetchMore — extraParams drives resets

  // Reset triggered externally (after add/delete)
  useEffect(() => {
    if (!reset) return;

    offsetRef.current = 0;
    hasMoreRef.current = true;
    setData([]);
    setHasMore(true);
    setIsLoading(true);

    const el = scrollRef?.current ?? window;
    if (el === window) window.scrollTo({ top: 0, behavior: "smooth" });
    else el.scrollTop = 0;

    fetchMore(0);
    setReset(false);
  }, [reset]);

  return { data, isLoading, isFetchingMore, hasMore, fetchMore, setData, setReset };
};

export default useInfiniteScroll;