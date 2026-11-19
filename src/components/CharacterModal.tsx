/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import type { Character, Production } from "@/lib/productions";

type CharacterModalProps = {
  production: Production;
  onClose: () => void;
  onApply: (characterId: number) => void;
  appliedCharacterIds: number[];
};

type CharacterCardProps = {
  character: Character;
  index: number;
  applied: boolean;
  onSelect: (character: Character) => void;
};

function CharacterCard({
  character,
  index,
  applied,
  onSelect,
}: CharacterCardProps) {
  const isOpen = character.vacancies > 0;

  return (
    <button
      type="button"
      className="theatre-character-card"
      onClick={() => onSelect(character)}
      aria-label={`Ver detalhes de ${character.name}`}
      style={{ animationDelay: `${180 + index * 90}ms` }}
    >
      <div className="theatre-character-portrait" aria-hidden="true">
        {character.image ? (
          <img src={character.image} alt="" />
        ) : (
          <span>{character.name.charAt(0)}</span>
        )}
      </div>
      <div className="theatre-character-card-index">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className={isOpen ? "status-open" : "status-closed"}>
          {isOpen ? "Vaga aberta" : "Vaga encerrada"}
        </span>
      </div>
      <div className="theatre-character-card-content">
        <p>{character.importance}</p>
        <h3>{character.name}</h3>
        <div className="theatre-character-card-meta">
          <span>{character.ageRange}</span>
          <span>{character.vacancies} vaga(s)</span>
        </div>
      </div>
      {applied && <span className="theatre-applied-mark">Candidatura enviada</span>}
    </button>
  );
}

export function CharacterModal({
  production,
  onClose,
  onApply,
  appliedCharacterIds,
}: CharacterModalProps) {
  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedCharacter) setSelectedCharacter(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, selectedCharacter]);

  const isOpen = selectedCharacter
    ? selectedCharacter.vacancies > 0
    : false;

  return (
    <div
      className="theatre-program-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="theatre-program"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theatre-program-title"
      >
        <header className="theatre-program-header">
          <button
            type="button"
            className="theatre-back-button"
            onClick={() =>
              selectedCharacter ? setSelectedCharacter(null) : onClose()
            }
            aria-label={
              selectedCharacter
                ? "Voltar à lista de personagens"
                : "Voltar à descoberta"
            }
          >
            <span aria-hidden="true">←</span>
            {selectedCharacter ? "Personagens" : "Descobrir"}
          </button>

          <div className="theatre-production-mark">
            <p>{production.company}</p>
            <h1 id="theatre-program-title">{production.title}</h1>
          </div>

          <button
            type="button"
            className="theatre-close-button"
            onClick={onClose}
            aria-label="Fechar personagens"
          >
            ×
          </button>
        </header>

        {!selectedCharacter ? (
          <main className="theatre-gallery" key="gallery">
            <div className="theatre-gallery-heading">
              <p>Elenco em formação</p>
              <h2>Os personagens</h2>
              <span>
                {production.roles.length}{" "}
                {production.roles.length === 1 ? "personagem" : "personagens"}{" "}
                disponíveis
              </span>
            </div>

            <div className="theatre-character-grid">
              {production.roles.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                  applied={appliedCharacterIds.includes(character.id)}
                  onSelect={setSelectedCharacter}
                />
              ))}
            </div>
          </main>
        ) : (
          <main className="theatre-character-detail" key={selectedCharacter.id}>
            <div className="theatre-detail-aside">
              <div className="theatre-detail-portrait" aria-hidden="true">
                {selectedCharacter.image ? (
                  <img src={selectedCharacter.image} alt="" />
                ) : (
                  <span>{selectedCharacter.name.charAt(0)}</span>
                )}
              </div>
              <span className="theatre-detail-number">
                {String(
                  production.roles.findIndex(
                    (character) => character.id === selectedCharacter.id,
                  ) + 1,
                ).padStart(2, "0")}
              </span>
              <span className="theatre-detail-rule" />
              <p>{selectedCharacter.importance}</p>
            </div>

            <article className="theatre-detail-content">
              <div className="theatre-detail-status">
                <span className={isOpen ? "status-open" : "status-closed"}>
                  {isOpen ? "Vaga aberta" : "Vaga encerrada"}
                </span>
                <span>{selectedCharacter.vacancies} vaga(s)</span>
              </div>

              <h2>{selectedCharacter.name}</h2>
              <p className="theatre-character-description">
                {selectedCharacter.description}
              </p>

              <dl className="theatre-character-facts">
                <div>
                  <dt>Faixa etária cênica</dt>
                  <dd>{selectedCharacter.ageRange}</dd>
                </div>
                <div>
                  <dt>Vagas disponíveis</dt>
                  <dd>{selectedCharacter.vacancies}</dd>
                </div>
              </dl>

              {selectedCharacter.requiredSkills.length > 0 && (
                <div className="theatre-skills">
                  <span>Habilidades relacionadas</span>
                  <div>
                    {selectedCharacter.requiredSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="theatre-requirements">
                <section>
                  <h3>Indispensáveis</h3>
                  {selectedCharacter.required.length > 0 ? (
                    <ul>
                      {selectedCharacter.required.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Não há requisitos indispensáveis informados.</p>
                  )}
                </section>
                <section>
                  <h3>Desejáveis</h3>
                  {selectedCharacter.desired.length > 0 ? (
                    <ul>
                      {selectedCharacter.desired.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Não há requisitos desejáveis informados.</p>
                  )}
                </section>
              </div>

              <button
                type="button"
                className="theatre-apply-button"
                onClick={() => onApply(selectedCharacter.id)}
                disabled={
                  !isOpen ||
                  appliedCharacterIds.includes(selectedCharacter.id)
                }
              >
                {!isOpen
                  ? "Seleção encerrada"
                  : appliedCharacterIds.includes(selectedCharacter.id)
                    ? "Candidatura registrada"
                    : "Candidatar-se ao personagem"}
              </button>
            </article>
          </main>
        )}
      </section>
    </div>
  );
}
