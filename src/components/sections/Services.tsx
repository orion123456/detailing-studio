"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  categories,
  services,
  priceLabel,
  type Category,
} from "@/data/services";
import { filterServices } from "@/lib/lead";
import { useLead } from "./lead-context";
import { Reveal } from "@/components/ui/reveal";
export function Services() {
  const [category, setCategory] = useState<Category>("Все услуги");
  const { chooseService } = useLead();
  return (
    <section id="services" className="section light">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / УСЛУГИ И ЦЕНЫ</p>
            <h2>
              Ваш автомобиль.
              <br />
              <span className="muted">Наше внимание к деталям.</span>
            </h2>
          </div>
          <p className="section-description">
            От бережной мойки до полной защиты кузова.
            <br />
            Подберём именно то, что нужно вашему автомобилю.
          </p>
        </div>
        <div className="filters" aria-label="Категории услуг">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={c === category}
              className={c === category ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
              {c === "Все услуги" && <span>12</span>}
            </button>
          ))}
        </div>
        <div className="services-grid" aria-live="polite">
          {filterServices(services, category).map((s, i) => (
            <Reveal key={s.id}>
              <article className="service-card" data-service={s.id}>
                <div className="service-image">
                  <Image
                    src={`/images/${s.image}.webp`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    alt={s.name}
                  />
                  <span className="image-category">{s.category}</span>
                  {s.featured && (
                    <span className="featured">В ФОКУСЕ</span>
                  )}
                  <span className="image-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="service-body">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <div className="service-bottom">
                    <strong>{priceLabel(s.price)}</strong>
                    <ArrowUpRight size={19} />
                  </div>
                  <button
                    className="service-action"
                    onClick={() => chooseService(s.id)}
                  >
                    Рассчитать стоимость <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="fine-print">
          Итоговая стоимость зависит от класса и состояния автомобиля.
        </p>
      </div>
    </section>
  );
}
