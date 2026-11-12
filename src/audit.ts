// Words for the "Audit express" page (src/components/AuditPage.astro), in
// French, English and Italian. Check ids match api/audit.js; "{v}" is the
// measured value.

export type L3 = { fr: string; en: string; it: string };
type Status = "good" | "warn" | "bad";

export const CHECKS: Record<string, { label: L3 } & Partial<Record<Status, L3>>> = {
  https: {
    label: { fr: "Connexion sécurisée (HTTPS)", en: "Secure connection (HTTPS)", it: "Connessione sicura (HTTPS)" },
    good: { fr: "La page a été récupérée en HTTPS. Cela ne vérifie pas toute la sécurité du site.", en: "The page was fetched over HTTPS. This does not check the site's overall security.", it: "Pagina recuperata in HTTPS. La sicurezza complessiva del sito non è verificata." },
    bad: { fr: "Pas de cadenas : les navigateurs affichent « Non sécurisé ».", en: "No padlock: browsers show \"Not secure\".", it: "Niente lucchetto: i browser mostrano «Non sicuro»." },
  },
  mobile: {
    label: { fr: "Réglage pour les téléphones", en: "Phone viewport setting", it: "Impostazione per telefoni" },
    good: { fr: "Le réglage pour les écrans mobiles est présent. L'affichage réel reste à tester sur téléphone.", en: "The mobile viewport setting is present. The actual layout still needs testing on a phone.", it: "Impostazione per schermi mobili presente. La visualizzazione va comunque provata su telefono." },
    bad: { fr: "Le réglage de largeur pour les écrans mobiles n'a pas été trouvé dans le HTML.", en: "No device-width viewport setting was found in the HTML.", it: "Impostazione device-width non trovata nel codice HTML." },
  },
  speed: {
    label: { fr: "Récupération du HTML", en: "HTML fetch time", it: "Tempo di recupero HTML" },
    good: { fr: "{v} ms depuis notre serveur. Images, scripts et affichage ne sont pas mesurés.", en: "{v} ms from our server. Images, scripts and rendering are not measured.", it: "{v} ms dal nostro server. Immagini, script e rendering non sono misurati." },
    warn: { fr: "{v} ms depuis notre serveur : délai à examiner, variable selon le réseau.", en: "{v} ms from our server: worth investigating; network conditions can vary.", it: "{v} ms dal nostro server: da approfondire; le condizioni di rete possono variare." },
    bad: { fr: "{v} ms depuis notre serveur : récupération lente lors de ce contrôle.", en: "{v} ms from our server: the HTML fetch was slow in this check.", it: "{v} ms dal nostro server: recupero HTML lento in questo controllo." },
  },
  weight: {
    label: { fr: "Poids du HTML seul", en: "HTML size only", it: "Peso del solo HTML" },
    good: { fr: "Légère ({v} Ko).", en: "Light ({v} KB).", it: "Leggera ({v} KB)." },
    warn: { fr: "Assez lourde ({v} Ko).", en: "Fairly heavy ({v} KB).", it: "Piuttosto pesante ({v} KB)." },
    bad: { fr: "HTML volumineux ({v} Ko), hors images, styles et scripts.", en: "Large HTML document ({v} KB), excluding images, styles and scripts.", it: "HTML voluminoso ({v} KB), esclusi immagini, stili e script." },
  },
  title: {
    label: { fr: "Titre pour Google", en: "Title for Google", it: "Titolo per Google" },
    good: { fr: "Titre présent ({v} caractères). Sa pertinence reste à vérifier.", en: "Present ({v} characters). Search engines may use different text.", it: "Presente ({v} caratteri). I motori possono mostrare un testo diverso." },
    warn: { fr: "Titre présent ({v} caractères). Vérifiez qu'il est précis et lisible.", en: "Title present ({v} characters). Check that it is clear and specific.", it: "Titolo presente ({v} caratteri). Verifica che sia chiaro e specifico." },
    bad: { fr: "Balise title absente du HTML récupéré.", en: "No title element found in the fetched HTML.", it: "Elemento title assente nel codice HTML recuperato." },
  },
  description: {
    label: { fr: "Description pour Google", en: "Description for Google", it: "Descrizione per Google" },
    good: { fr: "Description présente ({v} caractères). Google peut afficher un autre extrait.", en: "Present ({v} characters). Search engines may use different text.", it: "Presente ({v} caratteri). I motori possono mostrare un testo diverso." },
    warn: { fr: "Description présente ({v} caractères). Sa pertinence reste à vérifier.", en: "Description present ({v} characters). Its relevance still needs review.", it: "Descrizione presente ({v} caratteri). La pertinenza resta da verificare." },
    bad: { fr: "Description absente : Google peut créer un extrait à partir du contenu de la page.", en: "Description missing: Google may create a snippet from the page content.", it: "Descrizione assente: Google può creare uno snippet dal contenuto della pagina." },
  },
  h1: {
    label: { fr: "Titre principal de la page", en: "Main page heading", it: "Titolo principale della pagina" },
    good: { fr: "Un titre h1 trouvé dans le HTML.", en: "One h1 heading found in the HTML.", it: "Un titolo h1 trovato nel codice HTML." },
    warn: { fr: "{v} titres h1 trouvés : vérifiez la hiérarchie de la page.", en: "{v} h1 headings found: review the page hierarchy.", it: "{v} titoli h1 trovati: verifica la gerarchia della pagina." },
    bad: { fr: "Aucun titre principal.", en: "No main heading.", it: "Nessun titolo principale." },
  },
  phone: {
    label: { fr: "Numéro cliquable", en: "Tappable phone number", it: "Numero cliccabile" },
    good: { fr: "On peut vous appeler d'un geste.", en: "People can call you in one tap.", it: "Ti chiamano con un tocco." },
    warn: { fr: "Aucun numéro cliquable trouvé dans le HTML de cette page.", en: "No tappable phone number found in this page's HTML.", it: "Nessun numero cliccabile trovato nel codice HTML di questa pagina." },
  },
  structured: {
    label: { fr: "Informations pour Google", en: "Information for Google", it: "Informazioni per Google" },
    good: { fr: "Un bloc JSON-LD est présent. Son contenu et sa validité ne sont pas vérifiés.", en: "A JSON-LD block is present. Its content and validity have not been checked.", it: "Blocco JSON-LD presente. Contenuto e validità non sono verificati." },
    warn: { fr: "Aucun bloc JSON-LD détecté. D'autres formats peuvent être présents.", en: "No JSON-LD block detected. Other formats may be present.", it: "Nessun blocco JSON-LD rilevato. Possono essere presenti altri formati." },
  },
  share: {
    label: { fr: "Aperçu quand on partage le lien", en: "Preview when the link is shared", it: "Anteprima quando si condivide il link" },
    good: { fr: "Une image de partage est déclarée. Son accessibilité n'a pas été testée.", en: "A sharing image is declared. Its availability has not been tested.", it: "Immagine di condivisione dichiarata. La disponibilità non è verificata." },
    warn: { fr: "Aucune image og:image trouvée dans le HTML.", en: "No og:image declaration found in the HTML.", it: "Nessuna dichiarazione og:image trovata nel codice HTML." },
  },
  lang: {
    label: { fr: "Langue déclarée", en: "Declared language", it: "Lingua dichiarata" },
    good: { fr: "La langue de la page est indiquée.", en: "The page's language is set.", it: "La lingua della pagina è indicata." },
    warn: { fr: "Langue non indiquée.", en: "Language not set.", it: "Lingua non indicata." },
  },
  alt: {
    label: { fr: "Descriptions des images", en: "Image descriptions", it: "Descrizioni delle immagini" },
    good: { fr: "Toutes les images ont un attribut alt. La qualité des descriptions reste à vérifier.", en: "Every image has an alt attribute. Description quality still needs review.", it: "Ogni immagine ha un attributo alt. La qualità delle descrizioni resta da verificare." },
    warn: { fr: "{v} image(s) sans description.", en: "{v} image(s) without a description.", it: "{v} immagine/i senza descrizione." },
    bad: { fr: "{v} images sans attribut alt : vérifiez leur utilité pour les lecteurs d'écran.", en: "{v} images without an alt attribute: review their purpose for screen reader users.", it: "{v} immagini senza attributo alt: verifica lo scopo per chi usa lettori di schermo." },
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
      bad: { fr: "Vous indiquez ne pas pouvoir modifier le site. Prévoyez un accès ou un service de mise à jour.", en: "You say you cannot update the site. Arrange editing access or a maintenance service.", it: "Indichi di non poter aggiornare il sito. Prevedi accesso alla modifica o un servizio di manutenzione." },
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
      warn: { fr: "Vous ne savez pas s'il apporte des demandes. Commencez par suivre les contacts reçus.", en: "You are unsure whether it brings enquiries. Start tracking incoming contacts.", it: "Non sai se porta richieste. Inizia a monitorare i contatti ricevuti." },
      bad: { fr: "Vous indiquez ne pas recevoir de demandes. Examinez le trafic et le parcours de contact avant de décider d'une refonte.", en: "You report no enquiries. Review traffic and the contact flow before deciding on a redesign.", it: "Indichi di non ricevere richieste. Verifica traffico e percorso di contatto prima di decidere un rifacimento." },
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
      bad: { fr: "Vous indiquez que des informations sont dépassées. Mettez à jour les horaires, prix et services concernés.", en: "You report out-of-date information. Update the affected hours, prices and services.", it: "Indichi informazioni superate. Aggiorna gli orari, prezzi e servizi interessati." },
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
      good: { fr: "Vous n'indiquez pas de besoin dans une autre langue. Les traductions n'ont pas été contrôlées.", en: "You report no need for another language. Translations have not been checked.", it: "Non indichi necessità in altre lingue. Le traduzioni non sono state controllate." },
      warn: { fr: "Vous accueillez des clients dans d'autres langues. Vérifiez qu'ils trouvent les informations et le contact dans leur langue ; les traductions n'ont pas été contrôlées.", en: "You serve customers in other languages. Check that they can find key information and contact you in their language; translations have not been checked.", it: "Accogli clienti di altre lingue. Verifica che trovino informazioni essenziali e contatti nella loro lingua; le traduzioni non sono state controllate." },
    },
  },
];

