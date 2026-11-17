"use client";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navigation } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
export function Logo() {
  return (
    <span className="logo">
      DETAILING<span>STUDIO</span>
    </span>
  );
}
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 35);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#home">
          <Logo />
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              aria-current={active === n.id ? "location" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#lead">
          Записаться <ArrowUpRight size={16} />
        </a>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            className="menu-trigger icon-button"
            aria-label="Открыть меню"
          >
            <Menu />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="modal-overlay" />
            <Dialog.Content
              className="mobile-menu"
              aria-describedby={undefined}
            >
              <Dialog.Title>
                <Logo />
              </Dialog.Title>
              <Dialog.Close
                className="icon-button menu-close"
                aria-label="Закрыть меню"
              >
                <X />
              </Dialog.Close>
              <nav aria-label="Мобильная навигация">
                {navigation.map((n, i) => (
                  <a
                    key={n.id}
                    href={`#${n.id}`}
                    aria-current={active === n.id ? "location" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span>0{i + 1}</span>
                    {n.label}
                    <ArrowUpRight />
                  </a>
                ))}
              </nav>
              <a
                className="button button-primary"
                href="#lead"
                onClick={() => setOpen(false)}
              >
                Рассчитать стоимость
              </a>
              <p className="muted">Москва · Уход, который заметен</p>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
export function MobileCTA() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setHidden(entries.some((e) => e.isIntersecting)),
      { threshold: 0 },
    );
    const el = document.getElementById("lead");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`mobile-cta ${hidden ? "is-hidden" : ""}`}>
      <a href="#lead" className="button button-primary">
        Оставить заявку <ArrowUpRight size={18} />
      </a>
    </div>
  );
}
