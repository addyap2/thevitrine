// The two founders of The Vitrine, for the About page (/a-propos/, /en/about/, /it/chi-siamo/).
// Written from what each of them says on their own site (antonyaddy.com,
// julienb.vercel.app) on 22 October 2026: keep it in step with those.
//
// photo: a path in public/ (e.g. "/people/antony.jpg", square, at least 480px),
// with a .webp copy next to it at the same name.
// Left null, the page shows a monogram instead.

type Text = { fr: string; en: string; it: string };
export interface Person {
  id: "antony" | "julien";
  /** The maker name used in projects.json, for counts and the portfolio filter. */
  maker: string;
  name: string;
  initials: string;
  photo: string | null;
  role: Text;
  place: Text;
  bio: { fr: string[]; en: string[]; it: string[] };
  facts: { fr: string[]; en: string[]; it: string[] };
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
    role: { fr: "Cofondateur de The Vitrine", en: "Co-founder of The Vitrine", it: "Cofondatore di The Vitrine" },
    place: { fr: "Fréjus · Côte d'Azur et à distance", en: "Fréjus · French Riviera and online", it: "Fréjus · Costa Azzurra e a distanza" },
    bio: {
      fr: [
        "Britannique de naissance, Antony vit et travaille en France depuis plus de vingt ans. Formateur Professionnel d'Adultes certifié depuis 2017, il forme d'abord à l'anglais professionnel, puis à l'IA générative.",
        "Aujourd'hui, au sein de The Vitrine, il met son métier de formateur au service du web : il conçoit avec l'IA des sites qui vont droit à l'essentiel, du restaurant de Fréjus au club de football de Bristol, et des plateformes d'apprentissage disponibles en une dizaine de langues.",
      ],
      en: [
        "Born British, Antony has lived and worked in France for more than twenty years. A certified adult trainer (Formateur Professionnel d'Adultes) since 2017, he trains people in professional English and in generative AI.",
        "Today, at The Vitrine, he brings a trainer's eye to the web, building websites with AI that get straight to the point, from a restaurant in Fréjus to a football club in Bristol, and learning platforms available in around ten languages.",
      ],
      it: [
        "Britannico di nascita, Antony vive e lavora in Francia da più di vent'anni. Formatore per adulti certificato (Formateur Professionnel d'Adultes) dal 2017, insegna inglese professionale e intelligenza artificiale generativa.",
        "Oggi, in The Vitrine, porta nel web lo sguardo del formatore: crea con l'IA siti che vanno dritti all'essenziale, dal ristorante di Fréjus al club di calcio di Bristol, e piattaforme di apprendimento disponibili in una decina di lingue.",
      ],
    },
    facts: {
      fr: ["Britannique, bilingue anglais–français", "Formateur certifié (FPA) depuis 2017", "Plus de 20 ans d'enseignement", "Sites, plateformes d'apprentissage, outils"],
      en: ["British, bilingual English–French", "Certified adult trainer since 2017", "More than 20 years of teaching", "Websites, learning platforms, tools"],
      it: ["Britannico, bilingue inglese–francese", "Formatore certificato dal 2017", "Più di 20 anni di insegnamento", "Siti, piattaforme di apprendimento, strumenti"],
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
    role: { fr: "Cofondateur de The Vitrine", en: "Co-founder of The Vitrine", it: "Cofondatore di The Vitrine" },
    place: { fr: "Du premier échange à la mise en ligne", en: "From the first call to launch", it: "Dal primo contatto alla messa online" },
    bio: {
      fr: [
        "Julien apporte à The Vitrine la conception et le développement sur mesure. Artisans, commerçants, thérapeutes, auteurs : il crée des sites rapides, pensés pour le téléphone, et faits pour donner envie d'appeler.",
        "Avec Antony, il suit une méthode en quatre étapes, sans surprise : un échange sur votre métier et vos objectifs avec un devis clair, une maquette ajustée ensemble avant la moindre ligne de code, le développement, puis la mise en ligne, avec un suivi pour la suite.",
      ],
      en: [
        "Julien brings made-to-measure design and development to The Vitrine. Tradespeople, shopkeepers, therapists, authors: he builds sites that are fast, made for phones and designed to make people want to call.",
        "With Antony, he follows a four-step method with no surprises: a conversation about your trade and your goals with a clear quote, a design agreed together before any code is written, development, then launch, with follow-up afterwards.",
      ],
      it: [
        "Julien porta in The Vitrine la progettazione e lo sviluppo su misura. Artigiani, commercianti, terapeuti, autori: crea siti veloci, pensati per il telefono e fatti per invogliare a chiamare.",
        "Con Antony segue un metodo in quattro tappe, senza sorprese: un confronto sul tuo mestiere e sui tuoi obiettivi con un preventivo chiaro, un prototipo definito insieme prima di scrivere una sola riga di codice, lo sviluppo, poi la messa online, con un seguito anche dopo.",
      ],
    },
    facts: {
      fr: ["Sites vitrines sur mesure", "Refontes et suivi après la mise en ligne", "Maquette validée avant le code", "Pensé pour le téléphone et pour Google"],
      en: ["Made-to-measure websites", "Redesigns and after-launch care", "Design agreed before any code", "Built for phones and for Google"],
      it: ["Siti vetrina su misura", "Restyling e assistenza dopo la messa online", "Prototipo approvato prima del codice", "Pensato per il telefono e per Google"],
    },
    site: { url: "https://julienb.vercel.app", label: "julienb.vercel.app" },
    contact: "https://julienb.vercel.app/#contact",
  },
];

/** What the two founders share: the "Ce qui nous rassemble" section. */
export const principles: { title: Text; text: Text }[] = [
  { title: { fr: "En direct, sans intermédiaire", en: "Direct, with no middlemen", it: "Diretti, senza intermediari" }, text: { fr: "Vous échangez directement avec Antony et Julien, ceux qui créent votre site, du premier échange à la mise en ligne.", en: "You deal directly with Antony and Julien, the people who build your site, from the first conversation to launch.", it: "Parli direttamente con Antony e Julien, le persone che creano il tuo sito, dal primo contatto alla messa online." } },
  { title: { fr: "L'IA comme outil, pas comme raccourci", en: "AI as a tool, not a shortcut", it: "L'IA come strumento, non come scorciatoia" }, text: { fr: "L'IA nous aide à concevoir et à construire plus vite ; chaque choix et chaque détail restent vérifiés à la main.", en: "AI helps us design and build faster; every choice and every detail is still checked by hand.", it: "L'IA ci aiuta a progettare e costruire più velocemente; ogni scelta e ogni dettaglio restano controllati a mano." } },
  { title: { fr: "Du sur-mesure, métier par métier", en: "Made to measure, trade by trade", it: "Su misura, mestiere per mestiere" }, text: { fr: "Une pizzeria, une auto-école et un club de football n'ont pas besoin du même site. Chacun part de votre activité.", en: "A pizzeria, a driving school and a football club don't need the same site. Each one starts from your business.", it: "Una pizzeria, una scuola guida e un club di calcio non hanno bisogno dello stesso sito. Ognuno parte dalla tua attività." } },
  { title: { fr: "Pensé pour le téléphone et pour Google", en: "Built for phones and for Google", it: "Pensato per il telefono e per Google" }, text: { fr: "Des pages rapides, des informations claires et les bases dont les moteurs de recherche ont besoin, dans les langues de vos visiteurs.", en: "Fast pages, clear information and the basics search engines need, in whatever languages your visitors speak.", it: "Pagine veloci, informazioni chiare e le basi di cui hanno bisogno i motori di ricerca, nelle lingue dei tuoi visitatori." } },
];
