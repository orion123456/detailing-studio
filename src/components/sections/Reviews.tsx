"use client";

import { useState } from "react";
import { Pause, Play, Quote, Star } from "lucide-react";
import { reviews } from "@/data/reviews";

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <article className="review-card">
      <div className="review-stars" role="img" aria-label="5 из 5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star size={15} key={i} fill="currentColor" />
        ))}
        <Quote className="quote" size={28} />
      </div>
      <p>«{review.text}»</p>
      <div className="review-author">
        <span className="avatar">{review.name[0]}</span>
        <span>
          <strong>{review.name}</strong>
          <small>{review.service}</small>
        </span>
      </div>
    </article>
  );
}

export function Reviews() {
  const [paused, setPaused] = useState(false);
  return (
    <section id="reviews" className="section light">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">06 / ОТЗЫВЫ</p>
            <h2>
              За красивым результатом —<br />
              <span className="muted">довольный владелец.</span>
            </h2>
          </div>
          <button
            type="button"
            className="review-pause"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? "Продолжить отзывы" : "Приостановить отзывы"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            {paused ? "Продолжить" : "Пауза"}
          </button>
        </div>
        <div
          className="review-marquee"
          role="region"
          aria-label="Отзывы клиентов"
          tabIndex={0}
          data-paused={paused}
        >
          <div className="review-marquee-track">
            <div className="review-marquee-group">
              {reviews.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
            <div
              className="review-marquee-group review-marquee-copy"
              aria-hidden="true"
              inert
            >
              {reviews.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
