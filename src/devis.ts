// The project questionnaire (/devis/, /en/quote/, /it/preventivo/), ported from antonyaddy.com.
// SCHEMA lists the steps and questions in French, English and Italian; UI holds the page's
// words. Used by the page (static text) and by its script (building the steps).

export type Lang = "fr" | "en" | "it";
export type Opt = { v: string; fr: string; en: string; it: string };
export type Field = {
  id: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "radio" | "checkbox" | "consent";
  fr: string;
  en: string;
  it: string;
  req?: boolean;
  auto?: string;
  hint?: { fr: string; en: string; it: string };
  options?: Opt[];
  scale?: boolean;
  /** Shown only when that answer is selected: [fieldId, value]. */
  showIf?: [string, string];
};
export type Step = { id: string; fr: string; en: string; it: string; short: { fr: string; en: string; it: string }; fields: Field[] };

export const UI = {
  fr: {
    title: "Votre projet de site — Questionnaire | The Vitrine",
    description: "Décrivez votre projet de site en quelques minutes : nous vous répondons avec un devis clair. Six étapes, en français ou en anglais.",
    eyebrow: "Questionnaire projet",
    h1: "Votre projet de site",
    lead: "Quelques minutes pour nous décrire votre projet. Remplissez seulement ce qui vous concerne : nous verrons le reste ensemble. Nous vous répondons avec un devis clair.",
    noscript: "Ce questionnaire a besoin de JavaScript. Vous pouvez aussi nous contacter directement :",
    noscriptLink: "nos coordonnées",
    prev: "Précédent", next: "Suivant", submit: "Envoyer", sending: "Envoi…",
    restart: "Recommencer", restartConfirm: "Effacer vos réponses et recommencer à l'étape 1 ?",
    goStep: "Aller à l'étape {n}",
    step: "Étape {n} sur {t}",
    steps: "Étapes",
    errRequired: "Merci de remplir les champs obligatoires.",
    errEmail: "Cette adresse e-mail ne semble pas valide.",
    errConsent: "Merci de cocher la case pour accepter l'utilisation de vos réponses.",
    errSend: "L'envoi n'a pas fonctionné. Réessayez, ou contactez-nous directement depuis le bas de la page d'accueil.",
    doneEyebrow: "C'est envoyé",
    doneH: "Merci, nous avons bien reçu votre projet.",
    doneP: "Antony et Julien l'étudient et reviennent vers vous très vite pour en parler, puis avec un devis clair.",
    doneSentTo: "Une confirmation vient de partir à",
    doneStepsTitle: "Et maintenant ?",
    doneSteps: ["Nous étudions votre projet en détail.", "Nous échangeons avec vous pour préciser vos besoins.", "Vous recevez un devis clair, sans surprise."],
    doneWork: "Voir nos réalisations",
    doneBlog: "Lire nos conseils",
    alt: "Vous préférez en parler directement ?",
    altLink: "Écrivez-nous ou passez par WhatsApp",
    privacy: "Vos réponses sont envoyées par e-mail à Antony et Julien, uniquement pour préparer votre devis. Elles ne sont pas enregistrées sur ce site. Un brouillon reste dans votre navigateur pendant 7 jours maximum, ou jusqu'à l'envoi ou sa suppression.",
  },
  en: {
    title: "Your website project — Questionnaire | The Vitrine",
    description: "Tell us about your website project in a few minutes, and we'll come back to you with a clear quote. Six short steps, in English or French.",
    eyebrow: "Project questionnaire",
    h1: "Your website project",
    lead: "A few minutes to tell us about your project. Only fill in what applies to you; we'll go through the rest together. We'll come back to you with a clear quote.",
    noscript: "This questionnaire needs JavaScript. You can also reach us directly:",
    noscriptLink: "our contact details",
    prev: "Back", next: "Next", submit: "Send", sending: "Sending…",
    restart: "Start over", restartConfirm: "Clear your answers and start again from step 1?",
    goStep: "Go to step {n}",
    step: "Step {n} of {t}",
    steps: "Steps",
    errRequired: "Please fill in the required fields.",
    errEmail: "That email address doesn't look right.",
    errConsent: "Please tick the box to agree to how your answers are used.",
    errSend: "Sending didn't work. Please try again, or contact us directly from the bottom of the home page.",
    doneEyebrow: "Sent",
    doneH: "Thank you, we've received your project.",
    doneP: "Antony and Julien will look it over and get back to you very soon to talk it through, then with a clear quote.",
    doneSentTo: "A confirmation is on its way to",
    doneStepsTitle: "What happens next",
    doneSteps: ["We study your project in detail.", "We talk with you to pin down your needs.", "You get a clear quote, with no surprises."],
    doneWork: "See our work",
    doneBlog: "Read our articles",
    alt: "Rather talk it through?",
    altLink: "Write to us or use WhatsApp",
    privacy: "Your answers are emailed to Antony and Julien, only to prepare your quote. They aren't stored on this site. A draft stays in your browser for up to 7 days, or until you send or delete it.",
  },
  it: {
    title: "Il tuo progetto di sito — Questionario | The Vitrine",
    description: "Descrivi il tuo progetto di sito in pochi minuti: ti rispondiamo con un preventivo chiaro. Sei brevi passaggi, in italiano, francese o inglese.",
    eyebrow: "Questionario di progetto",
    h1: "Il tuo progetto di sito",
    lead: "Pochi minuti per descriverci il tuo progetto. Compila solo ciò che ti riguarda: il resto lo vedremo insieme. Ti rispondiamo con un preventivo chiaro.",
    noscript: "Questo questionario ha bisogno di JavaScript. Puoi anche contattarci direttamente:",
    noscriptLink: "i nostri contatti",
    prev: "Indietro", next: "Avanti", submit: "Invia", sending: "Invio…",
    restart: "Ricomincia", restartConfirm: "Cancellare le risposte e ricominciare dal passaggio 1?",
    goStep: "Vai al passaggio {n}",
    step: "Passaggio {n} di {t}",
    steps: "Passaggi",
    errRequired: "Compila i campi obbligatori.",
    errEmail: "Questo indirizzo e-mail non sembra valido.",
    errConsent: "Spunta la casella per accettare l'uso delle tue risposte.",
    errSend: "Invio non riuscito. Riprova, oppure contattaci direttamente dal fondo della home page.",
    doneEyebrow: "Inviato",
    doneH: "Grazie, abbiamo ricevuto il tuo progetto.",
    doneP: "Antony e Julien lo esaminano e ti ricontattano al più presto per parlarne, poi con un preventivo chiaro.",
    doneSentTo: "Una conferma è in arrivo a",
    doneStepsTitle: "E adesso?",
    doneSteps: ["Esaminiamo il tuo progetto nel dettaglio.", "Ci confrontiamo con te per definire le tue esigenze.", "Ricevi un preventivo chiaro, senza sorprese."],
    doneWork: "Guarda i nostri progetti",
    doneBlog: "Leggi i nostri articoli",
    alt: "Preferisci parlarne direttamente?",
    altLink: "Scrivici o usa WhatsApp",
    privacy: "Le tue risposte vengono inviate via e-mail ad Antony e Julien, solo per preparare il preventivo. Non vengono salvate su questo sito. Una bozza resta nel tuo browser per un massimo di 7 giorni, oppure fino all'invio o alla sua cancellazione.",
  },
} as const;

