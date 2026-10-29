// Words for the "Audit express" page (src/components/AuditPage.astro), in
// French, English and Italian. Check ids match api/audit.js; "{v}" is the
// measured value.

export type L3 = { fr: string; en: string; it: string };
type Status = "good" | "warn" | "bad";

export const CHECKS: Record<string, { label: L3 } & Partial<Record<Status, L3>>> = {
  https: {
    label: { fr: "Connexion sécurisée (HTTPS)", en: "Secure connection (HTTPS)", it: "Connessione sicura (HTTPS)" },
    good: { fr: "Le cadenas s'affiche : les navigateurs ne préviennent pas vos visiteurs.", en: "The padlock shows: browsers don't warn your visitors.", it: "Il lucchetto è presente: i browser non avvisano i visitatori." },
    bad: { fr: "Pas de cadenas : les navigateurs affichent « Non sécurisé ».", en: "No padlock: browsers show \"Not secure\".", it: "Niente lucchetto: i browser mostrano «Non sicuro»." },
  },
  mobile: {
    label: { fr: "Affichage sur téléphone", en: "Display on phones", it: "Visualizzazione sul telefono" },
    good: { fr: "La page s'adapte à l'écran du téléphone.", en: "The page adapts to phone screens.", it: "La pagina si adatta allo schermo del telefono." },
    bad: { fr: "La page n'est pas prévue pour le téléphone : il faut zoomer pour lire.", en: "The page isn't built for phones: people have to zoom to read.", it: "La pagina non è pensata per il telefono: bisogna zoomare per leggere." },
  },
  speed: {
    label: { fr: "Vitesse de réponse", en: "Response speed", it: "Velocità di risposta" },
    good: { fr: "Rapide ({v} ms).", en: "Fast ({v} ms).", it: "Veloce ({v} ms)." },
    warn: { fr: "Un peu lent ({v} ms) : chaque seconde fait partir des visiteurs.", en: "A little slow ({v} ms): every second loses visitors.", it: "Un po' lento ({v} ms): ogni secondo fa perdere visitatori." },
    bad: { fr: "Lent ({v} ms) : une partie des visiteurs repart avant d'avoir vu la page.", en: "Slow ({v} ms): some visitors leave before the page appears.", it: "Lento ({v} ms): parte dei visitatori se ne va prima di vedere la pagina." },
  },
  weight: {
    label: { fr: "Poids de la page", en: "Page weight", it: "Peso della pagina" },
    good: { fr: "Légère ({v} Ko).", en: "Light ({v} KB).", it: "Leggera ({v} KB)." },
    warn: { fr: "Assez lourde ({v} Ko).", en: "Fairly heavy ({v} KB).", it: "Piuttosto pesante ({v} KB)." },
    bad: { fr: "Très lourde ({v} Ko) : pénible sur une connexion mobile.", en: "Very heavy ({v} KB): painful on a mobile connection.", it: "Molto pesante ({v} KB): faticosa con una connessione mobile." },
  },
  title: {
    label: { fr: "Titre pour Google", en: "Title for Google", it: "Titolo per Google" },
    good: { fr: "Présent et de bonne longueur.", en: "Present and the right length.", it: "Presente e della lunghezza giusta." },
    warn: { fr: "Présent, mais trop court ou trop long ({v} caractères).", en: "Present, but too short or too long ({v} characters).", it: "Presente, ma troppo corto o troppo lungo ({v} caratteri)." },
    bad: { fr: "Absent : Google invente le sien.", en: "Missing: Google makes one up.", it: "Assente: Google ne inventa uno." },
  },
  description: {
    label: { fr: "Description pour Google", en: "Description for Google", it: "Descrizione per Google" },
    good: { fr: "Présente et de bonne longueur.", en: "Present and the right length.", it: "Presente e della lunghezza giusta." },
    warn: { fr: "Présente, mais à retravailler ({v} caractères).", en: "Present, but needs work ({v} characters).", it: "Presente, ma da rivedere ({v} caratteri)." },
    bad: { fr: "Absente : Google choisit un bout de texte au hasard.", en: "Missing: Google picks a random snippet of text.", it: "Assente: Google sceglie un pezzo di testo a caso." },
  },
  h1: {
    label: { fr: "Titre principal de la page", en: "Main page heading", it: "Titolo principale della pagina" },
    good: { fr: "Un seul titre principal, clair pour Google.", en: "One main heading, clear for Google.", it: "Un solo titolo principale, chiaro per Google." },
    warn: { fr: "Plusieurs titres principaux ({v}) : le message se dilue.", en: "Several main headings ({v}): the message gets diluted.", it: "Più titoli principali ({v}): il messaggio si disperde." },
    bad: { fr: "Aucun titre principal.", en: "No main heading.", it: "Nessun titolo principale." },
  },
  phone: {
    label: { fr: "Numéro cliquable", en: "Tappable phone number", it: "Numero cliccabile" },
    good: { fr: "On peut vous appeler d'un geste.", en: "People can call you in one tap.", it: "Ti chiamano con un tocco." },
    warn: { fr: "Aucun numéro cliquable sur la page d'accueil.", en: "No tappable number on the home page.", it: "Nessun numero cliccabile nella home page." },
  },
  structured: {
    label: { fr: "Informations pour Google", en: "Information for Google", it: "Informazioni per Google" },
    good: { fr: "Google reçoit vos informations (activité, adresse…) dans son format.", en: "Google gets your details (business, address…) in its own format.", it: "Google riceve le tue informazioni (attività, indirizzo…) nel suo formato." },
    warn: { fr: "Absentes : Google doit deviner qui vous êtes.", en: "Missing: Google has to guess who you are.", it: "Assenti: Google deve indovinare chi sei." },
  },
  share: {
    label: { fr: "Aperçu quand on partage le lien", en: "Preview when the link is shared", it: "Anteprima quando si condivide il link" },
    good: { fr: "Une image s'affiche quand on partage votre site.", en: "An image shows when your site is shared.", it: "Compare un'immagine quando si condivide il sito." },
    warn: { fr: "Pas d'image prévue : le lien partagé sur WhatsApp ou Facebook reste nu.", en: "No image set: links shared on WhatsApp or Facebook look bare.", it: "Nessuna immagine: il link condiviso su WhatsApp o Facebook resta spoglio." },
  },
  lang: {
    label: { fr: "Langue déclarée", en: "Declared language", it: "Lingua dichiarata" },
    good: { fr: "La langue de la page est indiquée.", en: "The page's language is set.", it: "La lingua della pagina è indicata." },
    warn: { fr: "Langue non indiquée.", en: "Language not set.", it: "Lingua non indicata." },
  },
  alt: {
    label: { fr: "Descriptions des images", en: "Image descriptions", it: "Descrizioni delle immagini" },
    good: { fr: "Toutes les images sont décrites.", en: "Every image is described.", it: "Tutte le immagini sono descritte." },
    warn: { fr: "{v} image(s) sans description.", en: "{v} image(s) without a description.", it: "{v} immagine/i senza descrizione." },
    bad: { fr: "{v} images sans description : invisibles pour Google.", en: "{v} images without a description: invisible to Google.", it: "{v} immagini senza descrizione: invisibili per Google." },
  },
};

