import { Loader } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { formatCounter } from "~/lib/utils";

export const Counter: FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onCount() {
      setCount((c) => c + 1);
    }
    const id = setInterval(onCount, 1000);

    return () => clearInterval(id);
  }, [count]);


  const counter = formatCounter(count)

  return (
    <section className="flex items-center justify-center">
      <Loader className="mr-1 h-4 w-4 animate-spin" />
      <h1>{counter}</h1>
    </section>
  );
};
