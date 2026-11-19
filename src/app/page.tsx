"use client";

import { useEffect, useMemo, useState } from "react";
import { DiscoveryCard } from "@/components/DiscoveryCard";
import { CharacterModal } from "@/components/CharacterModal";
import { productions } from "@/lib/productions";
import {
  discoveryRepository,
  type DiscoveryDecision,
} from "@/lib/discovery";

const navItems = ["Descobrir", "Matches", "Audições", "Mensagens"];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [firstOpportunityOnly, setFirstOpportunityOnly] = useState(false);
  const [interested, setInterested] = useState<number[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [charactersOpen, setCharactersOpen] = useState(false);
  const [appliedCharacterIds, setAppliedCharacterIds] = useState<number[]>([]);
  const [decisions, setDecisions] = useState<DiscoveryDecision[]>([]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTheme(
        document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      );
      setDecisions(discoveryRepository.listInterests());
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("cena-theme", nextTheme);
    setTheme(nextTheme);
  };

  const visibleProductions = useMemo(
    () =>
      firstOpportunityOnly
        ? productions.filter(
            (production) => production.firstOpportunity === "Aceita iniciantes",
          )
        : productions,
    [firstOpportunityOnly],
  );

  const safeIndex =
    visibleProductions.length === 0
      ? 0
      : Math.min(activeIndex, visibleProductions.length - 1);
  const production = visibleProductions[safeIndex];

  const move = (step: number) => {
    if (visibleProductions.length === 0) return;
    setActiveIndex(
      (current) =>
        (current + step + visibleProductions.length) %
        visibleProductions.length,
    );
  };

  const startApplication = () => {
    if (!production) return;
    setCharactersOpen(true);
  };

  const recordDecision = (action: "interested" | "passed") => {
    if (!production) return;
    const decision: DiscoveryDecision = {
      productionId: production.id,
      action,
      decidedAt: new Date().toISOString(),
    };
    discoveryRepository.saveDecision(decision);
    setDecisions((current) => [
      ...current.filter((item) => item.productionId !== production.id),
      decision,
    ]);
  };

  const passProduction = () => {
    recordDecision("passed");
    move(1);
  };

  const interestedInProduction = () => {
    recordDecision("interested");
    setInterested((current) =>
      current.includes(production.id) ? current : [...current, production.id],
    );
    move(1);
  };

  const applyToCharacter = (characterId: number) => {
    setAppliedCharacterIds((current) =>
      current.includes(characterId) ? current : [...current, characterId],
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Página inicial">
          <span className="brand-mark">C</span>
          <span>CENA</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item, index) => (
            <button
              type="button"
              className={index === 0 ? "active" : ""}
              key={item}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="theme-button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Ativar tema escuro"
                : "Ativar tema claro"
            }
            title={
              theme === "light"
                ? "Ativar tema escuro"
                : "Ativar tema claro"
            }
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
          </button>
          <button type="button" className="profile-button" aria-label="Abrir perfil">
            <span>AM</span>
          </button>
        </div>
      </header>

      <main className="discovery-main">
        <div className="discovery-heading">
          <div>
            <p className="eyebrow">Descobrir</p>
            <h1>Oportunidades para você</h1>
          </div>
          <button
            type="button"
            className={`filter-button ${firstOpportunityOnly ? "is-active" : ""}`}
            aria-pressed={firstOpportunityOnly}
            onClick={() => {
              setFirstOpportunityOnly((current) => !current);
              setActiveIndex(0);
            }}
          >
            <span aria-hidden="true">✦</span>
            Primeira oportunidade
          </button>
        </div>

        {production ? (
          <DiscoveryCard
            key={production.id}
            production={production}
            onPassed={passProduction}
            onInterested={interestedInProduction}
            onInterestedByDrag={() => {
              recordDecision("interested");
              setInterested((current) =>
                current.includes(production.id)
                  ? current
                  : [...current, production.id],
              );
              move(1);
            }}
            onPassedByDrag={passProduction}
            onViewCharacters={startApplication}
            interested={
              interested.includes(production.id) ||
              decisions.some(
                (item) =>
                  item.productionId === production.id &&
                  item.action === "interested",
              )
            }
          />
        ) : (
          <p>Nenhuma produção encontrada.</p>
        )}

        {visibleProductions.length > 1 && (
          <div className="pagination" aria-label="Paginação de produções">
            {visibleProductions.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === safeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`Mostrar ${item.title}`}
              />
            ))}
          </div>
        )}
      </main>

      {charactersOpen && production && (
        <CharacterModal
          production={production}
          onClose={() => setCharactersOpen(false)}
          onApply={applyToCharacter}
          appliedCharacterIds={appliedCharacterIds}
        />
      )}

      <nav className="mobile-nav" aria-label="Navegação principal">
        {navItems.map((item, index) => (
          <button
            type="button"
            className={index === 0 ? "active" : ""}
            key={item}
          >
            <span aria-hidden="true">{["⌕", "♡", "◷", "◯"][index]}</span>
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}
