"use client";

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "cena-theatre-opening-seen";

export function TheatreOpening() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const markOpeningSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // The opening remains optional if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let startTimer: number | undefined;
    let finishTimer: number | undefined;
    let reducedTimer: number | undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const forceOpening =
      new URL(window.location.href).searchParams.get("opening") === "1";

    let shouldShow = true;
    try {
      shouldShow =
        forceOpening ||
        window.sessionStorage.getItem(SESSION_KEY) !== "true";
    } catch {
      shouldShow = true;
    }

    if (shouldShow) {
      document.body.style.overflow = "hidden";

      startTimer = window.setTimeout(() => {
        setReducedMotion(prefersReducedMotion);
        setVisible(true);
      }, 20);
      finishTimer = window.setTimeout(
        () => finishOpening(),
        prefersReducedMotion ? 900 : 5200,
      );
      return () => {
        window.clearTimeout(startTimer);
        window.clearTimeout(finishTimer);
        window.clearTimeout(reducedTimer);
        document.body.style.overflow = "";
      };
    }

    function finishOpening() {
      setExiting(true);
      reducedTimer = window.setTimeout(() => {
        markOpeningSeen();
        setVisible(false);
        document.body.style.overflow = "";
      }, 420);
    }

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(reducedTimer);
    };
  }, [markOpeningSeen]);

  if (!visible) return null;

  const skipOpening = () => {
    setExiting(true);
    markOpeningSeen();
    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, reducedMotion ? 0 : 420);
  };

  return (
    <div
      className={`cena-opening ${exiting ? "is-exiting" : ""} ${
        reducedMotion ? "is-reduced" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Abertura teatral da CENA"
    >
      <div className="cena-opening-stage" aria-hidden="true">
        <div className="cena-stage-back" />
        <div className="cena-stage-floor" />
        <div className="cena-stage-haze" />
        <div className="cena-spotlight-beam">
          <div className="cena-spotlight-core" />
        </div>
      </div>

      <div className="cena-curtain cena-curtain-left" aria-hidden="true">
        <div className="cena-curtain-folds" />
        <div className="cena-curtain-valance" />
      </div>
      <div className="cena-curtain cena-curtain-right" aria-hidden="true">
        <div className="cena-curtain-folds" />
        <div className="cena-curtain-valance" />
      </div>

      <div className="cena-opening-mark" aria-label="CENA">
        <span>CENA</span>
      </div>

      <button
        type="button"
        className="cena-opening-skip"
        onClick={skipOpening}
      >
        Pular abertura
      </button>
    </div>
  );
}
