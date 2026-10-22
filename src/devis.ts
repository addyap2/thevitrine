// The project questionnaire (/devis/, /en/quote/), ported from antonyaddy.com.
// SCHEMA lists the steps and questions in both languages; UI holds the page's
// words. Used by the page (static text) and by its script (building the steps).

export type Lang = "fr" | "en";
export type Opt = { v: string; fr: string; en: string };
export type Field = {
  id: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "radio" | "checkbox" | "consent";
  fr: string;
  en: string;
  req?: boolean;
  auto?: string;
  hint?: { fr: string; en: string };
  options?: Opt[];
  scale?: boolean;
  /** Shown only when that answer is selected: [fieldId, value]. */
  showIf?: [string, string];
};
export type Step = { id: string; fr: string; en: string; short: { fr: string; en: string }; fields: Field[] };

export const UI = {
  fr: {
    title: "Votre projet de site — Questionnaire | The Vitrine",
    description: "Décrivez votre projet de site en quelques minutes : Antony ou Julien vous répond avec un devis clair. Six étapes, en français ou en anglais.",
    eyebrow: "Questionnaire projet",
    h1: "Votre projet de site",
    lead: "Quelques minutes pour nous décrire votre projet. Remplissez seulement ce qui vous concerne : nous verrons le reste ensemble. Antony ou Julien vous répond avec un devis clair.",
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
    privacy: "Vos réponses sont envoyées par e-mail à Antony et Julien, uniquement pour préparer votre devis. Elles ne sont pas enregistrées sur ce site. Un brouillon reste dans votre navigateur jusqu'à l'envoi.",
  },
  en: {
    title: "Your website project — Questionnaire | The Vitrine",
    description: "Tell us about your website project in a few minutes, and Antony or Julien will come back to you with a clear quote. Six short steps, in English or French.",
    eyebrow: "Project questionnaire",
    h1: "Your website project",
    lead: "A few minutes to tell us about your project. Only fill in what applies to you; we'll go through the rest together. Antony or Julien will come back to you with a clear quote.",
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
    privacy: "Your answers are emailed to Antony and Julien, only to prepare your quote. They aren't stored on this site. A draft stays in your browser until you send it.",
  },
} as const;

function o(v: string, fr: string, en: string): Opt { return { v, fr, en }; }