export const UIA = {
  fr: {
    title: "Audit express de votre site internet | The Vitrine",
    description: "Entrez l'adresse d'une page : obtenez un premier bilan technique et des pistes concrètes pour l'améliorer. Gratuit, sans inscription.",
    eyebrow: "Outil gratuit",
    h1: "Audit express de votre site",
    lead: "Entrez l'adresse d'une page : obtenez un premier bilan technique et des pistes concrètes pour l'améliorer.",
    urlLabel: "Adresse de votre site",
    urlPlaceholder: "www.votre-site.fr",
    questions: "Quatre questions, si vous voulez",
    run: "Lancer l'audit",
    running: "Analyse en cours…",
    scoreLabel: "Indice HTML",
    verdict: { high: "Les bases contrôlées sont en place.", mid: "Quelques points techniques à améliorer.", low: "Plusieurs points techniques à examiner." },
    verdictSub: { high: "Ce premier bilan ne remplace pas un test complet de votre site.", mid: "Commencez par les actions proposées ci-dessous.", low: "Ces résultats seuls ne permettent pas de conclure qu'une refonte est nécessaire." },
    checked: "Page analysée : {host}. Contrôle automatique du HTML reçu, sans exécuter les scripts du site.",
    yourAnswers: "Vos réponses",
    cta: "Discuter de ces résultats",
    ctaAlt: "Voir notre offre de refonte",
    again: "Analyser un autre site",
    errors: {
      url: "Cette adresse ne semble pas valide.",
      unreachable: "Impossible de joindre ce site. Vérifiez l'adresse.",
      timeout: "Le contrôle a dépassé son délai. Le site peut être lent ou bloquer notre outil. Réessayez plus tard.",
      status: "Le site répond avec une erreur.",
      nothtml: "Cette adresse ne mène pas à une page web.",
      large: "Le HTML dépasse la limite de 1,5 Mo de cet outil. Le bilan n'a pas pu être réalisé.",
      rate: "Trop d'audits d'affilée : réessayez dans quelques minutes.",
      generic: "L'audit n'a pas pu aboutir. Réessayez dans un instant.",
    },
    status: { good: "Bon", warn: "À améliorer", bad: "À corriger" },
  },
  en: {
    title: "Free website check | The Vitrine",
    description: "Enter a page address for an initial technical check and practical next steps. Free, no sign-up.",
    eyebrow: "Free tool",
    h1: "Quick website check",
    lead: "Enter a page address for an initial technical check and practical next steps.",
    urlLabel: "Your website's address",
    urlPlaceholder: "www.your-site.com",
    questions: "Four questions, if you like",
    run: "Check my site",
    running: "Checking…",
    scoreLabel: "HTML indicator",
    verdict: { high: "The checked basics are in place.", mid: "Some technical points need attention.", low: "Several technical points need review." },
    verdictSub: { high: "This first check does not replace a full website review.", mid: "Start with the suggested actions below.", low: "These results alone do not establish that a redesign is needed." },
    checked: "Page checked: {host}. Automated check of the received HTML, without running the site's scripts.",
    yourAnswers: "Your answers",
    cta: "Discuss these results",
    ctaAlt: "See our redesign service",
    again: "Check another site",
    errors: {
      url: "That address doesn't look valid.",
      unreachable: "We couldn't reach that site. Check the address.",
      timeout: "The check timed out. The site may be slow or blocking our tool. Try again later.",
      status: "The site responds with an error.",
      nothtml: "That address doesn't lead to a web page.",
      large: "The HTML exceeds this tool's 1.5 MB limit. The check could not be completed.",
      rate: "Too many checks in a row: try again in a few minutes.",
      generic: "The check didn't go through. Try again in a moment.",
    },
    status: { good: "Good", warn: "Could be better", bad: "Needs fixing" },
  },
  it: {
    title: "Check-up gratuito del sito | The Vitrine",
    description: "Inserisci l'indirizzo di una pagina: ricevi un primo controllo tecnico e suggerimenti concreti. Gratuito, senza registrazione.",
    eyebrow: "Strumento gratuito",
    h1: "Check-up rapido del tuo sito",
    lead: "Inserisci l'indirizzo di una pagina: ricevi un primo controllo tecnico e suggerimenti concreti.",
    urlLabel: "Indirizzo del tuo sito",
    urlPlaceholder: "www.iltuosito.it",
    questions: "Quattro domande, se vuoi",
    run: "Avvia il check-up",
    running: "Analisi in corso…",
    scoreLabel: "Indicatore HTML",
    verdict: { high: "Le basi controllate sono presenti.", mid: "Alcuni punti tecnici da migliorare.", low: "Diversi punti tecnici da esaminare." },
    verdictSub: { high: "Questo primo controllo non sostituisce una verifica completa del sito.", mid: "Inizia dalle azioni suggerite qui sotto.", low: "Questi risultati da soli non indicano che serva rifare il sito." },
    checked: "Pagina analizzata: {host}. Controllo automatico del codice HTML ricevuto, senza eseguire gli script del sito.",
    yourAnswers: "Le tue risposte",
    cta: "Parliamo di questi risultati",
    ctaAlt: "Scopri il nostro servizio di rifacimento",
    again: "Analizza un altro sito",
    errors: {
      url: "Questo indirizzo non sembra valido.",
      unreachable: "Impossibile raggiungere il sito. Controlla l'indirizzo.",
      timeout: "Tempo di controllo scaduto. Il sito potrebbe essere lento o bloccare lo strumento. Riprova più tardi.",
      status: "Il sito risponde con un errore.",
      nothtml: "Questo indirizzo non porta a una pagina web.",
      large: "Il codice HTML supera il limite di 1,5 MB dello strumento. Controllo non completato.",
      rate: "Troppi check-up di fila: riprova tra qualche minuto.",
      generic: "Il check-up non è riuscito. Riprova tra un attimo.",
    },
    status: { good: "Bene", warn: "Da migliorare", bad: "Da correggere" },
  },
} as const;

