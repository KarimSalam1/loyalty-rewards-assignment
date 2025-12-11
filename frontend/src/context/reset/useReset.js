import { useContext } from "react";
import ResetContext from "./ResetContext";

export function useReset() {
  return useContext(ResetContext);
}
