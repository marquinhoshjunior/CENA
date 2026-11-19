"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Production } from "@/lib/productions";

type DiscoveryCardProps = {
  production: Production;
  onPassed: () => void;
  onInterested: () => void;
  onInterestedByDrag: () => void;
  onPassedByDrag: () => void;
  onViewCharacters: () => void;
  interested: boolean;
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={direction === "right" ? "h-5 w-5 rotate-180" : "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DiscoveryCard({
  production,
  onPassed,
  onInterested,
  onInterestedByDrag,
  onPassedByDrag,
  onViewCharacters,
  interested,
}: DiscoveryCardProps) {
  const dragStart = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState<"left" | "right" | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    dragStart.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStart.current === null) return;
    setDragOffset(event.clientX - dragStart.current);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStart.current === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const threshold = 90;
    const finalOffset = event.clientX - dragStart.current;

    if (finalOffset > threshold) {
      setIsLeaving("right");
      window.setTimeout(onInterestedByDrag, 180);
    } else if (finalOffset < -threshold) {
      setIsLeaving("left");
      window.setTimeout(onPassedByDrag, 180);
    }

    dragStart.current = null;
    setDragging(false);
    if (Math.abs(dragOffset) <= threshold) setDragOffset(0);
  };

  return (
    <article
      className={`discovery-card ${dragging ? "is-dragging" : ""} ${
        isLeaving ? `is-leaving-${isLeaving}` : ""
      }`}
      style={{ transform: `translateX(${dragOffset}px) rotate(${dragOffset / 35}deg)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={() => {
        dragStart.current = null;
        setDragging(false);
        setDragOffset(0);
      }}
    >
      <div className="card-image">
        <Image
          src={production.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          priority
          className="object-cover"
        />
        <div className="image-shade" />
        <button
          type="button"
          className="nav-button nav-button-left"
          onClick={onPassed}
          aria-label="Passar esta produção"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className="nav-button nav-button-right"
          onClick={onInterested}
          aria-label="Demonstrar interesse nesta produção"
        >
          <ArrowIcon direction="right" />
        </button>
        <div className="card-overline">
          <span className="genre-pill">{production.genre}</span>
          {production.firstOpportunity === "Aceita iniciantes" && (
            <span className="first-opportunity-pill">Primeira oportunidade</span>
          )}
        </div>
        <div className="card-title-block">
          <p>{production.company}</p>
          <h2>{production.title}</h2>
          <p className="location">{production.city}</p>
        </div>
      </div>

      <div className="card-details">
        <p className="description">{production.description}</p>
        <div className="role-row">
          <div>
            <span className="detail-label">Personagens</span>
            <div className="chips">
              {production.roles.map((role) => (
                <span className="chip" key={role.id}>
                  {role.name}
                </span>
              ))}
            </div>
          </div>
          <div className="season">
            <span className="detail-label">Calendário</span>
            <strong>{production.season}</strong>
          </div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className={`interest-button ${interested ? "is-active" : ""}`}
            onClick={onInterested}
          >
            <span aria-hidden="true">♡</span>
            {interested ? "Interesse enviado" : "Tenho interesse"}
          </button>
          <button
            type="button"
            className="apply-button"
            onClick={onViewCharacters}
          >
            Ver personagens
          </button>
        </div>
      </div>
    </article>
  );
}
