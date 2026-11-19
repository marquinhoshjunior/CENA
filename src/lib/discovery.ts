export type DiscoveryAction = "interested" | "passed";

export type DiscoveryDecision = {
  productionId: number;
  action: DiscoveryAction;
  decidedAt: string;
};

export type DiscoveryRepository = {
  listInterests: () => DiscoveryDecision[];
  saveDecision: (decision: DiscoveryDecision) => void;
};

const STORAGE_KEY = "cena-discovery-decisions";

export function readDiscoveryDecisions(): DiscoveryDecision[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as DiscoveryDecision[]) : [];
  } catch {
    return [];
  }
}

export function saveDiscoveryDecision(decision: DiscoveryDecision) {
  if (typeof window === "undefined") return;

  const decisions = readDiscoveryDecisions();
  const next = [
    ...decisions.filter(
      (item) => item.productionId !== decision.productionId,
    ),
    decision,
  ];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export const discoveryRepository: DiscoveryRepository = {
  listInterests: readDiscoveryDecisions,
  saveDecision: saveDiscoveryDecision,
};
