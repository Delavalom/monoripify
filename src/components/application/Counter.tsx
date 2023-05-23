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
    <section className="flex gap-3 flex-col items-center justify-center">
      <h1>Building:</h1> 
      <div className="flex gap-1 items-center justify-center">
        <Loader className="h-4 w-4 animate-spin" />
        <h1>{counter}</h1>
      </div>
    </section>
  );
};
