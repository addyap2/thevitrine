// Italian text for the case studies in src/data/cases.ts, keyed by the same
// project slug. Merged into `cases` at build time; a case without an entry
// here is listed in the build log (and its Italian page falls back to English).

export interface CaseIt {
  place: string;
  client: string;
  built: string[];
  design: string;
  seoDescription?: string;
}

export const casesIt: Record<string, CaseIt> = {
  "ristorante-lola": {
    place: "Fermignano, Marche",
    client: "Il Ristorante da Lola è una pizzeria di famiglia a Fermignano, nelle Marche. Propone la cucina del territorio in un ambiente semplice e accogliente: pasta fatta in casa, carne alla brace e una lunga lista di pizze cotte nel forno a legna. Le famiglie sono le benvenute, con un campo da bocce accanto e un'area giochi all'aperto.",
    built: [
      "Un sito in quattro lingue (italiano, inglese, francese, tedesco) per chi abita in zona e per chi è di passaggio.",
      "Una barra sempre visibile con orari, giorno di chiusura e numero per prenotare un tavolo.",
      "Il menu completo, diviso per categorie dagli antipasti ai dolci.",
      "Una galleria, la presentazione del locale e dello staff, e le domande frequenti.",
      "WhatsApp e indicazioni stradali in un tocco.",
    ],
    design: "Toni caldi di brace e legno, caratteri all'italiana e grandi foto della cucina fanno venire voglia di sedersi a tavola prima ancora di leggere il menu. Le tre specialità della casa aprono la home page: in pochi secondi si capisce cosa rende unico il locale.",
  },
  "wall-street": {
    place: "Fréjus, Var",
    client: "Il Wall Street è un bar-brasserie a Fréjus: un pub all'inglese con un tocco mediterraneo. Tavoli a botte, Paulaner e Delirium alla spina, cocktail, musica dal vivo e DJ set tutta la settimana, e tutte le grandi partite sul maxischermo. In cucina è tutto fatto in casa con prodotti freschi.",
    built: [
      "Il menu della settimana, piatto del giorno dopo piatto del giorno, che scorre in cima alla pagina.",
      "Il menu completo con i prezzi, filtrabile per categoria.",
      "Il programma della settimana: concerti, serate a tema e partite in diretta.",
      "Un indicatore «aperto ora», la prenotazione dei tavoli e le indicazioni stradali.",
      "Le domande frequenti e una versione in inglese per i visitatori.",
    ],
    design: "Un'identità da pub senza complessi: grandi titoli in maiuscolo, colori decisi e banner che scorrono come lo schermo di un bar. Il sito segue il ritmo del locale: ciò che cambia ogni settimana, il piatto del giorno e il programma, è la prima cosa che si vede.",
  },
  "so-good-diner": {
    place: "Fréjus, Var",
    client: "Il So Good Diner è uno snack bar gourmet nel centro di Fréjus: hamburger, kumpir, box da condividere e panini. Il pane arriva ogni giorno dal fornaio, la carne fresca dal macellaio, le salse sono fatte sul posto e le bistecche vengono cotte davanti a te.",
    built: [
      "Il menu completo per categoria, con il prezzo del piatto da solo e in menu.",
      "Una sezione su come nasce ogni piatto: pane artigianale, carne del macellaio, salse fatte in casa.",
      "Le recensioni dei clienti e una galleria fotografica.",
      "Le domande frequenti, l'indirizzo e le indicazioni in un tocco.",
      "Versioni in francese e in inglese.",
    ],
    design: "Uno stile da diner americano su fondo scuro, con titoli possenti e tocchi di giallo senape. La promessa della casa, «preparato davanti a te», è affidata al titolo d'apertura e ai quattro impegni elencati subito sotto.",
  },
  "tandoor-global": {
    place: "Fréjus, Var",
    client: "Mr. Tandoors è un ristorante indiano nel cuore di Fréjus. Tutta la carne è certificata halal e i piatti sono cotti in un vero forno tandoor: biryani, naan, curry, tikka masala. Si mangia in sala, in un ambiente decorato con cocktail bar, oppure da asporto.",
    built: [
      "Un pulsante «Ordina da asporto» visibile appena si arriva.",
      "Un indicatore aperto/chiuso in tempo reale e gli orari completi.",
      "Una selezione di piatti con prezzi, livello di piccantezza ed etichette halal.",
      "Il menu pranzo, la prenotazione dei tavoli e i contatti.",
      "Un link all'Instagram del ristorante.",
    ],
    design: "Il sito è costruito intorno all'ordine: ogni sezione riporta al menu o all'asporto. Colori e caratteri caldi evocano le spezie e il forno tandoor, e le icone a forma di peperoncino mostrano a colpo d'occhio quanto è piccante ogni piatto. Il sito è in fase di completamento.",
  },
  "planb-global-connect": {
    place: "Var e Alpi Marittime",
    client: "Plan B Concept è l'attività di Anthony Gratton, che rappresenta i proprietari nei cantieri della Costa Azzurra, forte di oltre trent'anni nell'edilizia. Segue proprietari, spesso stranieri, nei loro progetti di ristrutturazione e di costruzione, in inglese e in francese, da Saint-Tropez a Monaco.",
    built: [
      "Un sito bilingue inglese–francese per una clientela internazionale.",
      "La presentazione di Anthony e della sua esperienza, in prima persona.",
      "Il dettaglio dei servizi, dalla rappresentanza del committente al controllo del cantiere.",
      "Un questionario di progetto per preparare il primo colloquio.",
      "La zona coperta, le domande frequenti e il contatto diretto su WhatsApp.",
    ],
    design: "Un tono calmo e rassicurante, adatto al mestiere: i dati chiave in evidenza (esperienza, servizio bilingue, zone coperte), testi che si rivolgono direttamente ai proprietari e un fondo scuro con accenti dorati che richiama la Costa Azzurra senza cliché.",
  },
  autoecole: {
    place: "Fréjus, Var",
    client: "L'Auto-école La Tour de Mare è una scuola guida che serve Fréjus, Saint-Raphaël e l'est del Var: patente auto con cambio manuale o automatico, guida accompagnata, moto, ciclomotore, microcar e rimorchio. Con quasi 30 anni di esperienza alle spalle, figura tra le Migliori Scuole Guida di Francia 2026 secondo Auto Plus e VroomVroom.",
    built: [
      "Un sito di più pagine: corsi, prezzi, punti di forza della scuola, domande frequenti e contatti.",
      "Una pagina per ogni corso, con cosa comprende e il prezzo di partenza.",
      "Un listino dedicato e le possibilità di finanziamento (la patente a 1 € al giorno, il CPF).",
      "Pittogrammi per riconoscere a colpo d'occhio ogni categoria di patente.",
      "Il riconoscimento 2026 e il numero di autorizzazione della scuola visibili dalla home page.",
    ],
    design: "Un sito chiaro e ordinato, nei colori della scuola. Molte informazioni (categorie, età, prezzi, finanziamenti) sono organizzate in modo che allievi e genitori trovino in fretta il corso giusto.",
  },
  "E-Mconcept": {
    place: "Var e Alpi Marittime",
    client: "EM Concept è da quindici anni elettricista e integratore audio-video nel Var e nelle Alpi Marittime: impianti elettrici e illuminazione, TV e video, home cinema, impianti audio, reti Wi-Fi, telecamere e allarmi. Un unico referente per tutto l'impianto, dal progetto all'accensione.",
    built: [
      "Una home page scura e cinematografica, dove si possono spegnere le luci di una sala home cinema.",
      "Le cinque aree di competenza, ciascuna con i suoi servizi in dettaglio.",
      "Una galleria dei lavori realizzati, filtrabile per tipo di intervento.",
      "La richiesta di sopralluogo o di preventivo gratuito in un solo passaggio.",
      "Chiamata e WhatsApp disponibili da ogni pagina.",
    ],
    design: "Il sito mette in scena il mestiere: la luce che si accende e si spegne nella sala mostra con un solo gesto cosa installa l'azienda. Fondo scuro, caratteri eleganti e animazioni su misura danno un'immagine di alta gamma, all'altezza degli impianti stessi.",
  },
  julienb: {
    place: "Studio web indipendente",
    client: "È il sito dello studio di Julien Bourgois, cofondatore di The Vitrine. Julien progetta e sviluppa siti vetrina su misura per artigiani, commercianti, terapeuti e autori: veloci, pensati per il telefono e fatti per invogliare a chiamare.",
    built: [
      "Un portfolio «quattro mestieri, quattro identità» con l'anteprima dal vivo di ogni sito.",
      "Tre modi di collaborare, spiegati in modo semplice.",
      "Un metodo in quattro tappe, «senza sorprese».",
      "Le domande frequenti e il contatto diretto via e-mail e telefono.",
    ],
    design: "Uno studio che si presenta con l'esempio: una tipografia editoriale decisa, tanto spazio bianco e lavori mostrati dal vivo anziché in schermate. Il tono è diretto e caloroso, come un primo incontro con Julien.",
  },
  stephanie: {
    place: "Saint-Raphaël, Var",
    client: "SR Bien-être è lo studio di una sofrologa e operatrice di trattamenti energetici a Saint-Raphaël. Lavora con adulti, adolescenti e bambini: sofrologia, trattamenti energetici e Reiki, linfodrenaggio, massaggio modellante e yoga per bambini, in studio o a domicilio nei dintorni di Saint-Raphaël.",
    built: [
      "Una schermata di benvenuto che invita a respirare prima di entrare nel sito.",
      "Una pagina per ogni trattamento, con i suoi benefici e il prezzo.",
      "La presentazione della professionista e dello studio.",
      "Le domande frequenti, per rispondere ai dubbi prima del primo appuntamento.",
      "La prenotazione online, disponibile da ogni pagina.",
    ],
    design: "Tutto invita alla calma: colori tenui, tanto spazio e parole scelte con cura (ascolto, dolcezza, gentilezza). La schermata «Respira» dà il tono fin dal primo secondo, e la prenotazione è sempre a portata di mano.",
  },
  taquet: {
    place: "Psicologia ed editoria",
    client: "Annick Taquet-Assoignons è psicologa clinica, relatrice, formatrice e autrice di undici libri presso tre editori. Scrive albi illustrati che aiutano i bambini a dare un nome a ciò che vivono, e libri per i curanti e per i caregiver familiari.",
    built: [
      "Un catalogo dei suoi albi per bambini, filtrabile per tema (emozioni, famiglia, malattia, immaginazione), con l'età consigliata e un link per l'acquisto.",
      "I suoi libri e le sue guide per i curanti e i caregiver familiari, con un focus sul titolo più conosciuto.",
      "Il suo percorso di psicologa e autrice.",
      "Le prossime presentazioni con firma copie e il link a Instagram.",
    ],
    design: "Due pubblici, due porte d'ingresso fin dalla home page: «per un bambino» e «per te che ti prendi cura degli altri». Il tono è caldo e delicato, come i libri, con le copertine in evidenza come sul tavolo di una libreria.",
  },
  "filton-athletic-fc": {
    place: "Filton, Bristol (Regno Unito)",
    client: "Il Filton Athletic FC è un club di calcio dilettantistico del nord di Bristol, fondato negli anni Sessanta a Filton, la città natale del Concorde. La prima squadra, le riserve, la squadra A e il settore giovanile giocano al BBS Park North nella Marcliff Gloucestershire County Football League.",
    built: [
      "La prossima partita in primo piano, con data, orario del calcio d'inizio e avversario.",
      "Il calendario del club, gli ultimi risultati e i link alle classifiche ufficiali del campionato.",
      "Le notizie, lo shop del club e una pagina su come entrare a far parte della squadra.",
      "Una striscia che fa scorrere tutti gli sponsor del club.",
      "Una pagina per ogni squadra, dalla prima squadra al settore giovanile.",
    ],
    design: "Il sito parte dalla storia del luogo: «Giochiamo dove volava il Concorde». I richiami all'aviazione danno al club un'identità tutta sua, mentre le informazioni sulle partite restano in primo piano per giocatori e tifosi.",
  },
  "filton-social-club": {
    place: "Filton, Bristol (Regno Unito)",
    client: "Il Filton & District Social Club è un circolo accogliente a Filton, Bristol: sport in diretta su Sky Sports e TNT Sports, serate di intrattenimento il sabato, tombola, squadre di skittles, sale in affitto e un bar dove i cani sono i benvenuti. Anche gli ospiti sono ben accetti.",
    built: [
      "Il programma degli spettacoli mese per mese, con una scheda per ogni serata.",
      "Un calendario degli eventi e una pagina «In programma».",
      "Le squadre di skittles, l'affitto delle sale e l'iscrizione.",
      "Il comitato, una pagina commemorativa, una galleria, gli orari e le indicazioni.",
    ],
    design: "Un sito semplice e chiaro per soci di tutte le età: la prossima grande serata è annunciata in home page, i prezzi per i soci sono visibili e ogni informazione pratica è a un clic dal menu.",
  },
  "speakup-ai-english-trainer": {
    place: "Online",
    client: "SpeakUp AI è uno strumento creato da Antony Addy, formatore d'inglese certificato, per esercitarsi in vere conversazioni in inglese: colloqui di lavoro, viaggi, affari e vita quotidiana. Completa i suoi corsi ed è gratuito durante il lancio.",
    built: [
      "38 scenari di vita reale e 5 modalità di coaching.",
      "Conversazione a voce o per iscritto, con un interlocutore IA che si adatta al livello di chi impara.",
      "Un resoconto dopo ogni sessione: livello QCER, punti di forza e correzioni prioritarie.",
      "Un'interfaccia in 12 lingue, senza account né carta di credito.",
      "Un link ai corsi con Antony per chi vuole andare oltre.",
    ],
    design: "La home page mostra subito una vera conversazione e un esempio di resoconto, così si capisce lo strumento prima di provarlo. Il percorso è in tre tappe, scegli, parla, ricevi il resoconto, e si può iniziare in pochi secondi.",
  },
  "toeic-success-hub": {
    place: "Online",
    client: "ToeicPath è una piattaforma di preparazione al TOEIC creata da Antony Addy. Copre entrambi i formati dell'esame, il TOEIC Listening & Reading e il TOEIC 4 Skills, ed è gratuita e senza registrazione durante il lancio.",
    built: [
      "Tutte e sette le parti del Listening & Reading, più esercizi a tempo di Speaking e Writing.",
      "Una simulazione d'esame ed esercizi adattivi.",
      "Un allenatore di vocabolario professionale con 300 termini.",
      "L'autovalutazione di Speaking e Writing secondo i criteri ufficiali, spiegati nella lingua di chi impara.",
      "Le spiegazioni chiave in otto lingue e il monitoraggio dei progressi.",
    ],
    design: "Tutto punta all'obiettivo, un punteggio di 990, mostrato in home page. La navigazione per competenza e per formato d'esame permette a ognuno di andare dritto a ciò che deve allenare, senza creare un account.",
    seoDescription: "Preparazione al TOEIC completa e guidata, sulle quattro competenze, con simulazioni d'esame ed esercizi adattivi, senza account.",
  },
  "cloe-prep-path": {
    place: "Online",
    client: "CLOE Prep è una preparazione indipendente alla certificazione d'inglese CLOE, ideata da Antony Addy. È pensata per i professionisti che devono certificare il proprio livello nell'inglese che usano davvero al lavoro: e-mail, riunioni, telefonate e servizio clienti.",
    built: [
      "Esercizi sulle quattro competenze, più l'orale.",
      "Domande adattive, ciascuna legata a un livello QCER dall'A1 al C2.",
      "Brevi sessioni da dieci minuti oppure una simulazione d'esame completa.",
      "Una guida al giorno dell'esame, dalla prova scritta al computer all'orale con l'esaminatore.",
    ],
    design: "Una metafora di scalata attraversa il sito, «Sali fino a CLOE»: le quattro competenze si intrecciano in un'unica salita, dal livello attuale al giorno dell'esame superato. Il design resta pulito e professionale, come l'esame stesso.",
  },
  "english-grammar-hub": {
    place: "Online",
    client: "Grammatica è una risorsa di grammatica inglese creata da Antony Addy per chi capisce meglio una regola spiegata nella propria lingua: francese, spagnolo, portoghese, italiano, tedesco, russo, arabo o cinese mandarino.",
    built: [
      "136 argomenti di grammatica raggruppati per temi, dalle basi della frase alle strutture avanzate.",
      "272 esercizi autocorretti.",
      "Ogni regola spiegata nella lingua di chi impara.",
      "Ricerca, monitoraggio dei progressi ed esercizi di confronto.",
    ],
    design: "La home page mostra la promessa in azione: un errore corretto, con la spiegazione nella lingua scelta. Gli argomenti sono organizzati come un indice chiaro, così ogni regola si trova in pochi secondi.",
  },
  "adventure-books": {
    place: "Online",
    client: "English Reading Adventures è una raccolta di storie interattive creata da Antony Addy per chi impara l'inglese. Il lettore è l'eroe: ogni pagina finisce con una scelta, e scegliere bene significa aver capito ciò che si è appena letto.",
    built: [
      "Ogni storia scritta su tre livelli (A2, B1, B2), che si possono cambiare in qualsiasi momento, anche a metà storia.",
      "Lo stesso percorso a ogni livello, così un'intera classe può leggere lo stesso libro.",
      "Il significato di qualsiasi parola in un tocco, in otto lingue.",
      "Una biblioteca di dieci storie, con altre in arrivo.",
    ],
    design: "Il sito sembra uno scaffale di romanzi: copertine curate, un'atmosfera da racconto e impaginazioni da libro. L'inglese resta in primo piano, con la lingua di chi impara come rete di sicurezza appena sotto.",
  },
  "listening-english-antonyaddy": {
    place: "Online",
    client: "ListenUp è una piattaforma per allenare l'ascolto in inglese creata da Antony Addy, dal livello principiante all'avanzato. Si basa su vere conversazioni della vita quotidiana e del lavoro, ed è gratuita durante il lancio.",
    built: [
      "Più di 180 esercizi su 31 argomenti: personale, professionale, vendite, studio, viaggi, tecnologia e altro.",
      "Audio IA con evidenziazione parola per parola, in stile karaoke.",
      "Traduzioni immediate in più di dieci lingue.",
      "Quiz di comprensione, un elenco di vocaboli, i segnalibri e la modalità scura.",
    ],
    design: "La home page riproduce ed evidenzia una frase con la sua traduzione, mostrando come funziona prima di qualsiasi spiegazione. I percorsi sono raggruppati per ambito, così ognuno inizia dalle situazioni che contano per lui.",
  },
  "anglais-a-distance-learn": {
    place: "Online",
    client: "Anglais à Distance è un sito gratuito d'inglese online per adulti francofoni, creato da Antony Addy. Parte dagli errori che i francofoni fanno davvero («depends of», «since 3 years»…) per correggerli, spiegarli e farli memorizzare.",
    built: [
      "100 trappole frequenti spiegate e più di 3.000 domande corrette.",
      "Esercizi da dieci domande con correzione e spiegazioni immediate.",
      "Tre percorsi per livello, dal principiante assoluto alle sfumature più sottili.",
      "34 dialoghi audio, vocabolario e quiz.",
      "Progressi salvati sul dispositivo, senza account né registrazione.",
    ],
    design: "La home page fa scorrere gli errori più comuni: ogni francofono ne riconosce qualcuno, e la voglia di capirne il perché fa il resto. Tutto è in francese, accessibile e gratuito, con una ricerca rapida per trovare qualsiasi regola.",
  },
  "biz-fluent-coach": {
    place: "Online",
    client: "TP English Pro è una piattaforma d'inglese professionale creata da Antony Addy per chi prepara il titolo professionale francese di Assistant de Direction (assistente di direzione), e in particolare la sua prova orale d'inglese. È gratuita.",
    built: [
      "Conversazioni con l'IA in 10 situazioni d'ufficio, a voce o per iscritto.",
      "Feedback immediato e dettagliato e una modalità esame che simula la prova orale.",
      "Moduli su e-mail, telefonate, riunioni e traduzione professionale.",
      "500 termini di lessico amministrativo e ripasso.",
      "Un'interfaccia in francese, ucraino, russo, arabo e rumeno.",
    ],
    design: "Una piattaforma pensata come un percorso di formazione: moduli numerati, monitoraggio dei progressi e ripasso, tutto intorno a un unico obiettivo, superare l'esame. La scelta delle lingue dell'interfaccia rispecchia chi frequenta il corso.",
  },
  "addys-english-pro": {
    place: "Costa Azzurra e online",
    client: "È il sito principale di Antony Addy, cofondatore di The Vitrine: formatore d'inglese professionale britannico, certificato come Formateur Professionnel d'Adultes dal 2017, formatore in IA generativa e creatore di siti web e strumenti didattici, in Costa Azzurra e online.",
    built: [
      "Tre percorsi dalla home page: inglese professionale, IA generativa, siti e strumenti.",
      "Un unico referente per le tre attività, presentato fin dalla prima schermata.",
      "Testimonianze e raccomandazioni dei clienti.",
      "Una prima chiamata gratuita, con risposta entro 24 ore lavorative, e il contatto su WhatsApp.",
      "Risorse gratuite e note legali complete.",
    ],
    design: "Tre righe di titolo per tre mestieri, «L'inglese. L'IA. Il web.», e un colore per ogni attività che accompagna il visitatore in tutto il sito. Il tono resta personale: è Antony che parla, in prima persona.",
    seoDescription: "Il sito di Antony: inglese professionale, workshop di IA generativa e siti web, con un unico referente, in Costa Azzurra e online.",
  },
  "addy-genai-training": {
    place: "Fréjus e online",
    client: "Antony Addy, formatore certificato con sede a Fréjus, forma aziende e liberi professionisti all'IA generativa: ChatGPT, Claude, Gemini o Copilot, in presenza o a distanza, in francese o in inglese, partendo dai loro casi d'uso.",
    built: [
      "Quattro competenze chiave, ciascuna legata a usi concreti: IA conversazionale, creazione visiva, automazione e agenti, e altro.",
      "Due percorsi, per le aziende e per i liberi professionisti.",
      "Le piattaforme che Antony ha creato lui stesso con l'IA, come prova concreta.",
      "Guide pratiche, domande frequenti, richiesta di preventivo e contatto su WhatsApp.",
      "Versioni in francese e in inglese.",
    ],
    design: "La home page mostra una richiesta digitata dal vivo, «Riassumi questo rapporto di 40 pagine»: l'IA generativa spiegata con l'esempio, senza gergo. Il sito riprende l'identità visiva del sito principale di Antony, con un colore tutto suo.",
  },
  "addy-sap-connect": {
    place: "In sede e online",
    client: "Antony Addy offre formazione sul modulo SAP Materials Management (MM) per professionisti e aziende. Madrelingua inglese, bilingue in francese e formatore certificato dal 2017, forma in sede, online o con un programma su misura.",
    built: [
      "Le tre aree principali della formazione: acquisti, gestione del magazzino e anagrafiche.",
      "Il dettaglio dei programmi di formazione MM.",
      "La presentazione del formatore e del suo percorso.",
      "Un sito in inglese e in francese, con un'area «La mia formazione».",
    ],
    design: "Un sito pulito e professionale per un pubblico aziendale: i benefici concreti della formazione vengono prima di tutto, e le qualifiche del formatore sono visibili dalla home page.",
  },
  "student-mark-tracker": {
    place: "Strumento interno",
    client: "Student Mark Tracker è uno spazio di lavoro privato sviluppato per Antony Addy Formations. Serve a seguire il lavoro di ogni allievo dei corsi d'inglese: documenti, voti e progressi individuali.",
    built: [
      "Una dashboard privata, protetta da login via e-mail o account Google.",
      "Documenti, voti e progressi di ogni allievo, separati e ordinati.",
    ],
    design: "Uno strumento sobrio e pratico, pensato per l'uso quotidiano. Poiché contiene i dati degli allievi, solo la pagina di accesso è pubblica. Lo strumento è ancora in fase di sviluppo.",
  },
  "jan-stenborg": {
    place: "Stoccolma (Svezia) e Costa Azzurra",
    client: "Jan Stenborg è un romanziere svedese indipendente, nato a Stoccolma nel 1955 e oggi residente in Costa Azzurra. Scrive romanzi d'avventura storici ambientati nell'epoca vichinga: la trilogia di Erik di Birka, con Stridslarm (2017), Jagad (2021) e Kungablod, che la conclude. Prima di scrivere aveva fondato Stonecastle, un'azienda di pedalboard e accessori per chitarra venduti in una decina di paesi.",
    built: [
      "Un sito in svedese e in inglese, con un selettore di lingua su ogni pagina.",
      "Una home page dedicata al nuovo romanzo, Kungablod, con la prossima sessione di firma copie.",
      "La trilogia presentata libro per libro: anno, editore, numero di pagine, trama, estratti dell'indice e link per acquistare o ascoltare (Adlibris, Bokus, Storytel), con un estratto audio gratuito.",
      "Gli eventi, con aggiunta al calendario, mappa, condivisione e locandina da scaricare.",
      "La storia di Jan, un blog e le domande frequenti.",
      "Il contatto via e-mail e il link a Facebook.",
    ],
    design: "Un universo scuro e dorato, nello spirito delle copertine: la nuova copertina è presentata come un oggetto incorniciato, e le grandi sezioni del sito sono numerate con cifre romane, come i capitoli di un libro. Il tono è quello di una saga, senza mai nascondere l'essenziale: il prossimo appuntamento e dove trovare i libri.",
    seoDescription: "Il sito in svedese e inglese del romanziere Jan Stenborg: la trilogia vichinga, le firme copie e la sua storia, con link per leggere o ascoltare i libri.",
  },
};
