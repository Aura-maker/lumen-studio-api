// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function upsertMateriaConContenuti({ nome, descrizione, argomenti5 }) {
  // Elimina materia esistente e ricrea
  const existing = await prisma.materia.findFirst({ where: { nome } });
  if (existing) {
    await prisma.argomento.deleteMany({ where: { materiaId: existing.id } });
    await prisma.sezioneAnno.deleteMany({ where: { materiaId: existing.id } });
    await prisma.materia.delete({ where: { id: existing.id } });
  }

  const materia = await prisma.materia.create({ data: { nome, descrizione } });

  // Sezioni 4° e 5° anno
  await prisma.sezioneAnno.createMany({ data: [
    { etichetta: '4° anno', materiaId: materia.id },
    { etichetta: '5° anno', materiaId: materia.id }
  ]});

  // Argomenti con quiz e flashcard
  for (const a of argomenti5) {
    const arg = await prisma.argomento.create({ data: { titolo: a.titolo, descrizione: a.riassunto, materiaId: materia.id } });

    if (a.flashcard && a.flashcard.length) {
      await prisma.flashcard.createMany({ data: a.flashcard.map(f => ({ fronte: f.fronte, retro: f.retro, argomentoId: arg.id })) });
    }

    if (a.quiz && a.quiz.domande && a.quiz.domande.length) {
      const quiz = await prisma.quiz.create({ data: {
        titolo: a.quiz.titolo,
        descrizione: a.quiz.descrizione || null,
        punteggioMax: a.quiz.domande.reduce((s, d) => s + (d.punti || 1), 0),
        tempoLimite: a.quiz.tempoLimite || 300,
        argomentoId: arg.id,
        pubblico: true
      }});
      for (const d of a.quiz.domande) {
        await prisma.domanda.create({ data: {
          testo: d.testo,
          tipo: d.tipo || 'multipla',
          scelte: d.scelte || null,
          immagineUrl: d.immagineUrl || null,
          spiegazione: d.spiegazione || null,
          linkLezione: d.linkLezione || null,
          quizId: quiz.id,
          punti: d.punti || 1
        }});
      }
    }
  }
}

