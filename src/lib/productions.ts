export type FirstOpportunityLevel =
  | "Aceita iniciantes"
  | "Experiência desejável"
  | "Exige experiência";

export type Character = {
  id: number;
  name: string;
  description: string;
  image?: string;
  importance: "Principal" | "Coadjuvante" | "Ensemble";
  ageRange: string;
  vacancies: number;
  requiredSkills: string[];
  required: string[];
  desired: string[];
};

export type Production = {
  id: number;
  title: string;
  company: string;
  city: string;
  genre: string;
  description: string;
  image: string;
  roles: Character[];
  season: string;
  firstOpportunity: FirstOpportunityLevel;
};

export const productions: Production[] = [
  {
    id: 1,
    title: "O Nome do Papel",
    company: "Companhia Entrelinhas",
    city: "São Paulo, SP",
    genre: "Drama contemporâneo",
    description:
      "Uma montagem sobre memória, escolhas e os nomes que damos aos lugares que nos pertencem.",
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=85",
    roles: [
      {
        id: 11,
        name: "Lia",
        description: "Jovem observadora que volta à cidade natal para reconstruir a própria memória.",
        importance: "Principal",
        ageRange: "18 a 28 anos",
        vacancies: 1,
        requiredSkills: ["Interpretação", "Improvisação"],
        required: ["Disponibilidade integral para ensaios", "Experiência em palco"],
        desired: ["Conhecimento de movimento corporal"],
      },
      {
        id: 12,
        name: "Nora",
        description: "Mãe determinada, guardiã dos segredos da família.",
        importance: "Coadjuvante",
        ageRange: "45 a 60 anos",
        vacancies: 1,
        requiredSkills: ["Interpretação", "Dicção"],
        required: ["Disponibilidade para a temporada"],
        desired: ["Canto coral"],
      },
    ],
    season: "Ensaios em jan. · Estreia em mar.",
    firstOpportunity: "Aceita iniciantes",
  },
  {
    id: 2,
    title: "Cidade Invisível",
    company: "Coletivo Horizonte",
    city: "Recife, PE",
    genre: "Teatro físico",
    description:
      "Uma investigação coletiva sobre a cidade que passa despercebida e as pessoas que a tornam possível.",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85",
    roles: [
      {
        id: 21,
        name: "Pessoa Navegante",
        description: "Intérprete de movimento que representa os fluxos da cidade.",
        importance: "Ensemble",
        ageRange: "18 a 45 anos",
        vacancies: 4,
        requiredSkills: ["Teatro físico", "Dança"],
        required: ["Disponibilidade para ensaios coletivos"],
        desired: ["Capoeira", "Palhaçaria"],
      },
    ],
    season: "Ensaios em fev. · Estreia em abr.",
    firstOpportunity: "Experiência desejável",
  },
  {
    id: 3,
    title: "Cartas de Abril",
    company: "Projeto Cena Aberta",
    city: "Belo Horizonte, MG",
    genre: "Comédia dramática",
    description:
      "Três gerações trocam cartas que revelam afetos, silêncios e versões diferentes da mesma família.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85",
    roles: [
      {
        id: 31,
        name: "Inês",
        description: "Escreve cartas para entender relações que a vida não explica.",
        importance: "Principal",
        ageRange: "20 a 35 anos",
        vacancies: 1,
        requiredSkills: ["Interpretação", "Comédia"],
        required: ["Disponibilidade durante ensaios"],
        desired: ["Experiência com texto contemporâneo"],
      },
      {
        id: 32,
        name: "Lúcia",
        description: "Matriarca pragmática que esconde sua afetividade.",
        importance: "Coadjuvante",
        ageRange: "45 anos ou mais",
        vacancies: 1,
        requiredSkills: ["Interpretação"],
        required: ["Disponibilidade para a temporada"],
        desired: ["Experiência em comédia dramática"],
      },
    ],
    season: "Ensaios em mar. · Estreia em maio.",
    firstOpportunity: "Aceita iniciantes",
  },
  {
    id: 4,
    title: "Canções do Mar",
    company: "Teatro Bravio",
    city: "Salvador, BA",
    genre: "Musical",
    description:
      "Uma fábula musical onde cantigas populares encontram o mar e histórias de travessia.",
    image:
      "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=85",
    roles: [
      {
        id: 41,
        name: "Mariana",
        description: "Narra a travessia por meio da palavra e do canto.",
        importance: "Principal",
        ageRange: "25 a 40 anos",
        vacancies: 1,
        requiredSkills: ["Canto", "Interpretação"],
        required: ["Experiência profissional em musical", "Afinação"],
        desired: ["Leitura musical"],
      },
    ],
    season: "Ensaios em abr. · Estreia em jun.",
    firstOpportunity: "Exige experiência",
  },
];
