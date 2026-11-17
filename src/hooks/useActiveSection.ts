"use client";

import { useEffect, useState } from "react";
import { navigation } from "@/data/navigation";

const navigationIds = new Set(navigation.map(({ id }) => id));

export function useActiveSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]"),
    );
    const header = document.querySelector("header");
    let frame = 0;

    const update = () => {
      frame = 0;
      // Follow the section just below the fixed header, including sections
      // outside the menu so the previous link cannot remain selected there.
      const readingLine = (header?.getBoundingClientRect().bottom ?? 90) + 24;
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? sections.at(-1)
        : sections.find((section) => {
            const { top, bottom } = section.getBoundingClientRect();
            return top <= readingLine && bottom > readingLine;
          });
      setActive(current && navigationIds.has(current.id) ? current.id : "");
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    sections.forEach((section) => observer.observe(section));
    if (header) observer.observe(header);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      observer.disconnect();
    };
  }, []);

  return active;
}
