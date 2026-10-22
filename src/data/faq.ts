// Homepage FAQ, in both languages. Answers only state what the portfolio,
// the services copy and the contact cards already establish.
//
// An answer left as null is a placeholder: the question stays off the page
// (and out of the structured data) and the build log lists it, until it's
// written. Price and timescale come from src/data/business.ts.

import { priceFrom, timescale } from "./business";

type Text = { fr: string; en: string };
export interface Faq {
  id: string;
  q: Text;
  a: Text | null;
}

const fmtPrice = (lang: "fr" | "en") => (priceFrom === null ? "" : priceFrom.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB"));

export const faq: Faq[] = [
  {
    id: "price",
    q: { fr: "Combien coûte un site vitrine ?", en: "How much does a website cost?" },
    a: {
      fr:
        "Chaque site est chiffré sur mesure, selon le nombre de pages et les fonctions dont vous avez besoin (menu, réservation, plusieurs langues…). Le premier échange est gratuit, et vous recevez un devis clair avant tout engagement." +
        (priceFrom !== null ? ` À titre indicatif, comptez à partir de ${fmtPrice("fr")} €.` : ""),
      en:
        "Every site is priced to fit, depending on the number of pages and the features you need (menu, booking, several languages…). The first conversation is free, and you get a clear quote before committing to anything." +
        (priceFrom !== null ? ` As a guide, sites start from €${fmtPrice("en")}.` : ""),
    },
  },
  {
    id: "time",
    q: { fr: "En combien de temps mon site sera-t-il en ligne ?", en: "How long until my site is live?" },
    a: {
      fr:
        (timescale ? `Comptez en général ${timescale.fr} pour un site vitrine. ` : "") +
        "Le délai dépend surtout du nombre de pages et de la rapidité avec laquelle nous recevons vos textes et vos photos. Il est précisé dans le devis.",
      en:
        (timescale ? `A showcase site usually takes ${timescale.en}. ` : "") +
        "It depends mostly on the number of pages and how quickly we receive your text and photos. The timescale is set out in the quote.",
    },
  },
  {
    id: "who",
    q: { fr: "Qui contacter : Antony ou Julien ?", en: "Who should I contact, Antony or Julien?" },
    a: {
      fr: "L'un ou l'autre : vous échangez ensuite directement avec la personne qui crée votre site. Antony propose aussi des formations d'anglais et d'IA, dans le Var et les Alpes-Maritimes ; Julien crée des sites sur mesure pour les artisans, commerces et indépendants. Les deux liens sont en bas de cette page.",
      en: "Either of us: you then deal directly with the person who builds your site. Antony also runs English and AI training in the Var and Alpes-Maritimes; Julien builds made-to-measure sites for tradespeople, shops and independents. Both links are at the bottom of this page.",
    },
  },
  {
    id: "ai",
    q: { fr: "Un site créé avec l'IA, c'est un site générique ?", en: "If you use AI, is my site generic?" },
    a: {
      fr: "Non. L'IA nous aide à concevoir et à construire plus vite, mais chaque site est pensé pour son activité : comparez la pizzeria, l'auto-école et le club de football de cette vitrine. Nous vérifions et peaufinons chaque détail à la main.",
      en: "No. AI helps us design and build faster, but every site is made for its business: compare the pizzeria, the driving school and the football club in this window. We check and polish every detail by hand.",
    },
  },
  {
    id: "mobile",
    q: { fr: "Mon site fonctionnera-t-il sur téléphone ?", en: "Will my site work on phones?" },
    a: {
      fr: "Oui. La plupart de vos visiteurs arriveront depuis un téléphone : nos sites sont conçus d'abord pour le mobile, rapides à charger, avec l'appel, l'itinéraire ou la réservation à portée de pouce.",
      en: "Yes. Most of your visitors will arrive on a phone, so our sites are designed for mobile first and load fast, with calling, directions or booking within thumb's reach.",
    },
  },
  {
    id: "google",
    q: { fr: "Mon site sera-t-il bien référencé sur Google ?", en: "Will my site rank on Google?" },
    a: {
      fr: "Nous construisons des sites rapides, bien structurés et décrits pour les moteurs de recherche : titres, descriptions, données structurées, adresse et horaires bien visibles. Personne ne peut garantir une première place sur Google, mais ces bases donnent à votre site toutes ses chances, surtout combinées à une fiche Google Business Profile.",
      en: "We build sites that are fast, well structured and described for search engines: titles, descriptions, structured data, and your address and hours clearly shown. Nobody can guarantee the top spot on Google, but these foundations give your site every chance, especially alongside a Google Business Profile.",
    },
  },
  {
    id: "features",
    q: { fr: "Pouvez-vous ajouter un menu, la réservation ou la commande en ligne ?", en: "Can you add a menu, booking or online ordering?" },
    a: {
      fr: "Oui : plusieurs sites de cette vitrine ont une carte complète, un menu de la semaine, la réservation de table ou de rendez-vous, ou la commande à emporter. Dites-nous comment vos clients vous contactent aujourd'hui, et nous partons de là.",
      en: "Yes: several sites in this window have a full menu, a weekly menu, table or appointment booking, or takeaway ordering. Tell us how your customers reach you today and we'll start from there.",
    },
  },
  {
    id: "languages",
    q: { fr: "Mon site peut-il être en plusieurs langues ?", en: "Can my site be in several languages?" },
    a: {
      fr: "Oui, dans toutes les langues dont vos visiteurs ont besoin : le Ristorante da Lola, par exemple, existe en italien, anglais, français et allemand. Pratique sur la Côte d'Azur, où une partie de vos clients ne parle pas français.",
      en: "Yes, in whatever languages your visitors need: Ristorante da Lola, for example, is in Italian, English, French and German. Handy on the French Riviera, where some of your customers won't speak French.",
    },
  },
  {
    id: "where",
    q: { fr: "Travaillez-vous en dehors du Var ?", en: "Do you work outside the Var?" },
    a: {
      fr: "Oui. Nous travaillons dans tout le Var et les Alpes-Maritimes, et tout peut aussi se faire à distance : nos sites tournent déjà au Royaume-Uni et en Italie.",
      en: "Yes. We work across the Var and Alpes-Maritimes, and everything can also be done remotely: our sites already run in the United Kingdom and Italy.",
    },
  },
  // Placeholders: write the answer to show the question.
  {
    id: "hosting",
    q: { fr: "Qui s'occupe de l'hébergement et du nom de domaine ?", en: "Who looks after hosting and the domain name?" },
    a: null,
  },
  {
    id: "edits",
    q: { fr: "Pourrai-je modifier mon site moi-même ?", en: "Can I update my site myself?" },
    a: null,
  },
  {
    id: "support",
    q: { fr: "Que se passe-t-il après la mise en ligne ?", en: "What happens after the site goes live?" },
    a: null,
  },
];

export const missingFaqAnswers = () => faq.filter((f) => f.a === null).map((f) => f.id);
