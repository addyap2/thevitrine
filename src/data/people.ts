// The two makers behind The Vitrine, for the About page (/a-propos/, /en/about/).
// Written from what each of them says on their own site (antonyaddy.com,
// julienb.vercel.app) on 22 October 2026: keep it in step with those.
//
// photo: a path in public/ (e.g. "/people/antony.jpg", square, at least 480px),
// with a .webp copy next to it at the same name.
// Left null, the page shows a monogram instead.

type Text = { fr: string; en: string };
export interface Person {
  id: "antony" | "julien";
  /** The maker name used in projects.json, for counts and the portfolio filter. */
  maker: string;
  name: string;
  initials: string;
  photo: string | null;
  role: Text;
  place: Text;
  bio: { fr: string[]; en: string[] };
  facts: { fr: string[]; en: string[] };
  site: { url: string; label: string };
  /** Contact page on their own site, used when WhatsApp can't open. */
  contact: string;
}

export const people: Person[] = [
  {
    id: "antony",
    maker: "Antony",
    name: "Antony Addy",
    initials: "AA",
    photo: "/people/antony.jpg",
    role: { fr: "Formateur, créateur de sites et d'outils avec l'IA", en: "Trainer, and builder of websites and learning tools with AI" },
    place: { fr: "Fréjus · Côte d'Azur et à distance", en: "Fréjus · French Riviera and online" },
    bio: {
      fr: [
        "Britannique de naissance, Antony vit et travaille en France depuis plus de vingt ans. Formateur Professionnel d'Adultes certifié depuis 2017, il forme d'abord à l'anglais professionnel, puis à l'IA générative.",
        "Aujourd'hui, il conçoit aussi avec l'IA des sites et des outils pédagogiques : des sites de restaurants, de clubs et de praticiens, et des plateformes pour apprendre l'anglais, souvent en plusieurs langues.",
      ],
      en: [
        "Born British, Antony has lived and worked in France for more than twenty years. A certified adult trainer (Formateur Professionnel d'Adultes) since 2017, he trains people in professional English and in generative AI.",
        "Today he also builds websites and learning tools with AI: sites for restaurants, clubs and practitioners, and platforms for learning English, often in several languages.",
      ],
    },
    facts: {
      fr: ["Britannique, bilingue anglais–français", "Formateur certifié (FPA) depuis 2017", "Plus de 20 ans d'enseignement", "Sites, plateformes d'apprentissage, outils"],
      en: ["British, bilingual English–French", "Certified adult trainer since 2017", "More than 20 years of teaching", "Websites, learning platforms, tools"],
    },
    site: { url: "https://www.antonyaddy.com", label: "antonyaddy.com" },
    contact: "https://www.antonyaddy.com/contact?sujet=sites",
  },
  {
    id: "julien",
    maker: "Julien",
    name: "Julien Bourgois",
    initials: "JB",
    photo: "/people/julien.jpg",
    role: { fr: "Studio web indépendant : conception et développement", en: "Independent web studio: design and development" },
    place: { fr: "Du premier échange à la mise en ligne", en: "From the first call to launch" },
    bio: {
      fr: [
        "Julien conçoit et développe des sites vitrines sur mesure pour les artisans, les commerçants, les thérapeutes et les auteurs : rapides, pensés pour le téléphone, et faits pour donner envie de vous appeler.",
        "Sa méthode tient en quatre étapes, sans surprise : un échange sur votre métier et vos objectifs avec un devis clair, une maquette ajustée ensemble avant la moindre ligne de code, le développement, puis la mise en ligne, avec un suivi pour la suite.",
      ],
      en: [
        "Julien designs and builds made-to-measure websites for tradespeople, shopkeepers, therapists and authors: fast, made for phones, and designed to make people want to call.",
        "His method has four steps and no surprises: a conversation about your trade and your goals with a clear quote, a design agreed together before any code is written, development, then launch, with follow-up afterwards.",
      ],
    },
    facts: {
      fr: ["Sites vitrines sur mesure", "Refontes et suivi après la mise en ligne", "Maquette validée avant le code", "Pensé pour le téléphone et pour Google"],
      en: ["Made-to-measure websites", "Redesigns and after-launch care", "Design agreed before any code", "Built for phones and for Google"],
    },
    site: { url: "https://julienb.vercel.app", label: "julienb.vercel.app" },
    contact: "https://julienb.vercel.app/#contact",
  },
];

/** What both makers share: the "Ce qui nous rassemble" section. */
export const principles: { title: Text; text: Text }[] = [
  { title: { fr: "Un seul interlocuteur", en: "One person to talk to" }, text: { fr: "Vous échangez directement avec la personne qui crée votre site, du premier échange à la mise en ligne. Pas d'intermédiaire.", en: "You deal directly with whoever builds your site, from the first conversation to launch. No middlemen." } },
  { title: { fr: "L'IA comme outil, pas comme raccourci", en: "AI as a tool, not a shortcut" }, text: { fr: "L'IA nous aide à concevoir et à construire plus vite ; chaque choix et chaque détail restent vérifiés à la main.", en: "AI helps us design and build faster; every choice and every detail is still checked by hand." } },
  { title: { fr: "Du sur-mesure, métier par métier", en: "Made to measure, trade by trade" }, text: { fr: "Une pizzeria, une auto-école et un club de football n'ont pas besoin du même site. Chacun part de votre activité.", en: "A pizzeria, a driving school and a football club don't need the same site. Each one starts from your business." } },
  { title: { fr: "Pensé pour le téléphone et pour Google", en: "Built for phones and for Google" }, text: { fr: "Des pages rapides, des informations claires et les bases dont les moteurs de recherche ont besoin, dans les langues de vos visiteurs.", en: "Fast pages, clear information and the basics search engines need, in whatever languages your visitors speak." } },
];
