// Service pages and area pages, in French, English and Italian.
// Each entry becomes one page per language (src/pages/[offer].astro and its
// /en/ and /it/ twins). Copy states only what the portfolio, the FAQ and the
// case studies already establish.

type T = { fr: string; en: string; it: string };
type List = { fr: string[]; en: string[]; it: string[] };

export interface Offer {
  key: string;
  kind: "service" | "zone";
  slug: T;
  /** Short name for menus and link lists. */
  nav: T;
  /** Page heading. */
  title: T;
  /** Search title (" | The Vitrine" is added). */
  seoTitle: T;
  /** Meta description (under 160 characters). */
  description: T;
  /** Opening line under the heading. */
  intro: T;
  points: List;
  sections: { h: T; p: T }[];
  /** Project slugs (projects.json) shown as examples. */
  cases: string[];
  /** FAQ ids (src/data/faq.ts) answered on the page. */
  faq: string[];
  /** Blog article key linked from the page (French and English only). */
  blog?: string;
}

export const offers: Offer[] = [
  {
    key: "creation",
    kind: "service",
    slug: { fr: "creation-site-internet", en: "website-design", it: "creazione-siti-web" },
    nav: { fr: "Création de site", en: "Website design", it: "Creazione di siti" },
    title: { fr: "Création de site internet sur mesure", en: "Made-to-measure website design", it: "Creazione di siti web su misura" },
    seoTitle: { fr: "Création de site internet sur mesure", en: "Made-to-measure website design", it: "Creazione di siti web su misura" },
    description: {
      fr: "Un site rapide et sur mesure, pensé pour vendre : visible sur Google, parfait sur mobile, dans la langue de vos clients. Devis gratuit.",
      en: "A fast, made-to-measure website built to sell: found on Google, flawless on phones, in your customers' language. Free quote.",
      it: "Un sito veloce e su misura, pensato per vendere: visibile su Google, perfetto sul telefono, nella lingua dei tuoi clienti. Preventivo gratuito.",
    },
    intro: {
      fr: "Un site qui ressemble à votre activité et qui fait son travail : donner envie, rassurer, faire appeler.",
      en: "A website that looks like your business and does its job: makes people want to come, reassures them, gets them to call.",
      it: "Un sito che somiglia alla tua attività e fa il suo lavoro: invoglia, rassicura, fa chiamare.",
    },
    points: {
      fr: ["Un design sur mesure, à partir de votre métier et de vos clients", "Des textes rédigés pour vous, à partir de nos échanges", "Un site pensé d'abord pour le téléphone", "Les bases du référencement Google dès la mise en ligne", "Une ou plusieurs langues, selon vos visiteurs", "Menu, réservation, commande ou demande de devis, si besoin"],
      en: ["A bespoke design, starting from your trade and your customers", "Copy written for you, from our conversations", "A site designed for phones first", "Google foundations in place from launch", "One language or several, depending on your visitors", "Menu, booking, ordering or quote requests, if you need them"],
      it: ["Un design su misura, a partire dal tuo mestiere e dai tuoi clienti", "Testi scritti per te, a partire dai nostri scambi", "Un sito pensato prima di tutto per il telefono", "Le basi della SEO su Google fin dalla messa online", "Una o più lingue, secondo i tuoi visitatori", "Menu, prenotazioni, ordini o richieste di preventivo, se servono"],
    },
    sections: [
      {
        h: { fr: "Pour chaque métier", en: "For every trade", it: "Per ogni mestiere" },
        p: {
          fr: "Restaurants, artisans, commerces, praticiens, clubs, associations, formateurs, auteurs : chaque site part de votre activité, jamais d'un modèle.",
          en: "Restaurants, tradespeople, shops, practitioners, clubs, associations, trainers, authors: every site starts from your business, never from a template.",
          it: "Ristoranti, artigiani, negozi, professionisti, club, associazioni, formatori, autori: ogni sito parte dalla tua attività, mai da un modello.",
        },
      },
      {
        h: { fr: "Du premier échange à la mise en ligne", en: "From the first call to launch", it: "Dal primo contatto alla messa online" },
        p: {
          fr: "Un premier échange gratuit, un devis clair, une première version à tester sur votre téléphone, puis les ajustements jusqu'à ce que ce soit juste. Vous parlez directement avec Antony et Julien.",
          en: "A free first conversation, a clear quote, a first version to try on your phone, then adjustments until it's right. You talk directly to Antony and Julien.",
          it: "Un primo contatto gratuito, un preventivo chiaro, una prima versione da provare sul telefono, poi le modifiche finché è perfetto. Parli direttamente con Antony e Julien.",
        },
      },
    ],
    cases: ["wall-street", "autoecole", "stephanie"],
    faq: ["price", "time", "mobile"],
    blog: "our-process",
  },
  {
    key: "redesign",
    kind: "service",
    slug: { fr: "refonte-site-internet", en: "website-redesign", it: "rifacimento-sito-web" },
    nav: { fr: "Refonte de site", en: "Website redesign", it: "Rifacimento del sito" },
    title: { fr: "Refonte de site internet", en: "Website redesign", it: "Rifacimento del sito web" },
    seoTitle: { fr: "Refonte de site internet", en: "Website redesign", it: "Rifacimento del sito web" },
    description: {
      fr: "Votre site a vieilli ? Nous le refaisons rapide, lisible sur mobile et mieux placé sur Google, sans perdre votre nom de domaine ni vos visiteurs.",
      en: "Has your website aged? We rebuild it fast, readable on phones and better placed on Google, without losing your domain name or your visitors.",
      it: "Il tuo sito è invecchiato? Lo rifacciamo veloce, leggibile sul telefono e meglio posizionato su Google, senza perdere il dominio né i visitatori.",
    },
    intro: {
      fr: "Lent, illisible sur téléphone, impossible à modifier : un site vieillissant fait fuir des clients. On le reprend, sans repartir de zéro.",
      en: "Slow, hard to read on a phone, impossible to update: an ageing site drives customers away. We take it over, without starting from scratch.",
      it: "Lento, illeggibile sul telefono, impossibile da modificare: un sito invecchiato fa scappare i clienti. Lo riprendiamo, senza ripartire da zero.",
    },
    points: {
      fr: ["Un site neuf, rapide et pensé pour le téléphone", "Vos meilleurs textes, photos et avis conservés", "Votre nom de domaine conservé", "Des redirections pour garder votre place sur Google", "Des mises à jour simples ensuite, par vous ou par nous"],
      en: ["A new site, fast and designed for phones", "Your best copy, photos and reviews kept", "Your domain name kept", "Redirects so you keep your place on Google", "Easy updates afterwards, by you or by us"],
      it: ["Un sito nuovo, veloce e pensato per il telefono", "I tuoi testi, foto e recensioni migliori conservati", "Il tuo nome di dominio conservato", "Reindirizzamenti per mantenere la tua posizione su Google", "Aggiornamenti semplici in seguito, da te o da noi"],
    },
    sections: [
      {
        h: { fr: "Les signes qui ne trompent pas", en: "The signs that don't lie", it: "I segnali che non sbagliano" },
        p: {
          fr: "Un site lent, difficile à lire sur mobile, aux informations dépassées ou introuvable sur Google perd des clients chaque jour. Si vous vous y reconnaissez, il est temps.",
          en: "A site that's slow, hard to read on a phone, out of date or nowhere on Google loses customers every day. If that sounds familiar, it's time.",
          it: "Un sito lento, difficile da leggere sul telefono, con informazioni superate o introvabile su Google perde clienti ogni giorno. Se ti ci riconosci, è il momento.",
        },
      },
      {
        h: { fr: "Sans rien perdre", en: "Without losing anything", it: "Senza perdere nulla" },
        p: {
          fr: "Quand les adresses des pages changent, nous mettons en place des redirections : les anciens liens mènent aux nouvelles pages, et Google suit.",
          en: "When page addresses change, we set up redirects: old links lead to the new pages, and Google follows.",
          it: "Quando cambiano gli indirizzi delle pagine, impostiamo i reindirizzamenti: i vecchi link portano alle nuove pagine, e Google segue.",
        },
      },
    ],
    cases: ["so-good-diner", "planb-global-connect", "E-Mconcept"],
    faq: ["hosting", "edits", "google"],
    blog: "redesign-signs",
  },
  {
    key: "maintenance",
    kind: "service",
    slug: { fr: "maintenance-site-internet", en: "website-maintenance", it: "manutenzione-sito-web" },
    nav: { fr: "Maintenance", en: "Maintenance", it: "Manutenzione" },
    title: { fr: "Maintenance et mises à jour de site", en: "Website maintenance and updates", it: "Manutenzione e aggiornamenti del sito" },
    seoTitle: { fr: "Maintenance et mises à jour de site internet", en: "Website maintenance and updates", it: "Manutenzione e aggiornamenti del sito web" },
    description: {
      fr: "Un nouveau menu, des horaires d'été, une nouvelle page : avec notre abonnement, vous envoyez un message, nous mettons votre site à jour.",
      en: "A new menu, summer hours, a new page: with our subscription, you send a message and we update your website.",
      it: "Un nuovo menu, gli orari estivi, una nuova pagina: con il nostro abbonamento mandi un messaggio e aggiorniamo noi il sito.",
    },
    intro: {
      fr: "Un site vit. Pour qu'il reste juste et rapide, vous le mettez à jour vous-même, ou vous nous le confiez.",
      en: "A website keeps changing. To keep it accurate and fast, you update it yourself, or you leave it to us.",
      it: "Un sito vive. Perché resti preciso e veloce, lo aggiorni tu, oppure lo affidi a noi.",
    },
    points: {
      fr: ["Vos textes, horaires, menus et photos mis à jour sur simple message", "Petites évolutions : nouvelle section, nouvelle page, nouvelle langue", "Hébergement chez Vercel et nom de domaine chez OVH, gérés pour vous", "Mises à jour techniques et sécurité", "Un forfait mensuel sur mesure, selon vos besoins"],
      en: ["Your copy, hours, menus and photos updated on request", "Small changes: a new section, a new page, a new language", "Hosting on Vercel and domain name with OVH, handled for you", "Technical updates and security", "A tailored monthly package, to suit your needs"],
      it: ["Testi, orari, menu e foto aggiornati con un semplice messaggio", "Piccole evoluzioni: una nuova sezione, una nuova pagina, una nuova lingua", "Hosting su Vercel e dominio su OVH, gestiti per te", "Aggiornamenti tecnici e sicurezza", "Un pacchetto mensile su misura, secondo le tue esigenze"],
    },
    sections: [
      {
        h: { fr: "Vous préférez le faire vous-même ?", en: "Rather do it yourself?", it: "Preferisci farlo da solo?" },
        p: {
          fr: "C'est possible : vous mettez à jour vous-même vos textes, horaires ou photos. Et pour le reste, un message suffit.",
          en: "You can: update your copy, hours or photos yourself. For everything else, a message is enough.",
          it: "Si può: aggiorni tu testi, orari o foto. Per tutto il resto basta un messaggio.",
        },
      },
      {
        h: { fr: "Les mêmes interlocuteurs", en: "The same people to talk to", it: "Le stesse persone a cui scrivere" },
        p: {
          fr: "Pas de ticket, pas de standard : vous écrivez à ceux qui ont créé votre site, Antony et Julien, sur WhatsApp ou par e-mail.",
          en: "No tickets, no switchboard: you write to the people who built your site, Antony and Julien, on WhatsApp or by email.",
          it: "Niente ticket, niente centralino: scrivi a chi ha creato il tuo sito, Antony e Julien, su WhatsApp o via e-mail.",
        },
      },
    ],
    cases: ["wall-street", "ristorante-lola", "filton-athletic-fc"],
    faq: ["edits", "support", "hosting"],
    blog: "domain-hosting",
  },
  {
    key: "local-seo",
    kind: "service",
    slug: { fr: "referencement-local", en: "local-seo", it: "seo-locale" },
    nav: { fr: "Référencement local", en: "Local SEO", it: "SEO locale" },
    title: { fr: "Référencement local sur Google", en: "Local SEO on Google", it: "SEO locale su Google" },
    seoTitle: { fr: "Référencement local sur Google", en: "Local SEO on Google", it: "SEO locale su Google" },
    description: {
      fr: "Apparaître quand on cherche votre métier près de chez vous : un site bien construit, une fiche Google soignée, et les deux qui travaillent ensemble.",
      en: "Show up when people search for your trade nearby: a well-built site, a well-kept Google listing, and the two working together.",
      it: "Comparire quando si cerca il tuo mestiere in zona: un sito ben costruito, una scheda Google curata, e i due che lavorano insieme.",
    },
    intro: {
      fr: "« Restaurant Fréjus », « électricien Var » : vos clients cherchent déjà. Ils doivent tomber sur vous.",
      en: "\"Restaurant Fréjus\", \"electrician Var\": your customers are already searching. They should land on you.",
      it: "«Ristorante Fréjus», «elettricista Var»: i tuoi clienti stanno già cercando. Devono trovare te.",
    },
    points: {
      fr: ["Titres et descriptions écrits pour la recherche, page par page", "Une page par service, et par ville quand c'est utile", "Données structurées : adresse, horaires, type d'activité", "Inscription à Google Search Console", "Votre fiche Google reliée à votre site"],
      en: ["Titles and descriptions written for search, page by page", "A page per service, and per town where it helps", "Structured data: address, hours, type of business", "Registration with Google Search Console", "Your Google listing linked to your site"],
      it: ["Titoli e descrizioni scritti per la ricerca, pagina per pagina", "Una pagina per servizio, e per città quando serve", "Dati strutturati: indirizzo, orari, tipo di attività", "Registrazione su Google Search Console", "La tua scheda Google collegata al sito"],
    },
    sections: [
      {
        h: { fr: "Le site et la fiche Google, ensemble", en: "Your site and your Google listing, together", it: "Il sito e la scheda Google, insieme" },
        p: {
          fr: "La fiche Google vous place sur la carte, le site convainc. Nous construisons le site pour que Google comprenne votre métier et votre zone, et nous relions les deux.",
          en: "Your Google listing puts you on the map; your site wins people over. We build the site so Google understands your trade and your area, and we link the two.",
          it: "La scheda Google ti mette sulla mappa, il sito convince. Costruiamo il sito perché Google capisca il tuo mestiere e la tua zona, e colleghiamo i due.",
        },
      },
      {
        h: { fr: "Bien commencer", en: "A good start", it: "Partire bene" },
        p: {
          fr: "Vérifiez vos horaires, votre catégorie et vos photos sur votre fiche Google, et demandez des avis à vos clients. Le reste, on s'en occupe.",
          en: "Check your hours, category and photos on your Google listing, and ask customers for reviews. We'll take care of the rest.",
          it: "Controlla orari, categoria e foto sulla tua scheda Google, e chiedi recensioni ai clienti. Al resto pensiamo noi.",
        },
      },
    ],
    cases: ["autoecole", "stephanie", "wall-street"],
    faq: ["google", "mobile"],
    blog: "local-google",
  },
  {
    key: "apps",
    kind: "service",
    slug: { fr: "applications-sur-mesure", en: "custom-web-apps", it: "applicazioni-su-misura" },
    nav: { fr: "Applications sur mesure", en: "Custom web apps", it: "Applicazioni su misura" },
    title: { fr: "Applications et outils web sur mesure", en: "Custom web apps and tools", it: "Applicazioni e strumenti web su misura" },
    seoTitle: { fr: "Applications et outils web sur mesure", en: "Custom web apps and tools", it: "Applicazioni e strumenti web su misura" },
    description: {
      fr: "Plateformes d'apprentissage, espaces privés, outils métier : quand un site ne suffit pas, nous créons l'outil qu'il vous faut, en plusieurs langues.",
      en: "Learning platforms, private areas, business tools: when a website isn't enough, we build the tool you need, in several languages.",
      it: "Piattaforme di apprendimento, aree riservate, strumenti di lavoro: quando un sito non basta, creiamo lo strumento che ti serve, in più lingue.",
    },
    intro: {
      fr: "Exercices interactifs, coach IA, suivi d'apprenants : nous construisons aussi des outils web complets, pensés pour ceux qui s'en servent.",
      en: "Interactive exercises, an AI coach, learner tracking: we also build complete web tools, designed for the people who use them.",
      it: "Esercizi interattivi, coach IA, monitoraggio degli allievi: costruiamo anche strumenti web completi, pensati per chi li usa.",
    },
    points: {
      fr: ["Plateformes d'apprentissage, avec exercices et corrections automatiques", "Conversation avec l'IA, à l'écrit comme à l'oral", "Espaces privés avec connexion par e-mail ou Google", "Interfaces en plusieurs langues, jusqu'à douze", "Outils métier et tableaux de bord sur mesure"],
      en: ["Learning platforms, with exercises and automatic marking", "AI conversation, written or spoken", "Private areas with sign-in by email or Google", "Interfaces in several languages, up to twelve", "Bespoke business tools and dashboards"],
      it: ["Piattaforme di apprendimento, con esercizi e correzione automatica", "Conversazione con l'IA, scritta o a voce", "Aree riservate con accesso via e-mail o Google", "Interfacce in più lingue, fino a dodici", "Strumenti di lavoro e dashboard su misura"],
    },
    sections: [
      {
        h: { fr: "Nés de la formation", en: "Born in the classroom", it: "Nati dalla formazione" },
        p: {
          fr: "Antony est formateur certifié depuis 2017, et plusieurs de ces plateformes servent ses propres stagiaires. Nous savons ce qu'un outil doit faire pour être utilisé.",
          en: "Antony has been a certified trainer since 2017, and several of these platforms serve his own learners. We know what a tool has to do to get used.",
          it: "Antony è formatore certificato dal 2017, e diverse di queste piattaforme servono i suoi allievi. Sappiamo cosa deve fare uno strumento per essere usato.",
        },
      },
    ],
    cases: ["toeic-success-hub", "speakup-ai-english-trainer", "student-mark-tracker"],
    faq: ["ai", "languages"],
    blog: "training-website",
  },
  {
    key: "frejus",
    kind: "zone",
    slug: { fr: "creation-site-internet-frejus-saint-raphael", en: "web-design-frejus-saint-raphael", it: "siti-web-frejus-saint-raphael" },
    nav: { fr: "Fréjus & Saint-Raphaël", en: "Fréjus & Saint-Raphaël", it: "Fréjus e Saint-Raphaël" },
    title: { fr: "Création de site internet à Fréjus et Saint-Raphaël", en: "Web design in Fréjus and Saint-Raphaël", it: "Siti web a Fréjus e Saint-Raphaël" },
    seoTitle: { fr: "Création de site internet à Fréjus et Saint-Raphaël", en: "Web design in Fréjus and Saint-Raphaël", it: "Siti web a Fréjus e Saint-Raphaël" },
    description: {
      fr: "Sites sur mesure pour les entreprises, commerces et associations de Fréjus, Saint-Raphaël et alentours. Une équipe basée à Fréjus, un devis gratuit.",
      en: "Made-to-measure websites for businesses, shops and associations in Fréjus, Saint-Raphaël and nearby. A Fréjus-based team, a free quote.",
      it: "Siti su misura per aziende, negozi e associazioni di Fréjus, Saint-Raphaël e dintorni. Un team con sede a Fréjus, preventivo gratuito.",
    },
    intro: {
      fr: "The Vitrine est basée à Fréjus. Vos rues, vos saisons et vos clients, touristes compris, nous les connaissons.",
      en: "The Vitrine is based in Fréjus. We know your streets, your seasons and your customers, tourists included.",
      it: "The Vitrine ha sede a Fréjus. Conosciamo le tue strade, le tue stagioni e i tuoi clienti, turisti compresi.",
    },
    points: {
      fr: ["Sites pour restaurants, commerces, artisans et praticiens", "Versions en anglais, italien ou allemand pour les visiteurs", "Référencement local : Fréjus, Saint-Raphaël, Puget-sur-Argens, Roquebrune-sur-Argens…", "Fiche Google et site qui travaillent ensemble"],
      en: ["Sites for restaurants, shops, tradespeople and practitioners", "English, Italian or German versions for visitors", "Local SEO: Fréjus, Saint-Raphaël, Puget-sur-Argens, Roquebrune-sur-Argens…", "Your Google listing and your site working together"],
      it: ["Siti per ristoranti, negozi, artigiani e professionisti", "Versioni in inglese, italiano o tedesco per i visitatori", "SEO locale: Fréjus, Saint-Raphaël, Puget-sur-Argens, Roquebrune-sur-Argens…", "Scheda Google e sito che lavorano insieme"],
    },
    sections: [
      {
        h: { fr: "Déjà en ligne ici", en: "Already live here", it: "Già online qui" },
        p: {
          fr: "Le pub Wall Street et le So Good Diner à Fréjus, l'auto-école La Tour de Mare, SR Bien-être à Saint-Raphaël : plusieurs sites de notre vitrine sont à quelques rues de chez vous.",
          en: "The Wall Street pub and So Good Diner in Fréjus, the La Tour de Mare driving school, SR Bien-être in Saint-Raphaël: several sites in our window are just a few streets away.",
          it: "Il pub Wall Street e il So Good Diner a Fréjus, la scuola guida La Tour de Mare, SR Bien-être a Saint-Raphaël: diversi siti della nostra vetrina sono a poche strade da te.",
        },
      },
      {
        h: { fr: "Une saison, plusieurs langues", en: "One season, several languages", it: "Una stagione, più lingue" },
        p: {
          fr: "Entre les habitants à l'année et les visiteurs de l'été, un site local doit parler à tout le monde, souvent en plusieurs langues.",
          en: "Between year-round residents and summer visitors, a local site has to speak to everyone, often in several languages.",
          it: "Tra chi ci vive tutto l'anno e i visitatori dell'estate, un sito locale deve parlare a tutti, spesso in più lingue.",
        },
      },
    ],
    cases: ["wall-street", "so-good-diner", "autoecole", "stephanie"],
    faq: ["where", "languages"],
    blog: "local-google",
  },
  {
    key: "riviera",
    kind: "zone",
    slug: { fr: "creation-site-internet-var-alpes-maritimes", en: "web-design-var-alpes-maritimes", it: "siti-web-var-alpi-marittime" },
    nav: { fr: "Var & Alpes-Maritimes", en: "Var & Alpes-Maritimes", it: "Var e Alpi Marittime" },
    title: { fr: "Création de site internet dans le Var et les Alpes-Maritimes", en: "Web design across the Var and Alpes-Maritimes", it: "Siti web nel Var e nelle Alpi Marittime" },
    seoTitle: { fr: "Création de site internet Var & Alpes-Maritimes", en: "Web design in the Var & Alpes-Maritimes", it: "Siti web nel Var e nelle Alpi Marittime" },
    description: {
      fr: "De Saint-Tropez à Monaco, des sites sur mesure pour les entreprises de la Côte d'Azur : rapides, visibles sur Google et en plusieurs langues.",
      en: "From Saint-Tropez to Monaco, made-to-measure websites for French Riviera businesses: fast, visible on Google and multilingual.",
      it: "Da Saint-Tropez a Monaco, siti su misura per le aziende della Costa Azzurra: veloci, visibili su Google e in più lingue.",
    },
    intro: {
      fr: "Artisans, entreprises du bâtiment, métiers du tourisme : sur la Côte d'Azur, une partie de vos clients ne parle pas français.",
      en: "Tradespeople, building firms, tourism businesses: on the French Riviera, some of your customers don't speak French.",
      it: "Artigiani, imprese edili, attività turistiche: in Costa Azzurra, una parte dei tuoi clienti non parla francese.",
    },
    points: {
      fr: ["Sites bilingues ou multilingues pour une clientèle internationale", "Une page par service et par zone d'intervention", "Galeries de réalisations et demande de devis en un geste", "Référencement local sur vos communes"],
      en: ["Bilingual or multilingual sites for an international clientele", "A page per service and per area you cover", "Galleries of your work and quote requests in one tap", "Local SEO for the towns you serve"],
      it: ["Siti bilingui o multilingue per una clientela internazionale", "Una pagina per servizio e per zona servita", "Gallerie dei lavori e richiesta di preventivo in un gesto", "SEO locale sui tuoi comuni"],
    },
    sections: [
      {
        h: { fr: "Des exemples sur la côte", en: "Examples along the coast", it: "Esempi sulla costa" },
        p: {
          fr: "EM Concept intervient dans tout le Var et les Alpes-Maritimes ; Plan B Concept accompagne des propriétaires de Saint-Tropez à Monaco, en anglais et en français.",
          en: "EM Concept works across the Var and Alpes-Maritimes; Plan B Concept represents property owners from Saint-Tropez to Monaco, in English and French.",
          it: "EM Concept lavora in tutto il Var e nelle Alpi Marittime; Plan B Concept segue i proprietari da Saint-Tropez a Monaco, in inglese e in francese.",
        },
      },
    ],
    cases: ["E-Mconcept", "planb-global-connect", "stephanie"],
    faq: ["where", "google"],
    blog: "tradespeople-website",
  },
  {
    key: "remote",
    kind: "zone",
    slug: { fr: "creation-site-internet-a-distance", en: "remote-web-design", it: "siti-web-a-distanza" },
    nav: { fr: "À distance", en: "Remote", it: "A distanza" },
    title: { fr: "Création de site internet à distance", en: "Remote web design: UK, Italy and beyond", it: "Siti web a distanza: Italia, Regno Unito e oltre" },
    seoTitle: { fr: "Création de site internet à distance", en: "Remote web design for the UK and Italy", it: "Siti web a distanza per l'Italia" },
    description: {
      fr: "Où que vous soyez, nous créons votre site à distance : appels, WhatsApp et une version de test à ouvrir sur votre téléphone. Royaume-Uni, Italie et ailleurs.",
      en: "Wherever you are, we build your site remotely: calls, WhatsApp and a test version to open on your phone. In English, French or Italian.",
      it: "Ovunque tu sia, creiamo il tuo sito a distanza: chiamate, WhatsApp e una versione di prova da aprire sul telefono. In italiano, inglese o francese.",
    },
    intro: {
      fr: "Nos sites tournent déjà au Royaume-Uni et en Italie. À distance, tout se fait très bien.",
      en: "Our sites already run in the United Kingdom and Italy. Working remotely works very well.",
      it: "I nostri siti sono già online in Italia e nel Regno Unito. A distanza, tutto funziona benissimo.",
    },
    points: {
      fr: ["Échanges par téléphone, WhatsApp ou e-mail", "Une version de test en ligne, à ouvrir sur votre téléphone", "Un accompagnement en français, en anglais ou en italien", "Un site dans la langue de votre pays et de vos clients"],
      en: ["Conversations by phone, WhatsApp or email", "A test version online, to open on your phone", "Support in English, French or Italian", "A site in the language of your country and your customers"],
      it: ["Contatti per telefono, WhatsApp o e-mail", "Una versione di prova online, da aprire sul telefono", "Assistenza in italiano, inglese o francese", "Un sito nella lingua del tuo paese e dei tuoi clienti"],
    },
    sections: [
      {
        h: { fr: "Au Royaume-Uni et en Italie", en: "In the UK and Italy", it: "In Italia e nel Regno Unito" },
        p: {
          fr: "À Bristol, le Filton Athletic FC et le Filton & District Social Club ; dans les Marches, le Ristorante da Lola, en quatre langues.",
          en: "In Bristol, Filton Athletic FC and the Filton & District Social Club; in Italy's Marche, Ristorante da Lola, in four languages.",
          it: "Nelle Marche, il Ristorante da Lola, in quattro lingue; a Bristol, il Filton Athletic FC e il Filton & District Social Club.",
        },
      },
    ],
    cases: ["ristorante-lola", "filton-athletic-fc", "filton-social-club"],
    faq: ["where", "who"],
    blog: "multilingual-websites",
  },
];

/** Every page path of an offer, per language. */
export const offerPath = (lang: "fr" | "en" | "it", offer: Offer) =>
  lang === "fr" ? `/${offer.slug.fr}/` : `/${lang}/${offer.slug[lang]}/`;
