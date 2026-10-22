// Case studies, one per project, keyed by the project's slug in projects.json.
// Drafted on 22 October 2026 from what each live site shows: no results,
// figures or quotes that the site itself doesn't state.
//
// status "draft":     the page exists for review but is noindex, left out of
//                     the sitemap and not linked from the homepage.
// status "published": indexed, in the sitemap, and the card's title links to it.
// All published on 22 October 2026, at Antony's request.

type Text = { fr: string; en: string };
export interface CaseStudy {
  status: "draft" | "published";
  /** Town and area (or the field, when there's no single place), shown above the title. */
  place: Text;
  /** Who the client is. */
  client: Text;
  /** What the site does, one feature per line. */
  built: { fr: string[]; en: string[] };
  /** Visible design decisions. */
  design: Text;
}

export const cases: Record<string, CaseStudy> = {
  "ristorante-lola": {
    status: "published",
    place: { fr: "Fermignano, Marches (Italie)", en: "Fermignano, Marche (Italy)" },
    client: {
      fr: "Le Ristorante da Lola est une pizzeria familiale de Fermignano, dans les Marches. On y sert la cuisine de la région dans une atmosphère simple : pâtes faites maison, viandes à la braise et une large carte de pizzas cuites au feu de bois. Le restaurant accueille aussi les familles, avec un boulodrome attenant et une aire de jeux.",
      en: "Ristorante da Lola is a family pizzeria in Fermignano, in Italy's Marche region. It serves the region's cooking in a simple, friendly setting: homemade pasta, meat from the grill and a long list of wood-fired pizzas. Families are welcome too, with a bocce court next door and a playground outside.",
    },
    built: {
      fr: [
        "Un site en quatre langues (italien, anglais, français, allemand) pour les habitants comme pour les touristes.",
        "Un bandeau toujours visible avec les horaires, le jour de fermeture et le numéro pour réserver.",
        "La carte complète classée par catégorie, des antipasti aux desserts.",
        "Une galerie, la présentation du lieu et de l'équipe, et une FAQ.",
        "Un accès direct à WhatsApp et à l'itinéraire.",
      ],
      en: [
        "A site in four languages (Italian, English, French, German) for locals and visitors alike.",
        "A bar that always shows opening hours, the closing day and the number to book a table.",
        "The full menu, sorted by category from antipasti to desserts.",
        "A gallery, an introduction to the place and the team, and an FAQ.",
        "One-tap WhatsApp and directions.",
      ],
    },
    design: {
      fr: "Des tons chauds de braise et de bois, une typographie à l'italienne et de grandes photos de cuisine : le site donne envie de s'attabler avant même d'avoir lu la carte. Les trois spécialités de la maison sont mises en avant dès l'accueil, pour que l'on comprenne en quelques secondes ce qui fait la différence.",
      en: "Warm ember and wood tones, Italian-style type and large kitchen photos make you want to sit down before you've even read the menu. The three house specialities lead the home page, so visitors grasp in seconds what makes the place different.",
    },
  },

  "wall-street": {
    status: "published",
    place: { fr: "Fréjus, Var", en: "Fréjus, Var" },
    client: {
      fr: "Wall Street est un bar-brasserie de Fréjus, un pub à l'anglaise version méditerranéenne : tables en tonneaux, bières Paulaner et Delirium, cocktails, concerts et DJ sets toute la semaine, et tous les grands matchs sur écran géant. En cuisine, tout est fait maison avec des produits frais.",
      en: "Wall Street is a bar and brasserie in Fréjus: an English-style pub with a Mediterranean twist. Think barrel tables, Paulaner and Delirium on tap, cocktails, live music and DJ sets all week, and every big match on the big screen. Everything in the kitchen is homemade from fresh produce.",
    },
    built: {
      fr: [
        "Le menu de la semaine, plat du jour par plat du jour, qui défile en haut de page.",
        "La carte complète avec les prix, filtrable par catégorie.",
        "L'agenda de la semaine : concerts, soirées et matchs retransmis.",
        "Un indicateur « ouvert maintenant », la réservation et l'accès au plan.",
        "Une FAQ et une version anglaise pour la clientèle de passage.",
      ],
      en: [
        "The week's menu, dish of the day by dish of the day, scrolling across the top of the page.",
        "The full menu with prices, filterable by category.",
        "The week's agenda: gigs, theme nights and live matches.",
        "An \"open now\" indicator, table booking and directions.",
        "An FAQ and an English version for visitors.",
      ],
    },
    design: {
      fr: "Une identité de pub assumée : grands titres en capitales, couleurs franches et bandeaux qui défilent comme un écran de bar. Le site vit au rythme de l'établissement : ce qui change chaque semaine, la carte du jour et l'agenda, est ce que l'on voit en premier.",
      en: "An unashamed pub identity: big capital headlines, bold colours and scrolling banners like a bar screen. The site keeps pace with the venue: what changes each week, the dish of the day and the agenda, is what you see first.",
    },
  },

  "so-good-diner": {
    status: "published",
    place: { fr: "Fréjus, Var", en: "Fréjus, Var" },
    client: {
      fr: "So Good Diner est un snack gourmand du centre de Fréjus : burgers, kumpir, box à partager et sandwichs. Le pain vient chaque jour du boulanger, la viande fraîche du boucher, les sauces sont faites sur place, et les steaks sont saisis devant les clients.",
      en: "So Good Diner is a gourmet snack bar in the centre of Fréjus: burgers, kumpir, sharing boxes and sandwiches. The bread comes from the baker every day, the fresh meat from the butcher, the sauces are made on site and the steaks are seared in front of you.",
    },
    built: {
      fr: [
        "La carte complète, classée par catégorie, avec le prix seul et le prix en menu.",
        "Une section qui présente la maison : pain artisanal, viande du boucher, sauces maison.",
        "Les avis des clients et une galerie de photos.",
        "Une FAQ, l'adresse et l'itinéraire en un geste.",
        "Une version française et une version anglaise.",
      ],
      en: [
        "The full menu by category, with the price on its own and as a meal.",
        "A section on how the food is made: artisan bread, butcher's meat, homemade sauces.",
        "Customer reviews and a photo gallery.",
        "An FAQ, the address and one-tap directions.",
        "French and English versions.",
      ],
    },
    design: {
      fr: "Un univers de diner américain sur fond sombre, avec des titres massifs et des touches de jaune moutarde. Le message de la maison, « préparé sous vos yeux », est porté par le titre d'accueil et par les quatre engagements affichés juste en dessous.",
      en: "An American-diner look on a dark background, with heavy headlines and touches of mustard yellow. The house promise, \"prepared before your eyes\", is carried by the opening headline and the four commitments set out just below it.",
    },
  },

  "tandoor-global": {
    status: "published",
    place: { fr: "Fréjus, Var", en: "Fréjus, Var" },
    client: {
      fr: "Mr. Tandoors est un restaurant indien du cœur de Fréjus. Toutes les viandes sont certifiées halal et les plats sont cuits dans un véritable four tandoor : biryani, naan, curry, tikka masala. On y mange sur place, dans une salle décorée avec bar à cocktails, ou à emporter.",
      en: "Mr. Tandoors is an Indian restaurant in the heart of Fréjus. All the meat is certified halal and the dishes are cooked in a real tandoor oven: biryani, naan, curry, tikka masala. Guests eat in, in a decorated dining room with a cocktail bar, or take away.",
    },
    built: {
      fr: [
        "Un bouton « Commander à emporter » visible dès l'arrivée sur le site.",
        "Un indicateur d'ouverture en direct et les horaires détaillés.",
        "Une sélection de plats avec prix, niveau d'épices et mention halal.",
        "La formule du midi, la réservation de table et les coordonnées.",
        "Un lien vers le compte Instagram du restaurant.",
      ],
      en: [
        "An \"Order takeaway\" button visible as soon as you arrive.",
        "A live open/closed indicator and full opening hours.",
        "A selection of dishes with prices, spice level and halal labels.",
        "The lunch deal, table booking and contact details.",
        "A link to the restaurant's Instagram.",
      ],
    },
    design: {
      fr: "Le site est pensé pour la commande : chaque section ramène vers le menu ou la commande à emporter. Les couleurs chaudes et la typographie évoquent les épices et le four tandoor, et les piments indiquent d'un coup d'œil le niveau de chaque plat. Le site est encore en cours de finalisation.",
      en: "The site is built around ordering: every section leads back to the menu or to takeaway. Warm colours and type evoke spices and the tandoor oven, and chilli icons show each dish's heat at a glance. The site is still being finished.",
    },
  },

  "planb-global-connect": {
    status: "published",
    place: { fr: "Var et Alpes-Maritimes", en: "Var and Alpes-Maritimes" },
    client: {
      fr: "Plan B Concept est l'activité d'Anthony Gratton, assistant à maîtrise d'ouvrage sur la Côte d'Azur après plus de trente ans dans le bâtiment. Il représente des propriétaires, souvent étrangers, pendant leurs projets de rénovation ou de construction, en anglais comme en français, de Saint-Tropez à Monaco.",
      en: "Plan B Concept is Anthony Gratton's business: an owner's representative on the French Riviera with more than thirty years in construction. He represents property owners, many of them from abroad, through renovation and building projects, in English and in French, from Saint-Tropez to Monaco.",
    },
    built: {
      fr: [
        "Un site bilingue anglais–français pensé pour une clientèle internationale.",
        "La présentation d'Anthony et de son expérience, en première personne.",
        "Le détail des services, de la représentation du client au suivi de chantier.",
        "Un questionnaire de projet pour préparer le premier échange.",
        "La zone d'intervention, une FAQ et un contact direct par WhatsApp.",
      ],
      en: [
        "A bilingual English–French site for an international clientele.",
        "An introduction to Anthony and his experience, in the first person.",
        "A breakdown of the services, from client representation to site monitoring.",
        "A project questionnaire to prepare the first conversation.",
        "The area covered, an FAQ and direct contact on WhatsApp.",
      ],
    },
    design: {
      fr: "Un ton sobre et rassurant, à l'image du métier : des chiffres clés dès l'accueil (expérience, bilinguisme, départements couverts), un texte qui parle directement aux propriétaires, et un fond sombre aux accents dorés qui évoque la Riviera sans tomber dans le cliché.",
      en: "A calm, reassuring tone that suits the job: key figures up front (experience, bilingual service, areas covered), copy that speaks directly to owners, and a dark background with gold accents that suggests the Riviera without the clichés.",
    },
  },

  autoecole: {
    status: "published",
    place: { fr: "Fréjus, Var", en: "Fréjus, Var" },
    client: {
      fr: "L'auto-école La Tour de Mare forme les conducteurs de Fréjus, Saint-Raphaël et de l'Est varois : permis voiture en boîte manuelle ou automatique, conduite accompagnée, moto, cyclomoteur, voiturette et remorque. Forte de près de 30 ans d'expérience, elle figure au palmarès des Meilleures Auto-Écoles de France 2026 d'Auto Plus et VroomVroom.",
      en: "Auto-école La Tour de Mare is a driving school serving Fréjus, Saint-Raphaël and the east of the Var: car licences in manual or automatic, supervised driving, motorbike, moped, microcar and trailer. With nearly 30 years of experience behind it, it is listed among France's Best Driving Schools 2026 by Auto Plus and VroomVroom.",
    },
    built: {
      fr: [
        "Un site de plusieurs pages : formations, tarifs, avantages de l'école, FAQ et contact.",
        "Une fiche par formation, avec ce qui est inclus et le tarif « à partir de ».",
        "Une grille de tarifs dédiée et les solutions de financement (permis à 1 €/jour, CPF).",
        "Des pictogrammes pour repérer chaque catégorie de permis en un coup d'œil.",
        "La distinction 2026 et l'agrément mis en avant dès l'accueil.",
      ],
      en: [
        "A multi-page site: courses, prices, what makes the school different, FAQ and contact.",
        "A page for each course, with what's included and the starting price.",
        "A dedicated price list and the funding options (the €1-a-day licence, CPF).",
        "Pictograms so each licence category can be spotted at a glance.",
        "The 2026 award and the school's approval number shown from the home page.",
      ],
    },
    design: {
      fr: "Un site clair et structuré, aux couleurs de l'école : une information dense (catégories, âges, prix, financement) présentée de façon lisible, pour que les élèves comme les parents trouvent rapidement la formation qui leur correspond.",
      en: "A clear, structured site in the school's colours. A lot of information (categories, ages, prices, funding) is laid out so that learners and parents alike quickly find the right course.",
    },
  },

  "E-Mconcept": {
    status: "published",
    place: { fr: "Var et Alpes-Maritimes", en: "Var and Alpes-Maritimes" },
    client: {
      fr: "EM Concept est électricien et intégrateur audiovisuel dans le Var et les Alpes-Maritimes depuis quinze ans : électricité générale et éclairage, TV et vidéo, home cinéma, sonorisation, réseau Wi-Fi, caméras et alarme. Un seul interlocuteur pour toute l'installation, de la conception à la mise en service.",
      en: "EM Concept has been an electrician and audio-visual integrator in the Var and Alpes-Maritimes for fifteen years: general electrical work and lighting, TV and video, home cinema, sound systems, Wi-Fi networks, cameras and alarms. One contact for the whole installation, from design to switch-on.",
    },
    built: {
      fr: [
        "Une page d'accueil sombre et cinématographique, où l'on peut éteindre la lumière d'une salle home cinéma.",
        "La présentation des cinq domaines d'expertise, avec le détail des prestations.",
        "Une galerie de réalisations filtrable par type de chantier.",
        "Une demande de visite ou de devis gratuite, en un geste.",
        "Appel et WhatsApp accessibles depuis chaque page.",
      ],
      en: [
        "A dark, cinematic home page where you can switch off the lights in a home-cinema room.",
        "The five areas of expertise, each with its services in detail.",
        "A gallery of past work, filterable by type of job.",
        "A free visit or quote request in a single step.",
        "Call and WhatsApp available from every page.",
      ],
    },
    design: {
      fr: "Le site met en scène le savoir-faire : la lumière qui s'allume et s'éteint dans la pièce montre en un geste ce que l'entreprise installe. Fond sombre, typographie élégante et animations sur mesure donnent une image haut de gamme, à la hauteur des installations réalisées.",
      en: "The site stages the craft: the light going on and off in the room shows in one gesture what the company installs. A dark background, elegant type and custom animations give a high-end image that matches the installations themselves.",
    },
  },

  julienb: {
    status: "published",
    place: { fr: "Studio web indépendant", en: "Independent web studio" },
    client: {
      fr: "C'est le site du studio de Julien Bourgois, l'un des deux créateurs de The Vitrine. Julien conçoit et développe des sites vitrines sur mesure pour les artisans, commerçants, thérapeutes et auteurs : rapides, pensés pour le téléphone et faits pour donner envie d'appeler.",
      en: "This is the studio site of Julien Bourgois, one of the two makers behind The Vitrine. Julien designs and builds made-to-measure websites for tradespeople, shopkeepers, therapists and authors: fast, made for phones and designed to make people want to call.",
    },
    built: {
      fr: [
        "Un portfolio « quatre métiers, quatre identités » avec un aperçu en direct de chaque site.",
        "Trois formules pour travailler ensemble, présentées simplement.",
        "Une méthode en quatre étapes, « aucune surprise ».",
        "Une FAQ et un contact direct par e-mail et téléphone.",
      ],
      en: [
        "A \"four trades, four identities\" portfolio with a live preview of each site.",
        "Three ways to work together, set out simply.",
        "A four-step method, \"no surprises\".",
        "An FAQ and direct contact by email and phone.",
      ],
    },
    design: {
      fr: "Un studio qui se présente par l'exemple : une typographie éditoriale très affirmée, beaucoup de blanc, et des travaux montrés en direct plutôt qu'en captures. Le ton est direct et chaleureux, comme un premier échange avec Julien.",
      en: "A studio that leads by example: strong editorial type, plenty of white space, and work shown live rather than as screenshots. The tone is direct and warm, like a first conversation with Julien.",
    },
  },

  stephanie: {
    status: "published",
    place: { fr: "Saint-Raphaël, Var", en: "Saint-Raphaël, Var" },
    client: {
      fr: "SR Bien-être est le cabinet d'une sophrologue et énergéticienne à Saint-Raphaël. Elle accompagne adultes, adolescents et enfants : sophrologie, soins énergétiques et Reiki, drainage lymphatique, massage modelant et yoga pour enfants, au cabinet ou à domicile autour de Saint-Raphaël.",
      en: "SR Bien-être is the practice of a sophrologist and energy therapist in Saint-Raphaël. She works with adults, teenagers and children: sophrology, energy healing and Reiki, lymphatic drainage, sculpting massage and yoga for children, at the practice or at home around Saint-Raphaël.",
    },
    built: {
      fr: [
        "Un écran d'accueil qui invite à respirer avant d'entrer sur le site.",
        "Une fiche par accompagnement, avec ses bienfaits et son tarif.",
        "La présentation de la praticienne et du cabinet.",
        "Une FAQ pour répondre aux questions avant un premier rendez-vous.",
        "La réservation en ligne, accessible depuis chaque page.",
      ],
      en: [
        "A welcome screen that invites you to breathe before entering the site.",
        "A page for each treatment, with its benefits and price.",
        "An introduction to the practitioner and the practice.",
        "An FAQ that answers questions before a first appointment.",
        "Online booking, available from every page.",
      ],
    },
    design: {
      fr: "Tout invite au calme : couleurs douces, beaucoup d'espace, mots choisis (écoute, douceur, bienveillance). L'écran d'accueil « Respirez » donne le ton dès la première seconde, et la prise de rendez-vous reste toujours à portée de main.",
      en: "Everything invites calm: soft colours, plenty of space and carefully chosen words (listening, gentleness, kindness). The \"Breathe\" welcome screen sets the tone from the first second, and booking is always within reach.",
    },
  },

  taquet: {
    status: "published",
    place: { fr: "Psychologie et édition", en: "Psychology and publishing" },
    client: {
      fr: "Annick Taquet-Assoignons est psychologue clinicienne, conférencière, formatrice et autrice de onze livres chez trois éditeurs. Elle écrit des albums pour aider les enfants à mettre des mots sur ce qu'ils vivent, et des ouvrages pour les soignants et les proches aidants.",
      en: "Annick Taquet-Assoignons is a clinical psychologist, speaker, trainer and the author of eleven books with three publishers. She writes picture books that help children put words to what they're going through, and books for professional and family carers.",
    },
    built: {
      fr: [
        "Un catalogue des albums pour enfants, filtrable par thème (émotions, famille, maladie, imaginaire), avec l'âge conseillé et un lien d'achat.",
        "Les ouvrages et guides pour les soignants et les proches aidants, et un focus sur son livre phare.",
        "Son parcours de psychologue et d'autrice.",
        "L'agenda des prochaines dédicaces et le lien vers Instagram.",
      ],
      en: [
        "A catalogue of her children's picture books, filterable by theme (emotions, family, illness, imagination), with the recommended age and a link to buy.",
        "Her books and guides for professional and family carers, with a focus on her best-known title.",
        "Her background as a psychologist and author.",
        "Upcoming book signings and a link to Instagram.",
      ],
    },
    design: {
      fr: "Deux publics, deux portes d'entrée dès l'accueil : « pour un enfant » et « pour vous qui prenez soin des autres ». Le ton est chaleureux et délicat, à l'image des livres, avec des couvertures mises en valeur comme sur une table de librairie.",
      en: "Two audiences, two ways in from the home page: \"for a child\" and \"for you who care for others\". The tone is warm and gentle, like the books, with covers shown off as if on a bookshop table.",
    },
  },

  osteoflo: {
    status: "published",
    place: { fr: "Puget-sur-Argens, Var", en: "Puget-sur-Argens, Var" },
    client: {
      fr: "Florian Bozzetti est ostéopathe D.O. à Puget-sur-Argens, près de Fréjus. Spécialisé en thérapie manuelle mécaniste, il soigne toute la famille, des nourrissons aux seniors en passant par les sportifs et les femmes enceintes, en cherchant l'origine des douleurs plutôt que leurs seuls symptômes.",
      en: "Florian Bozzetti is an osteopath (D.O.) in Puget-sur-Argens, near Fréjus. He specialises in mechanistic manual therapy and treats the whole family, from babies to seniors, including athletes and pregnant women, looking for the cause of pain rather than just its symptoms.",
    },
    built: {
      fr: [
        "Un encart qui indique en direct si le cabinet est ouvert, avec l'adresse et les horaires.",
        "L'approche du praticien : ostéopathie, étiopathie et thérapie mécaniste, et les motifs de consultation.",
        "Une section « Pour qui ? » par public : adultes et seniors, sportifs, enfants et nourrissons, femmes enceintes.",
        "Le déroulé d'une séance en quatre étapes, le parcours du praticien et ses formations.",
        "Tarifs, horaires détaillés, accès et prise de rendez-vous par téléphone.",
      ],
      en: [
        "A live sign showing whether the practice is open, with the address and opening hours.",
        "The practitioner's approach (osteopathy, etiopathy and mechanistic therapy) and the reasons people consult.",
        "A \"Who is it for?\" section by patient: adults and seniors, athletes, children and babies, pregnant women.",
        "How a session works in four steps, plus the practitioner's background and training.",
        "Prices, full opening hours, directions and booking by phone.",
      ],
    },
    design: {
      fr: "Un cabinet au ton calme et rassurant : vert profond, typographie élégante et beaucoup d'espace. Les informations qui comptent avant d'appeler, le tarif, les horaires, le parking, sont visibles dès le premier écran, et le numéro du cabinet reste toujours à portée de main.",
      en: "A calm, reassuring practice: deep green, elegant type and plenty of space. What people need to know before calling, the price, the hours and parking, is visible on the first screen, and the practice's phone number is always within reach.",
    },
  },

  "filton-athletic-fc": {
    status: "published",
    place: { fr: "Filton, Bristol (Royaume-Uni)", en: "Filton, Bristol (UK)" },
    client: {
      fr: "Filton Athletic FC est un club de football amateur du nord de Bristol, fondé dans les années 1960 à Filton, berceau du Concorde. L'équipe première, la réserve, l'équipe A et une section jeunes jouent à BBS Park North, en Marcliff Gloucestershire County Football League.",
      en: "Filton Athletic FC is a grassroots football club in north Bristol, founded in the 1960s in Filton, the birthplace of Concorde. The first team, reserves, A's and a youth section play at BBS Park North in the Marcliff Gloucestershire County Football League.",
    },
    built: {
      fr: [
        "Le prochain match mis en avant, avec date, heure et adversaire.",
        "Le calendrier du club, les derniers résultats et les liens vers les classements officiels.",
        "Les actualités, la boutique et une page pour rejoindre le club.",
        "Un bandeau qui fait défiler tous les sponsors du club.",
        "Une page par équipe, de l'équipe première aux jeunes.",
      ],
      en: [
        "The next match up front, with date, kick-off time and opponent.",
        "The club calendar, latest results and links to the official league tables.",
        "News, the club shop and a page on how to join.",
        "A ticker that scrolls through all the club's sponsors.",
        "A page for each team, from the first team to the youth section.",
      ],
    },
    design: {
      fr: "Le site part de l'histoire du lieu : « We play where Concorde flew ». Les références à l'aviation donnent au club une identité unique, et les informations du jour de match restent au premier plan pour les joueurs comme pour les supporters.",
      en: "The site starts from the story of the place: \"We play where Concorde flew\". Aviation references give the club an identity of its own, while matchday information stays front and centre for players and supporters alike.",
    },
  },

  "filton-social-club": {
    status: "published",
    place: { fr: "Filton, Bristol (Royaume-Uni)", en: "Filton, Bristol (UK)" },
    client: {
      fr: "Le Filton & District Social Club est un club de membres convivial de Filton, à Bristol : sport en direct sur Sky Sports et TNT Sports, soirées musicales le samedi, bingo, équipes de skittles, location de salles et un bar où les chiens sont les bienvenus. Les visiteurs sont aussi accueillis.",
      en: "Filton & District Social Club is a friendly members' club in Filton, Bristol: live sport on Sky Sports and TNT Sports, Saturday-night entertainment, bingo, skittles teams, room hire and a dog-friendly bar. Guests are welcome too.",
    },
    built: {
      fr: [
        "Le programme des soirées mois par mois, avec une fiche par événement.",
        "Un calendrier des événements et la page « What's On ».",
        "Les équipes de skittles, la location de salles et l'adhésion.",
        "Le comité, une page hommage, une galerie, les horaires et l'accès.",
      ],
      en: [
        "The entertainment programme month by month, with a listing for each night.",
        "An events calendar and a What's On page.",
        "The skittles teams, room hire and membership.",
        "The committee, a memorial page, a gallery, opening hours and directions.",
      ],
    },
    design: {
      fr: "Un site simple et clair pour un public de tous âges : la prochaine soirée est annoncée dès l'accueil, les prix membres sont indiqués, et chaque information pratique se trouve en un clic depuis le menu.",
      en: "A simple, clear site for members of all ages: the next big night is announced on the home page, members' prices are shown, and every practical detail is one click from the menu.",
    },
  },

  "speakup-ai-english-trainer": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "SpeakUp AI est un outil créé par Antony Addy, formateur d'anglais certifié, pour s'entraîner à de vraies conversations en anglais : entretiens d'embauche, voyages, affaires et vie quotidienne. Il complète ses formations et reste gratuit pendant le lancement.",
      en: "SpeakUp AI is a tool built by Antony Addy, a certified English trainer, for practising real conversations in English: job interviews, travel, business and daily life. It complements his training courses and is free during launch.",
    },
    built: {
      fr: [
        "38 scénarios de la vie réelle et 5 modes de coaching.",
        "Une conversation à la voix ou à l'écrit, avec une IA qui s'adapte au niveau de l'apprenant.",
        "Un rapport après chaque séance : niveau CECR, points forts et corrections prioritaires.",
        "Une interface en 12 langues, sans compte ni carte bancaire.",
        "Un lien vers une formation avec Antony pour aller plus loin.",
      ],
      en: [
        "38 real-life scenarios and 5 coaching modes.",
        "Conversation by voice or text, with an AI partner that adapts to the learner's level.",
        "A report after each session: CEFR level, strengths and priority corrections.",
        "An interface in 12 languages, with no account or card needed.",
        "A link to training with Antony for learners who want to go further.",
      ],
    },
    design: {
      fr: "L'accueil montre tout de suite une vraie conversation et un exemple de rapport de séance : on comprend l'outil avant même de l'essayer. Le parcours tient en trois étapes, choisir, parler, recevoir son rapport, pour que l'on puisse commencer en quelques secondes.",
      en: "The home page shows a real conversation and a sample session report straight away, so you understand the tool before you try it. The journey takes three steps, pick, speak, get your report, so learners can start within seconds.",
    },
  },

  "toeic-success-hub": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "ToeicPath est une plateforme de préparation au TOEIC créée par Antony Addy. Elle couvre les deux formats de l'examen, le TOEIC Listening & Reading et le TOEIC 4 compétences, et reste gratuite et sans inscription pendant le lancement.",
      en: "ToeicPath is a TOEIC preparation platform built by Antony Addy. It covers both formats of the exam, TOEIC Listening & Reading and the 4-Skills TOEIC, and is free with no sign-up during launch.",
    },
    built: {
      fr: [
        "Les sept parties du Listening & Reading, et des exercices chronométrés pour l'oral et l'écrit.",
        "Un examen blanc et un entraînement adaptatif.",
        "Un lexique de 300 termes d'anglais des affaires.",
        "L'auto-évaluation de l'oral et de l'écrit selon les critères officiels, expliqués dans la langue de l'apprenant.",
        "Les explications essentielles en huit langues et un suivi de progression.",
      ],
      en: [
        "All seven Listening & Reading parts, plus timed Speaking and Writing drills.",
        "A mock test and adaptive practice.",
        "A 300-term business vocabulary builder.",
        "Self-assessment of Speaking and Writing against the official criteria, explained in the learner's language.",
        "Key explanations in eight languages and progress tracking.",
      ],
    },
    design: {
      fr: "Tout est tourné vers l'objectif, 990 points, affiché dès l'accueil. Une navigation par compétence et par format permet à chacun d'aller droit à ce qu'il doit travailler, sans créer de compte.",
      en: "Everything points to the goal, a score of 990, shown on the home page. Navigation by skill and by exam format lets each learner go straight to what they need to practise, without creating an account.",
    },
  },

  "cloe-prep-path": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "CLOE Prep est une préparation indépendante à la certification d'anglais CLOE, conçue par Antony Addy. Elle s'adresse aux professionnels qui doivent valider leur niveau sur l'anglais réellement utilisé au travail : e-mails, réunions, appels et relation client.",
      en: "CLOE Prep is independent preparation for the CLOE English certification, designed by Antony Addy. It's for professionals who need to certify their level in the English they actually use at work: emails, meetings, calls and customer service.",
    },
    built: {
      fr: [
        "Un entraînement sur les quatre compétences, plus l'expression orale.",
        "Des questions adaptatives, chacune associée à un niveau du CECR, de A1 à C2.",
        "Des séances courtes de dix minutes ou un examen blanc complet.",
        "Le déroulé du jour de l'examen, de l'écrit sur ordinateur à l'oral avec un examinateur.",
      ],
      en: [
        "Practice across the four skills, plus speaking.",
        "Adaptive questions, each mapped to a CEFR level from A1 to C2.",
        "Short ten-minute sessions or a full mock exam.",
        "A walk-through of exam day, from the computer-based written test to the oral with an examiner.",
      ],
    },
    design: {
      fr: "Une métaphore d'ascension guide tout le site, « Rise to CLOE-ready » : les quatre compétences sont tressées en une seule montée, du niveau actuel jusqu'au jour de la réussite. Le design reste sobre et professionnel, à l'image de l'examen.",
      en: "A climbing metaphor runs through the site, \"Rise to CLOE-ready\": the four skills are braided into a single climb, from your current level to the day you pass. The design stays clean and professional, like the exam itself.",
    },
  },

  "english-grammar-hub": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "Grammatica est une ressource de grammaire anglaise créée par Antony Addy pour les apprenants qui comprennent mieux une règle expliquée dans leur propre langue : français, espagnol, portugais, italien, allemand, russe, arabe ou chinois mandarin.",
      en: "Grammatica is an English grammar resource built by Antony Addy for learners who understand a rule better when it's explained in their own language: French, Spanish, Portuguese, Italian, German, Russian, Arabic or Mandarin Chinese.",
    },
    built: {
      fr: [
        "136 points de grammaire répartis en grands thèmes, des bases de la phrase aux structures avancées.",
        "272 exercices auto-corrigés.",
        "Chaque règle expliquée dans la langue de l'apprenant.",
        "Une recherche, un suivi de progression et des exercices de contraste.",
      ],
      en: [
        "136 grammar topics grouped into themes, from sentence basics to advanced structures.",
        "272 self-correcting exercises.",
        "Every rule explained in the learner's own language.",
        "Search, progress tracking and contrast practice.",
      ],
    },
    design: {
      fr: "L'accueil montre la promesse en action : une faute corrigée, avec l'explication dans la langue choisie. Les thèmes sont présentés comme une table des matières claire, pour retrouver une règle en quelques secondes.",
      en: "The home page shows the promise in action: a mistake corrected, with the explanation in the chosen language. Topics are laid out like a clear table of contents, so any rule can be found in seconds.",
    },
  },

  "adventure-books": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "English Reading Adventures est une collection d'histoires interactives créée par Antony Addy pour les personnes qui apprennent l'anglais. Le lecteur est le héros : chaque page se termine par un choix, et bien choisir suppose d'avoir compris ce qu'on vient de lire.",
      en: "English Reading Adventures is a collection of interactive stories built by Antony Addy for people learning English. The reader is the hero: every page ends in a choice, and choosing well means understanding what you've just read.",
    },
    built: {
      fr: [
        "Chaque histoire écrite à trois niveaux (A2, B1, B2), que l'on peut changer à tout moment, même en pleine lecture.",
        "Le même parcours à chaque niveau, pour qu'une classe entière lise le même livre.",
        "Le sens de chaque mot en un geste, dans huit langues.",
        "Une bibliothèque de dix histoires, et d'autres à venir.",
      ],
      en: [
        "Every story written at three levels (A2, B1, B2), which you can switch at any time, even mid-story.",
        "The same path at every level, so a whole class can read the same book.",
        "Any word's meaning in one tap, in eight languages.",
        "A library of ten stories, with more on the way.",
      ],
    },
    design: {
      fr: "Le site ressemble à une bibliothèque de romans : couvertures soignées, ambiance de récit et mise en page de livre. L'anglais reste au premier plan, la langue de l'apprenant sert de filet de sécurité juste en dessous.",
      en: "The site looks like a shelf of novels: carefully designed covers, a storytelling mood and book-like layouts. English stays in front, with the learner's own language as a safety net just beneath it.",
    },
  },

  "listening-english-antonyaddy": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "ListenUp est une plateforme de compréhension orale en anglais créée par Antony Addy, du niveau débutant au niveau avancé. Elle s'appuie sur de vraies conversations du quotidien et du monde professionnel, et reste gratuite pendant le lancement.",
      en: "ListenUp is an English listening-practice platform built by Antony Addy, from beginner to advanced. It's based on real conversations from daily life and the workplace, and is free during launch.",
    },
    built: {
      fr: [
        "Plus de 180 exercices répartis en 31 thèmes : anglais personnel, professionnel, commercial, universitaire, voyage, tech…",
        "Un audio IA avec surlignage mot à mot, façon karaoké.",
        "Des traductions instantanées dans plus de dix langues.",
        "Des quiz de compréhension, un lexique, des favoris et un mode sombre.",
      ],
      en: [
        "More than 180 exercises across 31 topics: personal, professional, sales, academic, travel, tech and more.",
        "AI audio with word-by-word, karaoke-style highlighting.",
        "Instant translations in more than ten languages.",
        "Comprehension quizzes, a vocabulary list, bookmarks and a dark mode.",
      ],
    },
    design: {
      fr: "L'accueil fait entendre et lire une phrase avec sa traduction, pour montrer le principe avant toute explication. Les parcours sont présentés par grands domaines, pour que chacun commence par les situations qui le concernent.",
      en: "The home page plays and highlights a sentence with its translation, showing how it works before any explanation. Paths are grouped by area, so each learner starts with the situations that matter to them.",
    },
  },

  "anglais-a-distance-learn": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "Anglais à Distance est un site d'anglais en ligne gratuit pour les adultes francophones, créé par Antony Addy. Il part des fautes que font réellement les francophones (« depends of », « since 3 years »…) pour les corriger, les expliquer et les faire retenir.",
      en: "Anglais à Distance is a free online English site for French-speaking adults, built by Antony Addy. It starts from the mistakes French speakers really make (\"depends of\", \"since 3 years\"…) to correct them, explain them and make them stick.",
    },
    built: {
      fr: [
        "100 pièges expliqués et plus de 3 000 questions corrigées.",
        "Des exercices de dix questions avec correction immédiate et explication.",
        "Trois parcours par niveau, du grand débutant aux nuances les plus fines.",
        "34 dialogues audio, du vocabulaire et des quiz.",
        "La progression enregistrée sur l'appareil, sans compte ni inscription.",
      ],
      en: [
        "100 common traps explained and more than 3,000 corrected questions.",
        "Ten-question exercises with instant correction and explanations.",
        "Three paths by level, from complete beginner to the finest nuances.",
        "34 audio dialogues, vocabulary and quizzes.",
        "Progress saved on the device, with no account or sign-up.",
      ],
    },
    design: {
      fr: "L'accueil fait défiler les fautes les plus courantes : chaque francophone s'y reconnaît, et l'envie de comprendre « pourquoi » fait le reste. Tout est en français, accessible et gratuit, avec une recherche rapide pour retrouver une règle.",
      en: "The home page scrolls through the most common mistakes: every French speaker recognises a few, and wanting to know why does the rest. Everything is in French, accessible and free, with a quick search to find any rule.",
    },
  },

  "biz-fluent-coach": {
    status: "published",
    place: { fr: "En ligne", en: "Online" },
    client: {
      fr: "TP English Pro est une plateforme d'anglais professionnel créée par Antony Addy pour les personnes qui préparent le titre professionnel Assistant de Direction, et notamment son épreuve orale d'anglais. Elle est gratuite.",
      en: "TP English Pro is a professional-English platform built by Antony Addy for people preparing France's Assistant de Direction (executive assistant) qualification, and in particular its oral English exam. It is free to use.",
    },
    built: {
      fr: [
        "Un entraînement à la conversation avec une IA, sur 10 situations de bureau, à la voix ou à l'écrit.",
        "Un retour détaillé immédiat et un mode examen qui simule l'épreuve orale.",
        "Des modules : e-mails, téléphone, réunions, traduction professionnelle.",
        "500 termes de vocabulaire administratif et des révisions.",
        "Une interface en français, ukrainien, russe, arabe et roumain.",
      ],
      en: [
        "AI conversation practice across 10 office situations, by voice or text.",
        "Detailed instant feedback and an exam mode that simulates the oral test.",
        "Modules on emails, phone calls, meetings and professional translation.",
        "500 administrative vocabulary terms and revision.",
        "An interface in French, Ukrainian, Russian, Arabic and Romanian.",
      ],
    },
    design: {
      fr: "Une plateforme pensée comme un parcours de formation : modules numérotés, suivi de progression et révisions, autour d'un objectif unique, réussir l'épreuve. Le choix des langues d'interface reflète le public des formations.",
      en: "A platform designed as a training path: numbered modules, progress tracking and revision, all around one goal, passing the exam. The choice of interface languages reflects the people who take the course.",
    },
  },

  "addys-english-pro": {
    status: "published",
    place: { fr: "Côte d'Azur et à distance", en: "French Riviera and online" },
    client: {
      fr: "C'est le site principal d'Antony Addy, l'un des deux créateurs de The Vitrine : formateur d'anglais professionnel, britannique natif, certifié Formateur Professionnel d'Adultes depuis 2017, formateur en IA générative et créateur de sites web et d'outils pédagogiques, sur la Côte d'Azur et à distance.",
      en: "This is the main site of Antony Addy, one of the two makers behind The Vitrine: a native British professional English trainer, certified as a Formateur Professionnel d'Adultes since 2017, a generative-AI trainer and a builder of websites and learning tools, on the French Riviera and online.",
    },
    built: {
      fr: [
        "Trois parcours depuis l'accueil : anglais professionnel, IA générative, sites web et outils.",
        "Un seul interlocuteur pour les trois activités, présenté dès le premier écran.",
        "Des témoignages et recommandations de clients.",
        "Un premier échange gratuit, avec réponse sous 24 h ouvrées, et un contact WhatsApp.",
        "Des ressources gratuites et les mentions légales complètes.",
      ],
      en: [
        "Three paths from the home page: professional English, generative AI, and websites and tools.",
        "One contact for all three activities, introduced on the first screen.",
        "Client testimonials and recommendations.",
        "A free first call, with a reply within 24 working hours, and WhatsApp contact.",
        "Free resources and a full legal notice.",
      ],
    },
    design: {
      fr: "Trois lignes de titre pour trois métiers, « L'anglais. L'IA. Le web. », et un code couleur par activité qui suit le visiteur dans tout le site. L'ensemble reste personnel : c'est Antony qui parle, à la première personne.",
      en: "Three headline lines for three trades, \"English. AI. The web.\", and a colour for each activity that follows visitors through the site. It stays personal: it's Antony speaking, in the first person.",
    },
  },

  "addy-genai-training": {
    status: "published",
    place: { fr: "Fréjus et à distance", en: "Fréjus and online" },
    client: {
      fr: "Antony Addy, formateur certifié d'État basé à Fréjus, forme les entreprises et les indépendants à l'IA générative : ChatGPT, Claude, Gemini ou Copilot, en présentiel ou à distance, en français ou en anglais, à partir de leurs propres cas d'usage.",
      en: "Antony Addy, a state-certified trainer based in Fréjus, trains companies and freelancers in generative AI: ChatGPT, Claude, Gemini or Copilot, in person or online, in French or English, built around their own use cases.",
    },
    built: {
      fr: [
        "Quatre compétences clés, chacune liée à des usages concrets : IA conversationnelle, création visuelle, automatisation et agents…",
        "Deux parcours, pour les entreprises et pour les indépendants.",
        "Les plateformes qu'Antony a lui-même conçues avec l'IA, comme preuve par l'exemple.",
        "Des guides pratiques, une FAQ, une demande de devis et un contact WhatsApp.",
        "Une version française et une version anglaise.",
      ],
      en: [
        "Four key skills, each tied to concrete uses: conversational AI, visual creation, automation and agents, and more.",
        "Two paths, for companies and for freelancers.",
        "The platforms Antony has built with AI himself, as proof by example.",
        "Practical guides, an FAQ, a quote request and WhatsApp contact.",
        "French and English versions.",
      ],
    },
    design: {
      fr: "L'accueil montre une consigne tapée en direct, « Résume ce rapport de 40 pages » : l'IA générative expliquée par l'exemple, sans jargon. Le site garde l'identité visuelle du site principal d'Antony, avec sa propre couleur.",
      en: "The home page shows a prompt being typed live, \"Summarise this 40-page report\": generative AI explained by example, without jargon. The site shares the look of Antony's main site, with a colour of its own.",
    },
  },

  "addy-sap-connect": {
    status: "published",
    place: { fr: "Sur site et à distance", en: "On site and online" },
    client: {
      fr: "Antony Addy propose des formations au module SAP Materials Management (MM) pour les professionnels et les entreprises. Britannique natif, bilingue en français et formateur certifié depuis 2017, il forme sur site, à distance ou sur mesure.",
      en: "Antony Addy offers training in the SAP Materials Management (MM) module for professionals and companies. A native English speaker, bilingual in French and a certified trainer since 2017, he trains on site, online or to a custom programme.",
    },
    built: {
      fr: [
        "Les trois grands domaines de la formation : achats, gestion des stocks et données de base.",
        "Le détail des programmes de formation MM.",
        "La présentation du formateur et de son parcours.",
        "Un site en anglais et en français, avec un espace « Ma formation ».",
      ],
      en: [
        "The three core training areas: procurement, inventory management and master data.",
        "Details of the MM training programmes.",
        "An introduction to the trainer and his background.",
        "A site in English and French, with a \"My training\" area.",
      ],
    },
    design: {
      fr: "Un site sobre et professionnel, adapté à un public d'entreprise : les bénéfices concrets de la formation passent en premier, et les qualifications du formateur sont visibles dès l'accueil.",
      en: "A clean, professional site for a corporate audience: the practical benefits of the training come first, and the trainer's qualifications are visible from the home page.",
    },
  },

  "student-mark-tracker": {
    status: "published",
    place: { fr: "Outil interne", en: "Internal tool" },
    client: {
      fr: "Student Mark Tracker est un espace de travail privé développé pour Antony Addy Formations. Il sert à suivre le travail de chaque apprenant en formation d'anglais : documents, notes et progression individuelle.",
      en: "Student Mark Tracker is a private workspace built for Antony Addy Formations. It keeps track of each English-training learner's work: documents, marks and individual progress.",
    },
    built: {
      fr: [
        "Un tableau de bord privé, accessible après connexion par e-mail ou par compte Google.",
        "Les documents, les notes et la progression de chaque apprenant, séparés et bien rangés.",
      ],
      en: [
        "A private dashboard, behind sign-in by email or Google account.",
        "Each learner's documents, marks and progress, kept separate and organised.",
      ],
    },
    design: {
      fr: "Un outil sobre et fonctionnel, pensé pour un usage quotidien. Comme il contient des données d'apprenants, seule la page de connexion est publique. L'outil est encore en cours de développement.",
      en: "A plain, practical tool designed for everyday use. Because it holds learners' data, only the sign-in page is public. The tool is still being developed.",
    },
  },
};

/** URL-safe slug from a project title: "Auto-école La Tour de Mare" → "auto-ecole-la-tour-de-mare". */
export const caseSlug = (title: string) =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