function o(v: string, fr: string, en: string, it: string): Opt { return { v, fr, en, it }; }

export const SCHEMA: Step[] = [
  {
    id: "you", fr: "Vous et votre activité", en: "You and your business", it: "Tu e la tua attività", short: { fr: "Vous", en: "You", it: "Tu" },
    fields: [
      { id: "name", type: "text", req: true, auto: "name", fr: "Votre nom", en: "Your name", it: "Il tuo nome" },
      { id: "email", type: "email", req: true, auto: "email", fr: "E-mail", en: "Email", it: "E-mail" },
      { id: "phone", type: "tel", auto: "tel", fr: "Téléphone", en: "Phone", it: "Telefono" },
      { id: "company", type: "text", auto: "organization", fr: "Nom de l'entreprise ou de l'association", en: "Business or organisation name", it: "Nome dell'azienda o dell'associazione" },
      { id: "activity", type: "textarea", fr: "Que fait votre entreprise ? Qui sont vos clients ?", en: "What does your business do? Who are your customers?", it: "Di cosa si occupa la tua attività? Chi sono i tuoi clienti?" },
      { id: "area", type: "text", fr: "Zone géographique couverte", en: "Area you serve", it: "Zona geografica servita" },
    ]
  },
  {
    id: "goals", fr: "Objectifs du projet", en: "Project goals", it: "Obiettivi del progetto", short: { fr: "Objectifs", en: "Goals", it: "Obiettivi" },
    fields: [
      { id: "kind", type: "radio", fr: "S'agit-il d'un nouveau site ou d'une refonte ?", en: "Is this a new site or a redesign?", it: "Si tratta di un nuovo sito o di un restyling?",
        options: [o("new", "Nouveau site", "New site", "Nuovo sito"), o("redesign", "Refonte d'un site existant", "Redesign of an existing site", "Restyling di un sito esistente")] },
      { id: "current", type: "text", showIf: ["kind", "redesign"], fr: "Adresse du site actuel, et ce qui ne vous convient plus", en: "Current site address, and what isn't working", it: "Indirizzo del sito attuale, e cosa non ti convince più" },
      { id: "goal", type: "checkbox", fr: "Objectif principal du site", en: "Main goal of the site", it: "Obiettivo principale del sito",
        options: [
          o("calls", "Obtenir des appels ou des demandes de devis", "Get calls or quote requests", "Ricevere chiamate o richieste di preventivo"),
          o("sell", "Vendre en ligne", "Sell online", "Vendere online"),
          o("showcase", "Présenter mes réalisations", "Showcase my work", "Presentare i miei lavori"),
          o("bookings", "Prise de rendez-vous ou réservation", "Appointments or bookings", "Appuntamenti o prenotazioni"),
          o("inform", "Informer mon public", "Inform my audience", "Informare il mio pubblico"),
          o("other", "Autre", "Other", "Altro")
        ] },
      { id: "goalOther", type: "text", showIf: ["goal", "other"], fr: "Précisez", en: "Please specify", it: "Specifica" },
      { id: "refs", type: "textarea", fr: "2 ou 3 sites que vous aimez (concurrents ou non), et pourquoi", en: "2–3 websites you like (competitors or not), and why", it: "2 o 3 siti che ti piacciono (concorrenti o no), e perché" }
    ]
  },
  {
    id: "site", fr: "Structure et fonctionnalités", en: "Structure and features", it: "Struttura e funzionalità", short: { fr: "Site", en: "Site", it: "Sito" },
    fields: [
      { id: "pages", type: "textarea", fr: "Pages souhaitées et nombre approximatif", en: "Pages you want and rough number", it: "Pagine desiderate e numero indicativo",
        hint: { fr: "Accueil, À propos, Services, Contact…", en: "Home, About, Services, Contact…", it: "Home, Chi siamo, Servizi, Contatti…" } },
      { id: "langs", type: "checkbox", fr: "Langues du site", en: "Site languages", it: "Lingue del sito",
        options: [o("fr", "Français", "French", "Francese"), o("en", "Anglais", "English", "Inglese"), o("it", "Italien", "Italian", "Italiano"), o("other", "Autre", "Other", "Altro")] },
      { id: "langsOther", type: "text", showIf: ["langs", "other"], fr: "Quelles autres langues ?", en: "Which other languages?", it: "Quali altre lingue?" },
      { id: "blog", type: "radio", fr: "Souhaitez-vous un blog ou une rubrique actualités ?", en: "Do you want a blog or news section?", it: "Desideri un blog o una sezione notizie?",
        options: [o("yes", "Oui", "Yes", "Sì"), o("no", "Non", "No", "No"), o("discuss", "À discuter", "To discuss", "Da valutare")] },
      { id: "features", type: "checkbox", fr: "Fonctionnalités", en: "Features", it: "Funzionalità",
        hint: { fr: "Cochez tout ce qui vous intéresse.", en: "Tick everything you're interested in.", it: "Seleziona tutto ciò che ti interessa." },
        options: [
          o("form", "Formulaire de contact ou de devis", "Contact or quote form", "Modulo di contatto o di preventivo"),
          o("booking", "Prise de rendez-vous en ligne", "Online booking", "Prenotazione online di appuntamenti"),
          o("shop", "Boutique / paiement en ligne", "Shop / online payment", "Negozio / pagamento online"),
          o("ordering", "Commande à emporter ou en ligne", "Takeaway or online ordering", "Ordini da asporto o online"),
          o("gallery", "Galerie photos", "Photo gallery", "Galleria fotografica"),
          o("map", "Plan d'accès (Google Maps)", "Map and directions", "Mappa e indicazioni (Google Maps)"),
          o("reviews", "Avis clients", "Customer reviews", "Recensioni dei clienti"),
          o("newsletter", "Inscription à la newsletter", "Newsletter signup", "Iscrizione alla newsletter"),
          o("social", "Liens ou flux réseaux sociaux", "Social media links or feeds", "Link o feed dei social network"),
          o("members", "Espace membre ou connexion", "Member area or login", "Area riservata o login"),
          o("downloads", "Documents à télécharger", "Downloadable files", "Documenti da scaricare"),
          o("tool", "Outil sur mesure ou tableau de bord", "Custom tool or dashboard", "Strumento su misura o dashboard")
        ] },
      { id: "products", type: "number", showIf: ["features", "shop"], fr: "Nombre de produits approximatif", en: "Rough number of products", it: "Numero indicativo di prodotti" },
      { id: "toolNeeds", type: "textarea", showIf: ["features", "tool"], fr: "Décrivez l'outil ou le tableau de bord", en: "Describe the tool or dashboard", it: "Descrivi lo strumento o la dashboard" },
      { id: "integrations", type: "text", fr: "Outils à connecter", en: "Tools to connect", it: "Strumenti da collegare",
        hint: { fr: "Calendly, Stripe, CRM…", en: "Calendly, Stripe, CRM…", it: "Calendly, Stripe, CRM…" } }
    ]
  },
  {
    id: "content", fr: "Gestion, contenus et identité", en: "Managing, content and branding", it: "Gestione, contenuti e identità", short: { fr: "Contenus", en: "Content", it: "Contenuti" },
    fields: [
      { id: "selfEdit", type: "radio", fr: "Souhaitez-vous mettre à jour le site vous-même ?", en: "Do you want to update the site yourself?", it: "Vuoi aggiornare il sito da solo?",
        options: [o("yes", "Oui", "Yes", "Sì"), o("no", "Non, je vous confierai les modifications", "No, I'll send changes to you", "No, vi affiderò le modifiche")] },
      { id: "editParts", type: "text", showIf: ["selfEdit", "yes"], fr: "Quelles parties, et à quelle fréquence ?", en: "Which parts, and how often?", it: "Quali parti, e con quale frequenza?" },
      { id: "comfort", type: "radio", scale: true, showIf: ["selfEdit", "yes"], fr: "Votre aisance avec l'informatique", en: "Your comfort with technology", it: "La tua dimestichezza con l'informatica",
        hint: { fr: "1 = pas du tout, 5 = très à l'aise", en: "1 = not at all, 5 = very comfortable", it: "1 = per niente, 5 = molto a mio agio" },
        options: [o("1", "1", "1", "1"), o("2", "2", "2", "2"), o("3", "3", "3", "3"), o("4", "4", "4", "4"), o("5", "5", "5", "5")] },
      { id: "support", type: "checkbox", showIf: ["selfEdit", "yes"], fr: "Souhaitez-vous être accompagné(e) ?", en: "Would you like support?", it: "Desideri essere affiancato?",
        options: [o("training", "Formation", "Training session", "Formazione"), o("guide", "Guide écrit", "Written guide", "Guida scritta"), o("none", "Pas nécessaire", "Not needed", "Non necessario")] },
      { id: "writer", type: "radio", fr: "Qui rédige les textes du site ?", en: "Who writes the site's text?", it: "Chi scrive i testi del sito?",
        options: [o("me", "Moi", "Me", "Io"), o("you", "Vous", "You", "Tu"), o("together", "À voir ensemble", "To decide together", "Da decidere insieme")] },
      { id: "photos", type: "checkbox", fr: "Photos et visuels", en: "Photos and images", it: "Foto e immagini",
        options: [o("have", "J'ai des photos de qualité", "I have good photos", "Ho foto di qualità"), o("stock", "Images libres de droits", "Stock images", "Immagini royalty-free"), o("shoot", "Shooting à prévoir", "Photo shoot needed", "Servizio fotografico da prevedere")] },
      { id: "ready", type: "text", fr: "Vos contenus sont-ils prêts ? Sinon, pour quand ?", en: "Is your content ready? If not, when will it be?", it: "I tuoi contenuti sono pronti? Altrimenti, per quando?" },
      { id: "brand", type: "radio", fr: "Avez-vous un logo, des couleurs ou une charte graphique ?", en: "Do you have a logo, colours or brand guidelines?", it: "Hai un logo, dei colori o un'identità visiva?",
        options: [o("yes", "Oui, je les fournis", "Yes, I'll supply them", "Sì, li fornisco io"), o("partly", "En partie", "Partly", "In parte"), o("no", "Non, à créer", "No, to be created", "No, da creare")] },
      { id: "style", type: "checkbox", fr: "Le style qui vous ressemble", en: "The style that fits you", it: "Lo stile che ti rappresenta",
        options: [o("modern", "Moderne", "Modern", "Moderno"), o("minimal", "Épuré", "Minimal", "Essenziale"), o("warm", "Chaleureux", "Warm", "Accogliente"), o("premium", "Haut de gamme", "Premium", "Di alta gamma"), o("playful", "Ludique", "Playful", "Giocoso"), o("corporate", "Professionnel", "Corporate", "Professionale")] },
      { id: "dislike", type: "textarea", fr: "Ce que vous n'aimez pas (couleurs, styles, sites…)", en: "Anything you dislike (colours, styles, sites…)", it: "Ciò che non ti piace (colori, stili, siti…)" }
    ]
  },
  {
    id: "tech", fr: "Technique et suivi", en: "Technical and after launch", it: "Aspetti tecnici e assistenza", short: { fr: "Technique", en: "Technical", it: "Tecnica" },
    fields: [
      { id: "domain", type: "text", fr: "Nom de domaine : en possédez-vous un ? Lequel ?", en: "Domain name: do you own one? Which one?", it: "Nome di dominio: ne hai già uno? Quale?" },
      { id: "hosting", type: "radio", fr: "Hébergement", en: "Hosting", it: "Hosting",
        options: [o("have", "J'ai déjà un hébergeur", "I already have hosting", "Ho già un hosting"), o("you", "Je vous laisse vous en occuper", "I'd like you to handle it", "Preferisco che ve ne occupiate voi")] },
      { id: "emails", type: "radio", fr: "Adresses e-mail professionnelles (contact@votresite.fr)", en: "Professional email addresses", it: "Indirizzi e-mail professionali (info@iltuosito.it)",
        options: [o("have", "Déjà en place", "Already set up", "Già attivi"), o("needed", "À créer", "Needed", "Da creare"), o("no", "Pas nécessaire", "Not needed", "Non necessario")] },
      { id: "migrate", type: "text", showIf: ["kind", "redesign"], fr: "Contenus à récupérer de votre site actuel ?", en: "Content to bring over from your current site?", it: "Contenuti da recuperare dal sito attuale?" },
      { id: "seo", type: "checkbox", fr: "Visibilité et obligations légales", en: "SEO and legal", it: "Visibilità e obblighi di legge",
        options: [
          o("seo", "Référencement naturel de base (SEO)", "Basic search engine optimisation", "Ottimizzazione di base per i motori di ricerca (SEO)"),
          o("local", "Référencement local et fiche Google", "Local SEO and Google Business Profile", "SEO locale e scheda Google Business Profile"),
          o("analytics", "Statistiques de fréquentation", "Visitor analytics", "Statistiche delle visite"),
          o("legal", "Mentions légales, confidentialité, cookies (RGPD)", "Legal notice, privacy, cookies (GDPR)", "Note legali, privacy, cookie (GDPR)")
        ] },
      { id: "after", type: "checkbox", fr: "Après la mise en ligne", en: "After launch", it: "Dopo la messa online",
        hint: { fr: "Un forfait mensuel sur mesure est proposé en option.", en: "A tailored monthly package is available as an option.", it: "Un pacchetto mensile su misura è disponibile come opzione." },
        options: [
          o("maintenance", "Maintenance : mises à jour, sauvegardes, sécurité", "Maintenance: updates, backups, security", "Manutenzione: aggiornamenti, backup, sicurezza"),
          o("changes", "Modifications et évolutions sur demande", "Changes and new features on request", "Modifiche e nuove funzioni su richiesta"),
          o("monthly", "Forfait mensuel", "Monthly package", "Pacchetto mensile"),
          o("none", "Rien, je gère seul(e)", "Nothing, I'll manage it myself", "Niente, me ne occupo da solo")
        ] }
    ]
  },
  {
    id: "budget", fr: "Budget et délais", en: "Budget and timeline", it: "Budget e tempi", short: { fr: "Budget", en: "Budget", it: "Budget" },
    fields: [
      { id: "siret", type: "text", fr: "SIRET (si applicable)", en: "Company registration number (if any)", it: "Partita IVA (se applicabile)" },
      { id: "approver", type: "text", fr: "Qui valide le projet ?", en: "Who approves the project?", it: "Chi approva il progetto?" },

      { id: "budget", type: "radio", fr: "Budget envisagé", en: "Budget range", it: "Budget previsto",
        options: [
          o("lt1000", "Moins de 1 000 €", "Under €1,000", "Meno di 1.000 €"),
          o("1000-2000", "1 000 – 2 000 €", "€1,000 – €2,000", "1.000 – 2.000 €"),
          o("2000-4000", "2 000 – 4 000 €", "€2,000 – €4,000", "2.000 – 4.000 €"),
          o("4000-10000", "4 000 – 10 000 €", "€4,000 – €10,000", "4.000 – 10.000 €"),
          o("gt10000", "Plus de 10 000 €", "Over €10,000", "Più di 10.000 €"),
          o("unsure", "Je ne sais pas encore", "Not sure yet", "Non lo so ancora")
        ] },
      { id: "launch", type: "text", fr: "Date de mise en ligne souhaitée", en: "Desired launch date", it: "Data di messa online desiderata" },
      { id: "deadline", type: "text", fr: "Une échéance impérative ? (ouverture, événement, saison)", en: "Any hard deadline? (opening, event, season)", it: "Una scadenza tassativa? (apertura, evento, stagione)" },
      { id: "notes", type: "textarea", fr: "Autres remarques", en: "Anything else", it: "Altre osservazioni" },
      { id: "consent", type: "consent", req: true,
        fr: "J'accepte que mes réponses soient envoyées à Antony et Julien pour établir mon devis. Elles ne sont ni revendues ni partagées.",
        en: "I agree to my answers being sent to Antony and Julien to prepare my quote. They are never sold or shared.", it: "Accetto che le mie risposte vengano inviate ad Antony e Julien per preparare il preventivo. Non vengono mai vendute né condivise." }
    ]
  }
];