export const QUESTIONS: { id: string; q: L3; options: { v: string; label: L3; status: Status }[]; result: Partial<Record<Status, L3>> }[] = [
  {
    id: "edit",
    q: { fr: "Pouvez-vous modifier vous-même vos horaires, textes et photos ?", en: "Can you update your hours, text and photos yourself?", it: "Puoi modificare da solo orari, testi e foto?" },
    options: [
      { v: "yes", label: { fr: "Oui", en: "Yes", it: "Sì" }, status: "good" },
      { v: "no", label: { fr: "Non", en: "No", it: "No" }, status: "bad" },
    ],
    result: {
      good: { fr: "Vous gardez la main sur votre site.", en: "You stay in control of your site.", it: "Hai il controllo del tuo sito." },
      bad: { fr: "Vous ne pouvez pas faire évoluer votre site : il vieillit.", en: "You can't update your site: it's ageing.", it: "Non puoi far evolvere il sito: sta invecchiando." },
    },
  },
  {
    id: "leads",
    q: { fr: "Votre site vous apporte-t-il des demandes ?", en: "Does your site bring you enquiries?", it: "Il tuo sito ti porta richieste?" },
    options: [
      { v: "yes", label: { fr: "Oui", en: "Yes", it: "Sì" }, status: "good" },
      { v: "no", label: { fr: "Non", en: "No", it: "No" }, status: "bad" },
      { v: "unsure", label: { fr: "Je ne sais pas", en: "Not sure", it: "Non lo so" }, status: "warn" },
    ],
    result: {
      good: { fr: "Il vous apporte des demandes.", en: "It brings you enquiries.", it: "Ti porta richieste." },
      warn: { fr: "Vous ne savez pas ce qu'il vous rapporte.", en: "You don't know what it brings in.", it: "Non sai cosa ti porta." },
      bad: { fr: "Il ne vous apporte pas de demandes.", en: "It doesn't bring you enquiries.", it: "Non ti porta richieste." },
    },
  },
  {
    id: "fresh",
    q: { fr: "Les informations sont-elles à jour (horaires, prix, services) ?", en: "Is the information up to date (hours, prices, services)?", it: "Le informazioni sono aggiornate (orari, prezzi, servizi)?" },
    options: [
      { v: "yes", label: { fr: "Oui", en: "Yes", it: "Sì" }, status: "good" },
      { v: "no", label: { fr: "Non", en: "No", it: "No" }, status: "bad" },
    ],
    result: {
      good: { fr: "Les informations sont à jour.", en: "The information is up to date.", it: "Le informazioni sono aggiornate." },
      bad: { fr: "Des informations sont dépassées : vos visiteurs doutent du reste.", en: "Some information is out of date: visitors start doubting the rest.", it: "Alcune informazioni sono superate: i visitatori dubitano del resto." },
    },
  },
  {
    id: "languages",
    q: { fr: "Une partie de vos clients parle-t-elle une autre langue ?", en: "Do some of your customers speak another language?", it: "Una parte dei tuoi clienti parla un'altra lingua?" },
    options: [
      { v: "yes", label: { fr: "Oui", en: "Yes", it: "Sì" }, status: "warn" },
      { v: "no", label: { fr: "Non", en: "No", it: "No" }, status: "good" },
    ],
    result: {
      good: { fr: "Votre site parle la langue de vos clients.", en: "Your site speaks your customers' language.", it: "Il sito parla la lingua dei tuoi clienti." },
      warn: { fr: "Votre site ne parle qu'une langue : une partie de vos clients n'est pas accueillie.", en: "Your site speaks one language only: some customers aren't welcomed.", it: "Il sito parla una sola lingua: una parte dei clienti non è accolta." },
    },
  },
];

