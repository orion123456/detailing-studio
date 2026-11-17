"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
export function Portfolio() {
  const [filter, setFilter] = useState("Все работы");
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const touch = useRef(0);
  const opener = useRef<HTMLButtonElement | null>(null);
  const items = portfolio.filter(
    (p) => filter === "Все работы" || p.category === filter,
  );
  const selected = index === null ? null : items[index];
  function move(step: number) {
    setIndex((i) =>
      i === null ? 0 : (i + step + items.length) % items.length,
    );
  }
  return (
    <section id="portfolio" className="section dark">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / НАШИ РАБОТЫ</p>
            <h2>
              Результат говорит
              <br />
              <span className="muted">сам за себя.</span>
            </h2>
          </div>
          <p className="section-description">
            Чистые линии. Глубокий цвет. Безупречные детали.
          </p>
        </div>
        <div className="filters dark-filters" aria-label="Категории работ">
          {["Все работы", "Кузов", "Защита", "Салон"].map((c) => (
            <button
              key={c}
              className={filter === c ? "active" : ""}
              aria-pressed={filter === c}
              onClick={() => {
                setFilter(c);
                setExpanded(false);
                setIndex(null);
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {items.slice(0, expanded ? 9 : 6).map((p, i) => (
            <button
              key={p.id}
              className="portfolio-item"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
            >
              <Image
                src={`/images/${p.image}.webp`}
                alt={`${p.title}`}
                fill
                sizes="(max-width:640px) 100vw,(max-width:1023px) 50vw,33vw"
              />
              <span className="portfolio-caption">
                <span>
                  <small>{p.service}</small>
                  <strong>{p.title}</strong>
                </span>
                <ArrowUpRight />
              </span>
            </button>
          ))}
        </div>
        {!expanded && items.length > 6 && (
          <div className="center">
            <button
              className="button button-outline"
              onClick={() => setExpanded(true)}
            >
              Показать ещё <Plus size={18} />
            </button>
          </div>
        )}
        <Dialog.Root
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setIndex(null);
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="modal-overlay" />
            <Dialog.Content
              className="lightbox"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                opener.current?.focus();
              }}
              aria-describedby={undefined}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") move(1);
                if (e.key === "ArrowLeft") move(-1);
              }}
              onTouchStart={(e) => {
                touch.current = e.changedTouches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - touch.current;
                if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
              }}
            >
              <Dialog.Title className="lightbox-title">
                {selected?.title}{" "}
                <small>
                  {index === null ? 0 : index + 1} /{" "}
                  {items.length}
                </small>
              </Dialog.Title>
              <Dialog.Close
                className="icon-button lightbox-close"
                aria-label="Закрыть фото"
              >
                <X />
              </Dialog.Close>
              {selected && (
                <div className="lightbox-image">
                  <Image
                    src={`/images/${selected.image}.webp`}
                    alt={selected.title}
                    fill
                    sizes="95vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
              <button
                className="icon-button lightbox-prev"
                aria-label="Предыдущее фото"
                onClick={() => move(-1)}
              >
                <ArrowLeft />
              </button>
              <button
                className="icon-button lightbox-next"
                aria-label="Следующее фото"
                onClick={() => move(1)}
              >
                <ArrowRight />
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </section>
  );
}
