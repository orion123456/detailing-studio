"use client";
import { createContext, useContext, useReducer, useState } from "react";
import {
  initialLead,
  leadReducer,
  type Lead,
  type LeadAction,
} from "@/lib/lead";
const Context = createContext<{
  lead: Lead;
  dispatch: React.Dispatch<LeadAction>;
  chooseService: (id: string) => void;
  success: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);
export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [lead, dispatch] = useReducer(leadReducer, initialLead);
  const [success, setSuccess] = useState(false);
  function chooseService(id: string) {
    dispatch({ type: "service", value: id });
    setSuccess(false);
    document.getElementById("lead")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <Context.Provider
      value={{ lead, dispatch, chooseService, success, setSuccess }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLead() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("LeadProvider missing");
  return ctx;
}
