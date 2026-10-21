export const langs = ["en", "fr"] as const;
export type Lang = (typeof langs)[number];

// The home page path for each language.
export const homePath: Record<Lang, string> = { en: "/", fr: "/fr/" };

export const strings = {
  en: {
    title: "The Vitrine — websites and apps built with AI",
    description: "Websites and apps Antony Addy and Julien Bourgois have built with AI, all in one shop window.",
    heading: "Websites and apps we've built with AI.",
    lede: "A shop window of our work. Each one is live: click through and try it.",
    filterLabel: "Filter projects",
    everyone: "Everyone",
    all: "All",
    more: "More",
    projectOne: "project",
    projectMany: "projects",
    inProgress: "In progress",
    code: "Code",
    madeBy: "Made by",
    and: "and",
    switchTo: "Français",
    switchLabel: "Voir le site en français",
    empty: "Nothing in the window yet.",
  },
  fr: {
    title: "The Vitrine — sites et applis créés avec l'IA",
    description: "Les sites et applications qu'Antony Addy et Julien Bourgois ont créés avec l'IA, réunis dans une seule vitrine.",
    heading: "Des sites et des applis créés avec l'IA.",
    lede: "La vitrine de notre travail. Tout est en ligne : cliquez et essayez.",
    filterLabel: "Filtrer les projets",
    everyone: "Tous",
    all: "Toutes",
    more: "Autres",
    projectOne: "projet",
    projectMany: "projets",
    inProgress: "En cours",
    code: "Code",
    madeBy: "Réalisé par",
    and: "et",
    switchTo: "English",
    switchLabel: "View the site in English",
    empty: "La vitrine est encore vide.",
  },
} satisfies Record<Lang, Record<string, string>>;
