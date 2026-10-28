// Homepage FAQ, in French, English and Italian. Answers only state what the portfolio,
// the services copy and the contact cards already establish.
//
// An answer left as null is a placeholder: the question stays off the page
// (and out of the structured data) and the build log lists it, until it's
// written. Price and timescale come from src/data/business.ts.

import { priceFrom, timescale } from "./business";

type Text = { fr: string; en: string; it: string };
export interface Faq {
  id: string;
  q: Text;
  a: Text | null;
}

const fmtPrice = (lang: "fr" | "en" | "it") => (priceFrom === null ? "" : priceFrom.toLocaleString({ fr: "fr-FR", en: "en-GB", it: "it-IT" }[lang]));

export const faq: Faq[] = [
  {
    id: "price",
    q: { fr: "Combien coûte un site vitrine ?", en: "How much does a website cost?", it: "Quanto costa un sito vetrina?" },
    a: {
      fr:
        "Chaque site est chiffré sur mesure, selon le nombre de pages et les fonctions dont vous avez besoin (menu, réservation, plusieurs langues…). Le premier échange est gratuit, et vous recevez un devis clair avant tout engagement." +
        (priceFrom !== null ? ` À titre indicatif, comptez à partir de ${fmtPrice("fr")} €.` : ""),
      en:
        "Every site is priced to fit, depending on the number of pages and the features you need (menu, booking, several languages…). The first conversation is free, and you get a clear quote before committing to anything." +
        (priceFrom !== null ? ` As a guide, sites start from €${fmtPrice("en")}.` : ""),
      it:
        "Ogni sito viene preventivato su misura, in base al numero di pagine e alle funzioni di cui hai bisogno (menu, prenotazioni, più lingue…). Il primo contatto è gratuito e ricevi un preventivo chiaro prima di qualsiasi impegno." +
        (priceFrom !== null ? ` A titolo indicativo, i siti partono da ${fmtPrice("it")} €.` : ""),
    },
  },
  {
    id: "time",
    q: { fr: "En combien de temps mon site sera-t-il en ligne ?", en: "How long until my site is live?", it: "In quanto tempo il mio sito sarà online?" },
    a: {
      fr:
        (timescale ? `Comptez en général ${timescale.fr} pour un site vitrine. ` : "") +
        "Le délai dépend surtout du nombre de pages et de la rapidité avec laquelle nous recevons vos textes et vos photos. Il est précisé dans le devis.",
      en:
        (timescale ? `A showcase site usually takes ${timescale.en}. ` : "") +
        "It depends mostly on the number of pages and how quickly we receive your text and photos. The timescale is set out in the quote.",
      it:
        (timescale ? `Per un sito vetrina servono in genere ${timescale.it}. ` : "") +
        "Dipende soprattutto dal numero di pagine e dalla rapidità con cui riceviamo i tuoi testi e le tue foto. I tempi sono indicati nel preventivo.",
    },
  },
  {
    id: "who",
    q: { fr: "Qui va créer mon site ?", en: "Who will build my site?", it: "Chi realizzerà il mio sito?" },
    a: {
      fr: "Antony et Julien, ensemble : The Vitrine, c'est nous deux. Écrivez à l'un ou à l'autre, sur WhatsApp ou par le formulaire de contact : vous échangez directement avec nous, sans intermédiaire, du premier échange à la mise en ligne.",
      en: "Antony and Julien, together: The Vitrine is the two of us. Message either of us on WhatsApp or use the contact form: you deal with us directly, with no middlemen, from the first conversation to launch.",
      it: "Antony e Julien, insieme: The Vitrine siamo noi due. Scrivi a uno di noi su WhatsApp o usa il modulo di contatto: parli direttamente con noi, senza intermediari, dal primo contatto alla messa online.",
    },
  },
  {
    id: "ai",
    q: { fr: "Un site créé avec l'IA, c'est un site générique ?", en: "If you use AI, is my site generic?", it: "Un sito creato con l'IA è un sito generico?" },
    a: {
      fr: "Non. L'IA nous aide à concevoir et à construire plus vite, mais chaque site est pensé pour son activité : comparez la pizzeria, l'auto-école et le club de football de cette vitrine. Nous vérifions et peaufinons chaque détail à la main.",
      en: "No. AI helps us design and build faster, but every site is made for its business: compare the pizzeria, the driving school and the football club in this window. We check and polish every detail by hand.",
      it: "No. L'IA ci aiuta a progettare e costruire più velocemente, ma ogni sito è pensato per la sua attività: confronta la pizzeria, la scuola guida e il club di calcio di questa vetrina. Controlliamo e rifiniamo ogni dettaglio a mano.",
    },
  },
  {
    id: "mobile",
    q: { fr: "Mon site fonctionnera-t-il sur téléphone ?", en: "Will my site work on phones?", it: "Il mio sito funzionerà sul telefono?" },
    a: {
      fr: "Oui. La plupart de vos visiteurs arriveront depuis un téléphone : nos sites sont conçus d'abord pour le mobile, rapides à charger, avec l'appel, l'itinéraire ou la réservation à portée de pouce.",
      en: "Yes. Most of your visitors will arrive on a phone, so our sites are designed for mobile first and load fast, with calling, directions or booking within thumb's reach.",
      it: "Sì. La maggior parte dei tuoi visitatori arriverà da un telefono: i nostri siti sono pensati prima di tutto per il mobile, veloci da caricare, con chiamata, indicazioni o prenotazione a portata di pollice.",
    },
  },
  {
    id: "google",
    q: { fr: "Mon site sera-t-il bien référencé sur Google ?", en: "Will my site rank on Google?", it: "Il mio sito sarà ben posizionato su Google?" },
    a: {
      fr: "Nous construisons des sites rapides, bien structurés et décrits pour les moteurs de recherche : titres, descriptions, données structurées, adresse et horaires bien visibles. Personne ne peut garantir une première place sur Google, mais ces bases donnent à votre site toutes ses chances, surtout combinées à une fiche Google Business Profile.",
      en: "We build sites that are fast, well structured and described for search engines: titles, descriptions, structured data, and your address and hours clearly shown. Nobody can guarantee the top spot on Google, but these foundations give your site every chance, especially alongside a Google Business Profile.",
      it: "Realizziamo siti veloci, ben strutturati e descritti per i motori di ricerca: titoli, descrizioni, dati strutturati, indirizzo e orari ben visibili. Nessuno può garantire il primo posto su Google, ma queste basi danno al tuo sito tutte le possibilità, soprattutto insieme a una scheda Google Business Profile.",
    },
  },
  {
    id: "features",
    q: { fr: "Pouvez-vous ajouter un menu, la réservation ou la commande en ligne ?", en: "Can you add a menu, booking or online ordering?", it: "Potete aggiungere un menu, le prenotazioni o gli ordini online?" },
    a: {
      fr: "Oui : plusieurs sites de cette vitrine ont une carte complète, un menu de la semaine, la réservation de table ou de rendez-vous, ou la commande à emporter. Dites-nous comment vos clients vous contactent aujourd'hui, et nous partons de là.",
      en: "Yes: several sites in this window have a full menu, a weekly menu, table or appointment booking, or takeaway ordering. Tell us how your customers reach you today and we'll start from there.",
      it: "Sì: diversi siti di questa vetrina hanno un menu completo, un menu settimanale, la prenotazione di tavoli o appuntamenti, oppure gli ordini da asporto. Raccontaci come ti contattano oggi i tuoi clienti e partiamo da lì.",
    },
  },
  {
    id: "languages",
    q: { fr: "Mon site peut-il être en plusieurs langues ?", en: "Can my site be in several languages?", it: "Il mio sito può essere in più lingue?" },
    a: {
      fr: "Oui, dans toutes les langues dont vos visiteurs ont besoin : le Ristorante da Lola, par exemple, existe en italien, anglais, français et allemand. Pratique sur la Côte d'Azur, où une partie de vos clients ne parle pas français.",
      en: "Yes, in whatever languages your visitors need: Ristorante da Lola, for example, is in Italian, English, French and German. Handy on the French Riviera, where some of your customers won't speak French.",
      it: "Sì, in tutte le lingue di cui i tuoi visitatori hanno bisogno: il Ristorante da Lola, per esempio, è in italiano, inglese, francese e tedesco. Prezioso nelle zone turistiche, dove parte dei clienti non parla la tua lingua.",
    },
  },
  {
    id: "where",
    q: { fr: "Travaillez-vous en dehors du Var ?", en: "Do you only work in France?", it: "Lavorate anche in Italia?" },
    a: {
      fr: "Oui. Nous travaillons dans tout le Var et les Alpes-Maritimes, et tout peut aussi se faire à distance : nos sites tournent déjà au Royaume-Uni et en Italie.",
      en: "No. We're based in the Var and work across the Var and Alpes-Maritimes, and everything can also be done remotely: our sites already run in the United Kingdom and Italy.",
      it: "Sì. Siamo in Costa Azzurra, nel Var, e tutto può svolgersi anche a distanza: abbiamo già siti online in Italia e nel Regno Unito.",
    },
  },
  // Placeholders: write the answer to show the question.
  {
    id: "hosting",
    q: { fr: "Qui s'occupe de l'hébergement et du nom de domaine ?", en: "Who looks after hosting and the domain name?", it: "Chi si occupa dell'hosting e del nome di dominio?" },
    a: {
      fr: "Nous nous en occupons. Votre site est hébergé chez Vercel, un hébergeur rapide et fiable utilisé par de nombreux sites professionnels, et votre nom de domaine (votre adresse, par exemple votre-commerce.fr) est réservé chez OVH. Si vous avez déjà un nom de domaine, nous le relions simplement à votre nouveau site.",
      en: "We do. Your site is hosted on Vercel, a fast, reliable host used by many professional websites, and your domain name (your address, for example your-business.com) is registered with OVH. If you already have a domain name, we simply connect it to your new site.",
      it: "Ce ne occupiamo noi. Il tuo sito è ospitato su Vercel, un hosting veloce e affidabile usato da molti siti professionali, e il tuo nome di dominio (il tuo indirizzo, per esempio iltuonegozio.it) è registrato presso OVH. Se hai già un nome di dominio, lo colleghiamo semplicemente al nuovo sito.",
    },
  },
  {
    id: "edits",
    q: { fr: "Pourrai-je modifier mon site moi-même ?", en: "Can I update my site myself?", it: "Potrò modificare il sito da solo?" },
    a: {
      fr: "Oui, si vous le souhaitez : vous pouvez mettre à jour vous-même vos textes, vos horaires ou vos photos. Vous préférez ne pas vous en occuper ? Nous faisons les mises à jour pour vous, dans le cadre d'un abonnement.",
      en: "Yes, if you'd like to: you can update your text, opening hours or photos yourself. Would you rather not deal with it? We can make the updates for you, as part of a subscription.",
      it: "Sì, se vuoi: puoi aggiornare da solo i testi, gli orari o le foto. Preferisci non occupartene? Facciamo noi gli aggiornamenti, con un abbonamento.",
    },
  },
  {
    id: "support",
    q: { fr: "Que se passe-t-il après la mise en ligne ?", en: "What happens after the site goes live?", it: "Cosa succede dopo la messa online?" },
    a: {
      fr: "Cela dépend de vos souhaits, et nous en convenons ensemble pour chaque projet : vous gérez vous-même les petites mises à jour, vous nous les confiez avec un abonnement, ou vous faites appel à nous quand votre site doit évoluer (nouvelle page, nouvelle langue…). Dans tous les cas, vous gardez la même personne à qui écrire.",
      en: "It depends on what you'd like, and we agree it together for each project: you handle small updates yourself, you leave them to us with a subscription, or you call on us when your site needs to grow (a new page, a new language…). Either way, you keep the same person to write to.",
      it: "Dipende da cosa preferisci, e lo decidiamo insieme per ogni progetto: gestisci da solo i piccoli aggiornamenti, li affidi a noi con un abbonamento, oppure ci chiami quando il sito deve crescere (una nuova pagina, una nuova lingua…). In ogni caso, hai sempre le stesse persone a cui scrivere.",
    },
  },
];

export const missingFaqAnswers = () => faq.filter((f) => f.a === null).map((f) => f.id);
