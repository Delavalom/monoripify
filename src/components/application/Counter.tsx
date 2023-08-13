import { Loader } from "lucide-react";
import { type FC } from "react";
import { useCounter } from "~/hooks/useCounter";

export const Counter: FC = () => {
  const counter = useCounter()

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
