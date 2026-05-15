import { useState, useEffect, useCallback } from 'react';
import { toastFn } from '@/utils';

const useInfiniteScroll = (fetchFunction, extraParams = {}, offsetLimit = 40) => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [reset,setReset] = useState(false)

  const fetchMore = useCallback(async (currentOffset = offset) => {

    setIsFetchingMore(true);
    try {
      const result = await fetchFunction({ ...extraParams, offset: currentOffset, limit: offsetLimit });
      if(!result?.success){
        toastFn("error",result?.message || "Someting went wrong!!!");
        return;
      }
      if (result?.success) {
        const newData = result.data || [];

        if (newData && newData?.length) {
          setData(prev => [...prev, ...newData]);
          setOffset(prev => prev + offsetLimit);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [extraParams, offsetLimit, isFetchingMore, hasMore, offset]);

  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingMore || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 10;

      if (scrollPosition >= threshold) {
        fetchMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingMore, hasMore]);

  // Initial load
  useEffect(() => {
      setData([]);
      setOffset(0);
      setHasMore(true);
      setIsLoading(true);
      fetchMore(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [extraParams]);

  // When reset is triggered (Add / Delete / Update)
  useEffect(() => {
    if (!reset) return;

    setData([]);
    setOffset(0);
    setHasMore(true);
    setIsLoading(true);
    fetchMore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setReset(false);
  }, [reset]);



  return { data, isLoading, isFetchingMore, hasMore, fetchMore, setData,setReset };
};

export default useInfiniteScroll;