export const UIA = {
  fr: {
    title: "Audit express de votre site internet | The Vitrine",
    description: "Entrez l'adresse de votre site : en quelques secondes, vous savez ce qui fonctionne et ce qui vous coûte des clients. Gratuit, sans inscription.",
    eyebrow: "Outil gratuit",
    h1: "Audit express de votre site",
    lead: "Entrez l'adresse de votre site : en quelques secondes, vous savez ce qui fonctionne et ce qui vous coûte des clients.",
    urlLabel: "Adresse de votre site",
    urlPlaceholder: "www.votre-site.fr",
    questions: "Quatre questions, si vous voulez",
    run: "Lancer l'audit",
    running: "Analyse en cours…",
    scoreLabel: "Note",
    verdict: { high: "Votre site tient la route.", mid: "Votre site mérite un sérieux coup de neuf.", low: "Une refonte s'impose." },
    verdictSub: { high: "Quelques réglages, et il fera encore mieux.", mid: "Plusieurs points vous font perdre des clients aujourd'hui.", low: "Votre site freine votre activité au lieu de la porter." },
    checked: "Contrôle automatique de la page d'accueil de {host}, à titre indicatif.",
    yourAnswers: "Vos réponses",
    cta: "Demander un devis de refonte",
    ctaAlt: "Voir notre offre de refonte",
    again: "Analyser un autre site",
    errors: {
      url: "Cette adresse ne semble pas valide.",
      unreachable: "Impossible de joindre ce site. Vérifiez l'adresse.",
      timeout: "Le site met plus de 8 secondes à répondre : c'est déjà un problème pour vos visiteurs.",
      status: "Le site répond avec une erreur.",
      nothtml: "Cette adresse ne mène pas à une page web.",
      large: "La page dépasse 1,5 Mo : beaucoup trop lourde pour un téléphone.",
      rate: "Trop d'audits d'affilée : réessayez dans quelques minutes.",
      generic: "L'audit n'a pas pu aboutir. Réessayez dans un instant.",
    },
    status: { good: "Bon", warn: "À améliorer", bad: "À corriger" },
  },
  en: {
    title: "Free website check | The Vitrine",
    description: "Enter your website's address: in seconds, see what works and what's costing you customers. Free, no sign-up.",
    eyebrow: "Free tool",
    h1: "Quick website check",
    lead: "Enter your website's address: in seconds, you'll see what works and what's costing you customers.",
    urlLabel: "Your website's address",
    urlPlaceholder: "www.your-site.com",
    questions: "Four questions, if you like",
    run: "Check my site",
    running: "Checking…",
    scoreLabel: "Score",
    verdict: { high: "Your site holds up.", mid: "Your site needs a serious refresh.", low: "It's time for a redesign." },
    verdictSub: { high: "A few tweaks and it'll do even better.", mid: "Several things are losing you customers today.", low: "Your site is holding your business back instead of carrying it." },
    checked: "Automatic check of the {host} home page, as a guide.",
    yourAnswers: "Your answers",
    cta: "Get a redesign quote",
    ctaAlt: "See our redesign service",
    again: "Check another site",
    errors: {
      url: "That address doesn't look valid.",
      unreachable: "We couldn't reach that site. Check the address.",
      timeout: "The site takes more than 8 seconds to respond: that's already a problem for your visitors.",
      status: "The site responds with an error.",
      nothtml: "That address doesn't lead to a web page.",
      large: "The page is over 1.5 MB: far too heavy for a phone.",
      rate: "Too many checks in a row: try again in a few minutes.",
      generic: "The check didn't go through. Try again in a moment.",
    },
    status: { good: "Good", warn: "Could be better", bad: "Needs fixing" },
  },
  it: {
    title: "Check-up gratuito del sito | The Vitrine",
    description: "Inserisci l'indirizzo del tuo sito: in pochi secondi scopri cosa funziona e cosa ti fa perdere clienti. Gratuito, senza registrazione.",
    eyebrow: "Strumento gratuito",
    h1: "Check-up rapido del tuo sito",
    lead: "Inserisci l'indirizzo del tuo sito: in pochi secondi scopri cosa funziona e cosa ti fa perdere clienti.",
    urlLabel: "Indirizzo del tuo sito",
    urlPlaceholder: "www.iltuosito.it",
    questions: "Quattro domande, se vuoi",
    run: "Avvia il check-up",
    running: "Analisi in corso…",
    scoreLabel: "Voto",
    verdict: { high: "Il tuo sito regge bene.", mid: "Il tuo sito ha bisogno di una bella rinfrescata.", low: "È ora di rifarlo." },
    verdictSub: { high: "Qualche ritocco e farà ancora meglio.", mid: "Diversi punti ti fanno perdere clienti oggi.", low: "Il sito frena la tua attività invece di sostenerla." },
    checked: "Controllo automatico della home page di {host}, a titolo indicativo.",
    yourAnswers: "Le tue risposte",
    cta: "Chiedi un preventivo per il rifacimento",
    ctaAlt: "Scopri il nostro servizio di rifacimento",
    again: "Analizza un altro sito",
    errors: {
      url: "Questo indirizzo non sembra valido.",
      unreachable: "Impossibile raggiungere il sito. Controlla l'indirizzo.",
      timeout: "Il sito impiega più di 8 secondi a rispondere: è già un problema per i visitatori.",
      status: "Il sito risponde con un errore.",
      nothtml: "Questo indirizzo non porta a una pagina web.",
      large: "La pagina supera 1,5 MB: troppo pesante per un telefono.",
      rate: "Troppi check-up di fila: riprova tra qualche minuto.",
      generic: "Il check-up non è riuscito. Riprova tra un attimo.",
    },
    status: { good: "Bene", warn: "Da migliorare", bad: "Da correggere" },
  },
} as const;

/** Handed to the questionnaire (sessionStorage) so the quote request starts filled in. */
export const AUDIT_HANDOFF = "vitrine-audit-handoff";