async function main() {
  // Distintivi
  await prisma.distintivo.createMany({
    data: [
      { chiave: 'primo_quiz', titolo: '🏆 Primo Quiz', descrizione: 'Hai completato il primo quiz', punti: 10 },
      { chiave: 'costanza_settimana', titolo: '🔥 Costanza', descrizione: 'Hai studiato 7 giorni consecutivi', punti: 50 },
      { chiave: 'alto_voto', titolo: '⭐ Alto Voto', descrizione: 'Hai ottenuto almeno il 90%', punti: 20 },
      { chiave: 'perfetto', titolo: '💯 Perfetto', descrizione: 'Hai totalizzato 100% in un quiz', punti: 50 }
    ],
    skipDuplicates: true
  });

  // Admin
  const hashed = await bcrypt.hash('password', 12);
  const adminMail = 'admin@liceo.edu';
  const existing = await prisma.utente.findUnique({ where: { email: adminMail } });
  if (!existing) {
    await prisma.utente.create({ data: { email: adminMail, password: hashed, nome: 'Admin Liceo', ruolo: 'ADMIN', punti: 0, livello: 1 } });
  }

  console.log('📚 Caricamento programma di quinta...');

  // === 8 MATERIE CON EMOJI ===
  const MATERIE = [
    {
      nome: '🎨 Storia dell\'Arte',
      descrizione: 'Dall\'Impressionismo all\'arte contemporanea.',
      argomenti5: [
        {
          titolo: 'Impressionismo',
          riassunto: 'L\'**Impressionismo** (1860-1880) rompe con l\'accademia: dipinge *en plein air*, cattura **luce** e **colore** istantanei, abolisce il disegno preparatorio. Protagonisti: **Monet** (serie delle Ninfee, Cattedrale di Rouen), **Renoir** (scene di vita mondana), **Degas** (ballerine, asimmetrie), **Manet** (Olympia, Colazione sull\'erba). Tecnica: *pennellate rapide*, *colori puri* accostati, soggetti della vita moderna.',
          flashcard: [
            { fronte: 'Gli impressionisti dipingono en plein air per cogliere la luce naturale in tempo reale.', retro: 'La pittura en plein air permette agli impressionisti di fissare direttamente sulla tela le variazioni della luce.' },
            { fronte: 'Claude Monet ripete lo stesso soggetto per osservare come la luce lo trasforma nelle diverse ore e stagioni.', retro: 'Le serie pittoriche di Monet mostrano lo stesso scenario in condizioni luminose differenti per studiare l\'atmosfera.' },
            { fronte: 'Edgar Degas costruisce le composizioni con tagli asimmetrici che ricordano le inquadrature fotografiche.', retro: 'Le scelte compositive di Degas utilizzano tagli diagonali e scorci improvvisi per suggerire il movimento delle ballerine.' }
          ],
          quiz: {
            titolo: 'Quiz Impressionismo',
            domande: [
              { testo: 'Quale tecnica caratterizza gli impressionisti?', tipo: 'multipla', scelte: [
                { testo: 'Pittura en plein air con colori puri', isCorrect: true },
                { testo: 'Disegno preparatorio dettagliato', isCorrect: false },
                { testo: 'Uso esclusivo di colori scuri', isCorrect: false }
              ], punti: 2 },
              { testo: 'Chi dipinge le serie delle Ninfee?', tipo: 'multipla', scelte: [
                { testo: 'Monet', isCorrect: true },
                { testo: 'Degas', isCorrect: false },
                { testo: 'Renoir', isCorrect: false }
              ], spiegazione: 'Monet dedica gli ultimi anni alle Ninfee di Giverny.', punti: 1 },
              { testo: 'Cosa studia Monet nelle sue serie?', tipo: 'multipla', scelte: [
                { testo: 'Variazioni di luce e atmosfera', isCorrect: true },
                { testo: 'Anatomia umana', isCorrect: false },
                { testo: 'Architettura gotica', isCorrect: false }
              ], punti: 2 }
            ]
          }
        },
        {
          titolo: 'Post-Impressionismo',
          riassunto: 'Il **Post-Impressionismo** supera l\'impressione momentanea: cerca *struttura*, *espressione*, *simbolo*. **Cézanne**: geometrizzazione delle forme, ricerca della solidità ("trattare la natura tramite cilindro, sfera, cono"). **Van Gogh**: colore espressivo, pennellata tormentata, drammaticità esistenziale. **Gauguin**: sintetismo, colori piatti, simbolismo primitivo.',
          flashcard: [
            { fronte: 'Paul Cézanne riduce i paesaggi a cilindri, sfere e coni per restituire stabilità volumetrica.', retro: 'Il linguaggio di Cézanne traduce la natura in solidi geometrici per dare struttura agli oggetti dipinti.' },
            { fronte: 'Vincent van Gogh usa colori accesi e pennellate tormentate per esprimere la propria tensione interiore.', retro: 'Le tele di Van Gogh comunicano emozioni intense attraverso contrasti cromatici violenti e segni energici.' },
            { fronte: 'Paul Gauguin stende campiture piatte e colori sintetici per evocare mondi simbolici primitivi.', retro: 'Il sintetismo di Gauguin semplifica le forme e impiega colori puri per collegare pittura e spiritualità.' }
          ],
          quiz: {
            titolo: 'Quiz Post-Impressionismo',
            domande: [
              { testo: 'Quale artista geometrizza le forme naturali?', tipo: 'multipla', scelte: [
                { testo: 'Cézanne', isCorrect: true },
                { testo: 'Van Gogh', isCorrect: false },
                { testo: 'Monet', isCorrect: false }
              ], spiegazione: 'Cézanne cerca la solidità delle forme tramite geometria.', punti: 2 },
              { testo: 'Cosa caratterizza lo stile di Van Gogh?', tipo: 'multipla', scelte: [
                { testo: 'Pennellate tormentate e colori espressivi', isCorrect: true },
                { testo: 'Colori pastello e pennellate leggere', isCorrect: false },
                { testo: 'Realismo fotografico', isCorrect: false }
              ], punti: 2 }
            ]
          }
        },
        {
          titolo: 'Avanguardie del Novecento',
          riassunto: 'Le **Avanguardie** rivoluzionano l\'arte: **Cubismo** (Picasso, Braque) scompone e ricompone la realtà da più punti di vista. **Futurismo** (Marinetti, Boccioni) esalta velocità, macchina, dinamismo. **Espressionismo** (Munch, Die Brücke) deforma la realtà per esprimere angoscia. **Surrealismo** (Dalí, Magritte) esplora l\'inconscio, il sogno, l\'automatismo psichico. **Dada** (Duchamp) nega l\'arte tradizionale con provocazione e ready-made.',
          flashcard: [
            { fronte: 'Il cubismo analitico scompone l\'oggetto in piani geometrici osservati simultaneamente.', retro: 'I pittori cubisti mostrano il soggetto da punti di vista multipli per restituire la complessità dello spazio.' },
            { fronte: 'Filippo Tommaso Marinetti esalta velocità e modernità nel Manifesto futurista del 1909.', retro: 'Il manifesto futurista proclama la bellezza della macchina e trasforma l\'energia urbana in ideale estetico.' },
            { fronte: 'Il surrealismo indaga l\'inconscio per liberare immagini oniriche e automatismi psichici.', retro: 'Gli artisti surrealisti trasformano sogni e fantasie in scenari visivi che sfidano la logica razionale.' },
            { fronte: 'Marcel Duchamp trasforma oggetti comuni in opere d\'arte con la pratica del ready-made.', retro: 'Il gesto di Duchamp dimostra che la scelta dell\'artista può attribuire un nuovo senso a un oggetto industriale.' }
          ],
          quiz: {
            titolo: 'Quiz Avanguardie',
            domande: [
              { testo: 'Quale movimento scompone la realtà in piani simultanei?', tipo: 'multipla', scelte: [
                { testo: 'Cubismo', isCorrect: true },
                { testo: 'Futurismo', isCorrect: false },
                { testo: 'Impressionismo', isCorrect: false }
              ], punti: 2 },
              { testo: 'Chi scrive il Manifesto Futurista nel 1909?', tipo: 'multipla', scelte: [
                { testo: 'Marinetti', isCorrect: true },
                { testo: 'Picasso', isCorrect: false },
                { testo: 'Dalí', isCorrect: false }
              ], spiegazione: 'Marinetti lancia il Futurismo esaltando velocità e modernità.', punti: 1 },
              { testo: 'Cosa esplora il Surrealismo?', tipo: 'multipla', scelte: [
                { testo: 'Inconscio, sogni e automatismo', isCorrect: true },
                { testo: 'Geometria e astrazione', isCorrect: false },
                { testo: 'Realismo sociale', isCorrect: false }
              ], punti: 2 }
            ]
          }
        }
      ]
    },
    {
      nome: 'Filosofia',
      descrizione: 'Dal positivismo alle correnti del Novecento, fino all\'epistemologia contemporanea.',
      argomenti5: [
        {
          titolo: 'Esistenzialismo (Sartre, Camus)',
          riassunto: 'L\'**Esistenzialismo** indaga *libertà*, *assurdo* e *responsabilità*. Per **Sartre** l\'uomo è condannato a essere libero; per **Camus** l\'assurdo è la frattura tra uomo e mondo.',
          flashcard: [
            { fronte: 'Albert Camus definisce assurdo il contrasto tra il bisogno umano di senso e il silenzio del mondo.', retro: 'Per Camus l\'assurdo spinge l\'uomo a reagire con rivolta e responsabilità di fronte a un universo indifferente.' },
            { fronte: 'Jean-Paul Sartre afferma che l\'esistenza precede l\'essenza perché l\'uomo si costruisce con le proprie scelte.', retro: 'Secondo Sartre ogni individuo diventa ciò che decide di essere assumendo la piena responsabilità delle proprie azioni.' }
          ],
          quiz: {
            titolo: 'Esistenzialismo',
            domande: [
              { testo: 'Per Sartre cosa precede cosa?', tipo: 'multipla', scelte: [
                { testo: 'Esistenza precede essenza', isCorrect: true }, { testo: 'Essenza precede esistenza', isCorrect: false }
              ] },
              { testo: 'Per Camus, che cos\'è l\'assurdo?', tipo: 'multipla', scelte: [
                { testo: 'La frattura tra uomo e mondo', isCorrect: true }, { testo: 'La mancanza di logica nei sillogismi', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Fisica',
      descrizione: 'Meccanica relativistica e quantistica, onde e nuclei.',
      argomenti5: [
        {
          titolo: 'Relatività Ristretta',
          riassunto: 'La **Relatività ristretta** introduce *dilatazione dei tempi*, *contrazione delle lunghezze* e **E=mc^2**. Postulati: costanza della velocità della luce e uguaglianza delle leggi fisiche nei sistemi inerziali.',
          flashcard: [
            { fronte: 'La relazione E=mc² mostra che la massa è una forma di energia concentrata.', retro: 'L\'equivalenza massa-energia spiega come una piccola quantità di massa possa liberare enormi quantità di energia.' },
            { fronte: 'Un orologio in moto a velocità prossime alla luce scorre più lentamente di un orologio fermo.', retro: 'La dilatazione dei tempi indica che il tempo dipende dallo stato di moto del sistema osservato.' }
          ],
          quiz: {
            titolo: 'Relatività base',
            domande: [
              { testo: 'Qual è una conseguenza della relatività ristretta?', tipo: 'multipla', scelte: [
                { testo: 'Dilatazione dei tempi', isCorrect: true }, { testo: 'Aumento della massa dei protoni', isCorrect: false }
              ] },
              { testo: 'Quale grandezza è costante in tutti i sistemi inerziali?', tipo: 'multipla', scelte: [
                { testo: 'Velocità della luce', isCorrect: true }, { testo: 'Accelerazione di gravità', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Inglese',
      descrizione: 'Letteratura inglese del XX secolo e competenze linguistiche avanzate.',
      argomenti5: [
        {
          titolo: 'Modernismo (Eliot, Woolf)',
          riassunto: 'Il **Modernismo** esplora *stream of consciousness*, *frammentazione* e *crisi del soggetto*. **T.S. Eliot** e **Virginia Woolf** sono figure chiave.',
          flashcard: [
            { fronte: 'Il modernismo utilizza lo stream of consciousness per seguire il flusso dei pensieri senza interruzioni.', retro: 'La tecnica del flusso di coscienza restituisce la complessità psicologica dei personaggi modernisti.' },
            { fronte: 'T.S. Eliot descrive la crisi spirituale del Novecento nel poema The Waste Land.', retro: 'The Waste Land intreccia citazioni e frammenti per rappresentare un mondo disgregato dopo la Grande Guerra.' }
          ],
          quiz: {
            titolo: 'Modernismo UK',
            domande: [
              { testo: 'Chi è autore di The Waste Land?', tipo: 'multipla', scelte: [
                { testo: 'T.S. Eliot', isCorrect: true }, { testo: 'James Joyce', isCorrect: false }
              ] },
              { testo: 'La tecnica dello stream of consciousness è tipica del...', tipo: 'multipla', scelte: [
                { testo: 'Modernismo', isCorrect: true }, { testo: 'Romanticismo', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Latino',
      descrizione: 'Letteratura latina classica e tarda, retorica e storiografia.',
      argomenti5: [
        {
          titolo: 'Retorica e Oratoria Tarda',
          riassunto: 'Da **Tacito** a **Quintiliano**: evoluzione dell\'oratoria e codificazione della *retorica*; concetti di *inventio*, *dispositio*, *elocutio*.',
          flashcard: [
            { fronte: 'Quintiliano scrive l\'Institutio oratoria per definire la formazione ideale dell\'oratore romano.', retro: 'L\'Institutio oratoria descrive un percorso educativo completo che unisce teoria retorica e virtù civica.' },
            { fronte: 'L\'inventio individua gli argomenti più efficaci da usare in un discorso retorico.', retro: 'La fase dell\'inventio permette all\'oratore di raccogliere prove e idee utili alla persuasione.' }
          ],
          quiz: {
            titolo: 'Retorica latina',
            domande: [
              { testo: 'Quale delle seguenti è una fase della retorica?', tipo: 'multipla', scelte: [
                { testo: 'Inventio', isCorrect: true }, { testo: 'Versificatio', isCorrect: false }
              ] },
              { testo: 'Chi è l\'autore dell\'Institutio oratoria?', tipo: 'multipla', scelte: [
                { testo: 'Quintiliano', isCorrect: true }, { testo: 'Virgilio', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Matematica',
      descrizione: 'Analisi, probabilità e statistica, elementi di logica.',
      argomenti5: [
        {
          titolo: 'Derivate e Studio di Funzione',
          riassunto: 'Con le **derivate** si analizzano *monotonia*, *massimi/minimi* e *flessi*. Studio di funzione in passi: dominio, segno, limiti, derivata prima e seconda.',
          flashcard: [
            { fronte: 'La derivata della funzione x^n è uguale a n volte x elevato alla n meno uno.', retro: 'Applicare la regola di derivazione di x^n produce n·x^(n-1), utile nello studio di funzione.' },
            { fronte: 'Se la derivata prima è positiva la funzione cresce e se è negativa la funzione decresce.', retro: 'Il criterio della derivata prima individua gli intervalli di monotonia analizzando il segno di f\'.' }
          ],
          quiz: {
            titolo: 'Derivate base',
            domande: [
              { testo: 'La derivata di x^3 è...', tipo: 'multipla', scelte: [
                { testo: '3x^2', isCorrect: true }, { testo: 'x^2', isCorrect: false }
              ] },
              { testo: 'Il segno di f\'>0 indica...', tipo: 'multipla', scelte: [
                { testo: 'Crescenza', isCorrect: true }, { testo: 'Decrescenza', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Religione',
      descrizione: 'Etica, dialogo interreligioso, Dottrina sociale.',
      argomenti5: [
        {
          titolo: 'Dottrina Sociale e Etica Contemporanea',
          riassunto: 'Temi: **dignità umana**, *bene comune*, **sussidiarietà**, *solidarietà*. Dialogo con scienze e società pluralista.',
          flashcard: [
            { fronte: 'Il bene comune indica le condizioni sociali che favoriscono lo sviluppo di ogni persona.', retro: 'Promuovere il bene comune significa creare contesti in cui tutti possano realizzare le proprie potenzialità.' },
            { fronte: 'Il principio di sussidiarietà chiede che le decisioni siano prese dal livello più vicino ai cittadini.', retro: 'La sussidiarietà evita la centralizzazione e sostiene le comunità locali nel loro agire responsabile.' }
          ],
          quiz: {
            titolo: 'Etica sociale',
            domande: [
              { testo: 'La sussidiarietà implica...', tipo: 'multipla', scelte: [
                { testo: 'Decisioni al livello più vicino', isCorrect: true }, { testo: 'Centralizzazione', isCorrect: false }
              ] },
              { testo: 'Il bene comune è...', tipo: 'multipla', scelte: [
                { testo: 'Condizioni per sviluppo di tutti', isCorrect: true }, { testo: 'Utile del singolo', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Scienze naturali',
      descrizione: 'Biologia molecolare, genetica, evoluzione.',
      argomenti5: [
        {
          titolo: 'Genetica Mendeliana ed Estensioni',
          riassunto: 'Leggi di **Mendel**, *dominanza incompleta*, *codominanza*, *epistasi*. Concetti chiave: *gene*, *allele*, *genotipo*, *fenotipo*.',
          flashcard: [
            { fronte: 'La prima legge di Mendel afferma che la generazione F1 è uniforme quando si incrociano linee pure.', retro: 'L\'uniformità della F1 deriva dal fatto che ogni individuo eredita un allele da ciascun genitore.' },
            { fronte: 'Il genotipo descrive la composizione genetica mentre il fenotipo mostra i tratti osservabili.', retro: 'Le interazioni tra patrimonio genetico e ambiente determinano il fenotipo manifestato dall\'organismo.' }
          ],
          quiz: {
            titolo: 'Genetica base',
            domande: [
              { testo: 'La dominanza incompleta produce...', tipo: 'multipla', scelte: [
                { testo: 'Fenotipo intermedio', isCorrect: true }, { testo: 'Fenotipo identico a un genitore', isCorrect: false }
              ] },
              { testo: 'Il genotipo rappresenta...', tipo: 'multipla', scelte: [
                { testo: 'L\'insieme dei geni', isCorrect: true }, { testo: 'L\'insieme dei tratti osservabili', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    },
    {
      nome: 'Storia',
      descrizione: 'Dal primo Novecento alla globalizzazione contemporanea.',
      argomenti5: [
        {
          titolo: 'Guerra Fredda e Globalizzazione',
          riassunto: 'Dalla **Guerra Fredda** alla **globalizzazione**: blocchi *USA/URSS*, *détente*, crollo del Muro, integrazione economica e società dell\'informazione.',
          flashcard: [
            { fronte: 'La détente degli anni Settanta riduce temporaneamente la tensione tra Stati Uniti e Unione Sovietica.', retro: 'Gli accordi SALT esprimono la détente perché limitano la corsa agli armamenti nucleari.' },
            { fronte: 'Nel 1989 il crollo del Muro di Berlino segna la fine simbolica della Guerra Fredda.', retro: 'L\'abbattimento del Muro apre la strada alla riunificazione tedesca e a un nuovo equilibrio europeo.' }
          ],
          quiz: {
            titolo: 'Novecento avanzato',
            domande: [
              { testo: 'Quale evento avviene nel 1989?', tipo: 'multipla', scelte: [
                { testo: 'Crollo del Muro di Berlino', isCorrect: true }, { testo: 'Trattato di Versailles', isCorrect: false }
              ] },
              { testo: 'La Guerra Fredda è caratterizzata da...', tipo: 'multipla', scelte: [
                { testo: 'Contrapposizione USA/URSS', isCorrect: true }, { testo: 'Alleanza USA/URSS', isCorrect: false }
              ] }
            ]
          }
        }
      ]
    }
  ];

  for (const m of MATERIE) {
    await upsertMateriaConContenuti(m);
  }

  console.log('Seed completato (materie, argomenti, quiz, flashcard).');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
