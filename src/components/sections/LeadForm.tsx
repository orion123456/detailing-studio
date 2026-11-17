"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/data/services";
import { formatPhone, validateLead, type Lead } from "@/lib/lead";
import { useLead } from "./lead-context";
export function LeadForm() {
  const { lead, dispatch, success, setSuccess } = useLead();
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateLead(lead);
    setErrors(next);
    if (Object.keys(next).length) {
      const key = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
      return;
    }
    dispatch({ type: "reset" });
    setSuccess(true);
  }
  function reset() {
    dispatch({ type: "reset" });
    setErrors({});
    setSuccess(false);
    requestAnimationFrame(() =>
      document.getElementById("client-name")?.focus(),
    );
  }
  return (
    <section id="lead" className="section lead-section dark">
      <div className="container">
        <div className="lead-layout">
          <div className="lead-visual">
            <Image
              src="/images/black.webp"
              alt="Тёмный автомобиль с выразительными отражениями на кузове"
              fill
              sizes="(max-width:768px) 100vw,50vw"
            />
            <div>
              <p className="eyebrow">07 / НАЧНЁМ С ВАШЕГО АВТОМОБИЛЯ</p>
              <h2>
                Безупречный вид.
                <br />
                Начинается здесь.
              </h2>
              <p>
                Расскажите, что вам нужно.
                <br />
                Остальные детали мы продумаем вместе.
              </p>
            </div>
          </div>
          <div className="lead-panel">
            <AnimatePresence mode="wait" initial={false}>
              {success ? (
                <motion.div
                  key="success"
                  className="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                  ref={(node) => {
                    node?.focus();
                  }}
                  tabIndex={-1}
                  role="status"
                >
                  <span className="success-icon">
                    <Check size={38} />
                  </span>
                  <h3>Заявка заполнена</h3>
                  <button className="button button-primary" onClick={reset}>
                    Заполнить ещё раз <ArrowUpRight size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={submit}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                >
                  <h3>Рассчитаем стоимость</h3>
                  <p className="muted">Выберите услугу и оставьте контакты</p>
                  <label htmlFor="client-name">Ваше имя</label>
                  <input
                    id="client-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Как к вам обращаться?"
                    value={lead.name}
                    onChange={(e) =>
                      dispatch({
                        type: "field",
                        field: "name",
                        value: e.target.value,
                      })
                    }
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="field-error">
                      {errors.name}
                    </p>
                  )}
                  <label htmlFor="phone">Номер телефона</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (999) 999-99-99"
                    value={lead.phone}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        e.currentTarget.selectionStart === lead.phone.length
                      ) {
                        e.preventDefault();
                        dispatch({
                          type: "field",
                          field: "phone",
                          value: formatPhone(
                            lead.phone.replace(/\D/g, "").slice(0, -1),
                          ),
                        });
                      }
                    }}
                    onChange={(e) =>
                      dispatch({
                        type: "field",
                        field: "phone",
                        value: formatPhone(e.target.value),
                      })
                    }
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="field-error">
                      {errors.phone}
                    </p>
                  )}
                  <label htmlFor="service">Услуга</label>
                  <select
                    id="service"
                    name="service"
                    value={lead.service}
                    onChange={(e) =>
                      dispatch({ type: "service", value: e.target.value })
                    }
                    aria-required="true"
                    aria-invalid={!!errors.service}
                    aria-describedby={
                      errors.service ? "service-error" : undefined
                    }
                  >
                    <option value="">Выберите услугу</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p id="service-error" className="field-error">
                      {errors.service}
                    </p>
                  )}
                  <label className="consent">
                    <input
                      name="consent"
                      type="checkbox"
                      checked={lead.consent}
                      onChange={(e) =>
                        dispatch({ type: "consent", value: e.target.checked })
                      }
                      aria-invalid={!!errors.consent}
                      aria-describedby={
                        errors.consent ? "consent-error" : undefined
                      }
                    />
                    <span>
                      Я принимаю условия
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="consent-error" className="field-error">
                      {errors.consent}
                    </p>
                  )}
                  <button
                    className="button button-primary submit"
                    type="submit"
                  >
                    Рассчитать стоимость <ArrowUpRight size={18} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
