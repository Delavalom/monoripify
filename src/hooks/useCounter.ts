import { useEffect, useState } from "react";
import { formatCounter } from "~/lib/utils";

export function useCounter() {
    const [count, setCount] = useState(0);

  useEffect(() => {
    function onCount() {
      setCount((c) => c + 1);
    }
    const id = setInterval(onCount, 1000);

    return () => clearInterval(id);
  }, [count]);


  const counter = formatCounter(count)

  return counter
}