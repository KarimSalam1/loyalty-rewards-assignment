import { useRef } from "react";
import ResetContext from "./ResetContext";

export function ResetProvider({ children }) {
  const listeners = useRef([]);

  const register = (callback) => {
    listeners.current.push(callback);
  };

  const resetAll = () => {
    listeners.current.forEach((cb) => cb());
  };

  return (
    <ResetContext.Provider value={{ register, resetAll }}>
      {children}
    </ResetContext.Provider>
  );
}