export const SCHEMA: Step[] = [
  {
    id: "you", fr: "Vous et votre activité", en: "You and your business", short: { fr: "Vous", en: "You" },
    fields: [
      { id: "name", type: "text", req: true, auto: "name", fr: "Votre nom", en: "Your name" },
      { id: "email", type: "email", req: true, auto: "email", fr: "E-mail", en: "Email" },
      { id: "phone", type: "tel", auto: "tel", fr: "Téléphone", en: "Phone" },
      { id: "company", type: "text", auto: "organization", fr: "Nom de l'entreprise ou de l'association", en: "Business or organisation name" },
      { id: "siret", type: "text", fr: "SIRET (si applicable)", en: "Company registration number (if any)" },
      { id: "activity", type: "textarea", fr: "Que fait votre entreprise ? Qui sont vos clients ?", en: "What does your business do? Who are your customers?" },
      { id: "area", type: "text", fr: "Zone géographique couverte", en: "Area you serve" },
      { id: "approver", type: "text", fr: "Qui valide le projet ?", en: "Who approves the project?" }
    ]
  },
  {
    id: "goals", fr: "Objectifs du projet", en: "Project goals", short: { fr: "Objectifs", en: "Goals" },
    fields: [
      { id: "kind", type: "radio", fr: "S'agit-il d'un nouveau site ou d'une refonte ?", en: "Is this a new site or a redesign?",
        options: [o("new", "Nouveau site", "New site"), o("redesign", "Refonte d'un site existant", "Redesign of an existing site")] },
      { id: "current", type: "text", showIf: ["kind", "redesign"], fr: "Adresse du site actuel, et ce qui ne vous convient plus", en: "Current site address, and what isn't working" },
      { id: "goal", type: "checkbox", fr: "Objectif principal du site", en: "Main goal of the site",
        options: [
          o("calls", "Obtenir des appels ou des demandes de devis", "Get calls or quote requests"),
          o("sell", "Vendre en ligne", "Sell online"),
          o("showcase", "Présenter mes réalisations", "Showcase my work"),
          o("bookings", "Prise de rendez-vous ou réservation", "Appointments or bookings"),
          o("inform", "Informer mon public", "Inform my audience"),
          o("other", "Autre", "Other")
        ] },
      { id: "goalOther", type: "text", showIf: ["goal", "other"], fr: "Précisez", en: "Please specify" },
      { id: "refs", type: "textarea", fr: "2 ou 3 sites que vous aimez (concurrents ou non), et pourquoi", en: "2–3 websites you like (competitors or not), and why" }
    ]
  },
  {
    id: "site", fr: "Structure et fonctionnalités", en: "Structure and features", short: { fr: "Site", en: "Site" },
    fields: [
      { id: "pages", type: "textarea", fr: "Pages souhaitées et nombre approximatif", en: "Pages you want and rough number",
        hint: { fr: "Accueil, À propos, Services, Contact…", en: "Home, About, Services, Contact…" } },
      { id: "langs", type: "checkbox", fr: "Langues du site", en: "Site languages",
        options: [o("fr", "Français", "French"), o("en", "Anglais", "English"), o("other", "Autre", "Other")] },
      { id: "langsOther", type: "text", showIf: ["langs", "other"], fr: "Quelles autres langues ?", en: "Which other languages?" },
      { id: "blog", type: "radio", fr: "Souhaitez-vous un blog ou une rubrique actualités ?", en: "Do you want a blog or news section?",
        options: [o("yes", "Oui", "Yes"), o("no", "Non", "No"), o("discuss", "À discuter", "To discuss")] },
      { id: "features", type: "checkbox", fr: "Fonctionnalités", en: "Features",
        hint: { fr: "Cochez tout ce qui vous intéresse.", en: "Tick everything you're interested in." },
        options: [
          o("form", "Formulaire de contact ou de devis", "Contact or quote form"),
          o("booking", "Prise de rendez-vous en ligne", "Online booking"),
          o("shop", "Boutique / paiement en ligne", "Shop / online payment"),
          o("ordering", "Commande à emporter ou en ligne", "Takeaway or online ordering"),
          o("gallery", "Galerie photos", "Photo gallery"),
          o("map", "Plan d'accès (Google Maps)", "Map and directions"),
          o("reviews", "Avis clients", "Customer reviews"),
          o("newsletter", "Inscription à la newsletter", "Newsletter signup"),
          o("social", "Liens ou flux réseaux sociaux", "Social media links or feeds"),
          o("members", "Espace membre ou connexion", "Member area or login"),
          o("downloads", "Documents à télécharger", "Downloadable files"),
          o("tool", "Outil sur mesure ou tableau de bord", "Custom tool or dashboard")
        ] },
      { id: "products", type: "number", showIf: ["features", "shop"], fr: "Nombre de produits approximatif", en: "Rough number of products" },
      { id: "toolNeeds", type: "textarea", showIf: ["features", "tool"], fr: "Décrivez l'outil ou le tableau de bord", en: "Describe the tool or dashboard" },
      { id: "integrations", type: "text", fr: "Outils à connecter", en: "Tools to connect",
        hint: { fr: "Calendly, Stripe, CRM…", en: "Calendly, Stripe, CRM…" } }
    ]
  },
  {
    id: "content", fr: "Gestion, contenus et identité", en: "Managing, content and branding", short: { fr: "Contenus", en: "Content" },
    fields: [
      { id: "selfEdit", type: "radio", fr: "Souhaitez-vous mettre à jour le site vous-même ?", en: "Do you want to update the site yourself?",
        options: [o("yes", "Oui", "Yes"), o("no", "Non, je vous confierai les modifications", "No, I'll send changes to you")] },
      { id: "editParts", type: "text", showIf: ["selfEdit", "yes"], fr: "Quelles parties, et à quelle fréquence ?", en: "Which parts, and how often?" },
      { id: "comfort", type: "radio", scale: true, showIf: ["selfEdit", "yes"], fr: "Votre aisance avec l'informatique", en: "Your comfort with technology",
        hint: { fr: "1 = pas du tout, 5 = très à l'aise", en: "1 = not at all, 5 = very comfortable" },
        options: [o("1", "1", "1"), o("2", "2", "2"), o("3", "3", "3"), o("4", "4", "4"), o("5", "5", "5")] },
      { id: "support", type: "checkbox", showIf: ["selfEdit", "yes"], fr: "Souhaitez-vous être accompagné(e) ?", en: "Would you like support?",
        options: [o("training", "Formation", "Training session"), o("guide", "Guide écrit", "Written guide"), o("none", "Pas nécessaire", "Not needed")] },
      { id: "writer", type: "radio", fr: "Qui rédige les textes du site ?", en: "Who writes the site's text?",
        options: [o("me", "Moi", "Me"), o("you", "Vous", "You"), o("together", "À voir ensemble", "To decide together")] },
      { id: "photos", type: "checkbox", fr: "Photos et visuels", en: "Photos and images",
        options: [o("have", "J'ai des photos de qualité", "I have good photos"), o("stock", "Images libres de droits", "Stock images"), o("shoot", "Shooting à prévoir", "Photo shoot needed")] },
      { id: "ready", type: "text", fr: "Vos contenus sont-ils prêts ? Sinon, pour quand ?", en: "Is your content ready? If not, when will it be?" },
      { id: "brand", type: "radio", fr: "Avez-vous un logo, des couleurs ou une charte graphique ?", en: "Do you have a logo, colours or brand guidelines?",
        options: [o("yes", "Oui, je les fournis", "Yes, I'll supply them"), o("partly", "En partie", "Partly"), o("no", "Non, à créer", "No, to be created")] },
      { id: "style", type: "checkbox", fr: "Le style qui vous ressemble", en: "The style that fits you",
        options: [o("modern", "Moderne", "Modern"), o("minimal", "Épuré", "Minimal"), o("warm", "Chaleureux", "Warm"), o("premium", "Haut de gamme", "Premium"), o("playful", "Ludique", "Playful"), o("corporate", "Professionnel", "Corporate")] },
      { id: "dislike", type: "textarea", fr: "Ce que vous n'aimez pas (couleurs, styles, sites…)", en: "Anything you dislike (colours, styles, sites…)" }
    ]
  },
  {
    id: "tech", fr: "Technique et suivi", en: "Technical and after launch", short: { fr: "Technique", en: "Technical" },
    fields: [
      { id: "domain", type: "text", fr: "Nom de domaine : en possédez-vous un ? Lequel ?", en: "Domain name: do you own one? Which one?" },
      { id: "hosting", type: "radio", fr: "Hébergement", en: "Hosting",
        options: [o("have", "J'ai déjà un hébergeur", "I already have hosting"), o("you", "Je vous laisse vous en occuper", "I'd like you to handle it")] },
      { id: "emails", type: "radio", fr: "Adresses e-mail professionnelles (contact@votresite.fr)", en: "Professional email addresses",
        options: [o("have", "Déjà en place", "Already set up"), o("needed", "À créer", "Needed"), o("no", "Pas nécessaire", "Not needed")] },
      { id: "migrate", type: "text", showIf: ["kind", "redesign"], fr: "Contenus à récupérer de votre site actuel ?", en: "Content to bring over from your current site?" },
      { id: "seo", type: "checkbox", fr: "Visibilité et obligations légales", en: "SEO and legal",
        options: [
          o("seo", "Référencement naturel de base (SEO)", "Basic search engine optimisation"),
          o("local", "Référencement local et fiche Google", "Local SEO and Google Business Profile"),
          o("analytics", "Statistiques de fréquentation", "Visitor analytics"),
          o("legal", "Mentions légales, confidentialité, cookies (RGPD)", "Legal notice, privacy, cookies (GDPR)")
        ] },
      { id: "after", type: "checkbox", fr: "Après la mise en ligne", en: "After launch",
        hint: { fr: "Un forfait mensuel sur mesure est proposé en option.", en: "A tailored monthly package is available as an option." },
        options: [
          o("maintenance", "Maintenance : mises à jour, sauvegardes, sécurité", "Maintenance: updates, backups, security"),
          o("changes", "Modifications et évolutions sur demande", "Changes and new features on request"),
          o("monthly", "Forfait mensuel", "Monthly package"),
          o("none", "Rien, je gère seul(e)", "Nothing, I'll manage it myself")
        ] }
    ]
  },
  {
    id: "budget", fr: "Budget et délais", en: "Budget and timeline", short: { fr: "Budget", en: "Budget" },
    fields: [
      { id: "budget", type: "radio", fr: "Budget envisagé", en: "Budget range",
        options: [
          o("lt1000", "Moins de 1 000 €", "Under €1,000"),
          o("1000-2000", "1 000 – 2 000 €", "€1,000 – €2,000"),
          o("2000-4000", "2 000 – 4 000 €", "€2,000 – €4,000"),
          o("4000-10000", "4 000 – 10 000 €", "€4,000 – €10,000"),
          o("gt10000", "Plus de 10 000 €", "Over €10,000"),
          o("unsure", "Je ne sais pas encore", "Not sure yet")
        ] },
      { id: "launch", type: "text", fr: "Date de mise en ligne souhaitée", en: "Desired launch date" },
      { id: "deadline", type: "text", fr: "Une échéance impérative ? (ouverture, événement, saison)", en: "Any hard deadline? (opening, event, season)" },
      { id: "notes", type: "textarea", fr: "Autres remarques", en: "Anything else" },
      { id: "consent", type: "consent", req: true,
        fr: "J'accepte que mes réponses soient envoyées à Antony et Julien pour établir mon devis. Elles ne sont ni revendues ni partagées.",
        en: "I agree to my answers being sent to Antony and Julien to prepare my quote. They are never sold or shared." }
    ]
  }
];