/** Handed to the questionnaire (sessionStorage) so the quote request starts filled in. */
export const AUDIT_HANDOFF = "vitrine-audit-handoff";

export const ACTIONS: Record<string, L3> = {
  "https": {
    "fr": "Activez HTTPS et redirigez les adresses HTTP vers leur version sécurisée.",
    "en": "Enable HTTPS and redirect HTTP addresses to the secure version.",
    "it": "Attiva HTTPS e reindirizza gli indirizzi HTTP alla versione sicura."
  },
  "mobile": {
    "fr": "Ajoutez le réglage viewport, puis testez les textes, boutons et débordements sur téléphone.",
    "en": "Add the viewport setting, then test text, buttons and overflow on a phone.",
    "it": "Aggiungi il viewport, poi prova testi, pulsanti e contenuti fuori schermo su telefono."
  },
  "speed": {
    "fr": "Répétez la mesure et examinez les redirections et l'hébergement. Testez aussi le chargement complet avec PageSpeed Insights.",
    "en": "Repeat the measurement and review redirects and hosting. Also test full loading with PageSpeed Insights.",
    "it": "Ripeti la misura e verifica reindirizzamenti e hosting. Prova il caricamento completo con PageSpeed Insights."
  },
  "weight": {
    "fr": "Réduisez le HTML inutile. Mesurez séparément les images, scripts et styles pour connaître le poids total.",
    "en": "Reduce unnecessary HTML. Measure images, scripts and styles separately to find the total page weight.",
    "it": "Riduci il codice HTML inutile. Misura separatamente immagini, script e stili per conoscere il peso totale."
  },
  "title": {
    "fr": "Donnez à la page un titre précis qui décrit son contenu et votre activité.",
    "en": "Give the page a specific title describing its content and your business.",
    "it": "Assegna alla pagina un titolo preciso che descriva contenuto e attività."
  },
  "description": {
    "fr": "Rédigez un résumé utile et propre à cette page. Sa longueur seule ne détermine pas sa qualité.",
    "en": "Write a useful summary specific to this page. Length alone does not determine its quality.",
    "it": "Scrivi un riepilogo utile e specifico della pagina. La sola lunghezza non ne determina la qualità."
  },
  "h1": {
    "fr": "Utilisez un titre principal descriptif et vérifiez que les sous-titres suivent une hiérarchie claire.",
    "en": "Use a descriptive main heading and check that subheadings follow a clear hierarchy.",
    "it": "Usa un titolo principale descrittivo e verifica la gerarchia dei sottotitoli."
  },
  "phone": {
    "fr": "Si les appels sont utiles à votre activité, rendez votre numéro cliquable avec un lien tel:.",
    "en": "If calls matter to your business, make your phone number tappable with a tel: link.",
    "it": "Se le chiamate sono utili alla tua attività, rendi il numero cliccabile con un link tel:."
  },
  "structured": {
    "fr": "Si cela convient à la page, ajoutez des données structurées pertinentes et validez-les avec l'outil de Google.",
    "en": "Where appropriate, add relevant structured data and validate it with Google's testing tool.",
    "it": "Se adatto alla pagina, aggiungi dati strutturati pertinenti e convalidali con lo strumento di Google."
  },
  "share": {
    "fr": "Déclarez une image og:image accessible et vérifiez l'aperçu dans les services où vous partagez le lien.",
    "en": "Declare an accessible og:image and check previews in the services where you share the link.",
    "it": "Dichiara un'immagine og:image accessibile e verifica l'anteprima nei servizi usati per condividere il link."
  },
  "lang": {
    "fr": "Indiquez la langue principale avec l'attribut lang de la page, pour les navigateurs et lecteurs d'écran.",
    "en": "Set the page's main language with the lang attribute for browsers and screen readers.",
    "it": "Indica la lingua principale con l'attributo lang per browser e lettori di schermo."
  },
  "alt": {
    "fr": "Décrivez les images utiles. Pour une image purement décorative, utilisez un attribut alt vide.",
    "en": "Describe meaningful images. Use an empty alt attribute for purely decorative images.",
    "it": "Descrivi le immagini utili. Per immagini puramente decorative, usa un attributo alt vuoto."
  }
};

