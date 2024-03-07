import { useEffect, useState } from "react";

export function useWaitingClick(
  callback: () => void | Promise<any>,
  delay: number
) {
  const [isFetching, setIsFetching] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [seconds, setSeconds] = useState(delay);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStale) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isStale]);

  useEffect(() => {
    if (seconds === 0) {
      setIsStale(false);
      setSeconds(delay);
    }
  }, [seconds, delay]);

  const onClick = async () => {
    setIsFetching(true);
    await callback();
    setIsFetching(false);
    setIsStale(true);
  };

  return { isStale, isFetching, seconds, onClick };
}