export const AUDIT_DETAILS = {
  "fr": {
    "scope": "Gratuit, sans inscription. Une seule page est contrôlée ; les réponses facultatives ne changent pas la note technique.",
    "technical": "Contrôles automatiques",
    "outsideScore": "hors note",
    "context": "Conseils selon vos réponses · hors note",
    "priorities": "Par où commencer",
    "action": "À faire",
    "method": "Comment lire cette note",
    "methodText": "Indicateur des contrôles HTML uniquement : chaque contrôle compte autant (bon = 1, à améliorer = 0,5, à corriger = 0), puis moyenne sur 100. Le téléphone, les données structurées et vos réponses sont hors note. Les seuils de taille, de délai et de longueur sont indicatifs. Ce bilan ne mesure ni les ventes, ni le référencement réel, ni l'accessibilité complète, ni le chargement sur téléphone.",
    "summary": "{n} contrôles dans la note · {issues} points à examiner",
    "noActions": "Aucun point signalé par les contrôles inclus dans la note. Testez aussi le parcours de contact et l'affichage réel sur téléphone.",
    "noScript": "Activez JavaScript pour lancer ce contrôle, ou contactez-nous pour un bilan.",
    "loading": "Contrôle d'une seule page en cours. Cela peut prendre une dizaine de secondes.",
    "ctaHelp": "Besoin d'aide pour choisir quoi corriger ? Ces résultats seront repris dans le questionnaire de votre projet."
  },
  "en": {
    "scope": "Free, no sign-up. One page is checked; optional answers do not change the technical score.",
    "technical": "Automated checks",
    "outsideScore": "outside the score",
    "context": "Advice from your answers · outside the score",
    "priorities": "Where to start",
    "action": "Next step",
    "method": "How to read this score",
    "methodText": "HTML check indicator only: every check counts equally (good = 1, could be better = 0.5, needs fixing = 0), averaged out of 100. Phone links, structured data and your answers are excluded. Size, time and length thresholds are guidelines. This does not measure sales, actual search rankings, full accessibility or loading on a phone.",
    "summary": "{n} scored checks · {issues} points to review",
    "noActions": "No issues flagged by the scored checks. Also test the contact flow and actual layout on a phone.",
    "noScript": "Enable JavaScript to run this check, or contact us for a review.",
    "loading": "Checking one page. This can take around ten seconds.",
    "ctaHelp": "Need help choosing what to fix? These results will be included in your project questionnaire."
  },
  "it": {
    "scope": "Gratuito, senza registrazione. Si controlla una pagina; le risposte facoltative non cambiano il voto tecnico.",
    "technical": "Controlli automatici",
    "outsideScore": "fuori voto",
    "context": "Consigli dalle tue risposte · fuori voto",
    "priorities": "Da dove iniziare",
    "action": "Cosa fare",
    "method": "Come leggere il voto",
    "methodText": "Indicatore dei soli controlli HTML: ogni controllo pesa uguale (bene = 1, da migliorare = 0,5, da correggere = 0), con media su 100. Telefono, dati strutturati e risposte sono esclusi. Le soglie di peso, tempo e lunghezza sono indicative. Non misura vendite, posizionamento reale, accessibilità completa o caricamento su telefono.",
    "summary": "{n} controlli nel voto · {issues} punti da esaminare",
    "noActions": "Nessun problema segnalato dai controlli inclusi nel voto. Prova anche il percorso di contatto e la visualizzazione reale su telefono.",
    "noScript": "Attiva JavaScript per avviare il controllo, oppure contattaci per una verifica.",
    "loading": "Controllo di una pagina in corso. Può richiedere una decina di secondi.",
    "ctaHelp": "Vuoi aiuto a scegliere cosa correggere? I risultati saranno inclusi nel questionario del progetto."
  }
} as const;
