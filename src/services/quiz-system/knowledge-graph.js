/**
 * 🕸️ KNOWLEDGE GRAPH - Grafo di Conoscenza per Quiz Intelligenti
 * Struttura le informazioni in nodi e relazioni per generare quiz contestuali
 * 
 * Ogni nodo rappresenta un'entità (persona, opera, evento, concetto)
 * Ogni arco rappresenta una relazione (scrisse, nacque_in, influenzò, ecc.)
 */

class KnowledgeGraph {
  constructor() {
    // Nodi del grafo: id -> { tipo, nome, attributi, metadata }
    this.nodi = new Map();
    
    // Archi del grafo: id -> { da, a, tipo, attributi }
    this.archi = new Map();
    
    // Indici per ricerca veloce
    this.indicePerTipo = new Map();      // tipo -> Set(id)
    this.indicePerNome = new Map();      // nome normalizzato -> id
    this.indiceRelazioni = new Map();    // id nodo -> Set(id archi)
    
    // Contatori per ID univoci
    this.contatorNodo = 0;
    this.contatorArco = 0;

    // Tipi di nodi supportati
    this.tipiNodo = {
      PERSONA: 'persona',
      OPERA: 'opera',
      EVENTO: 'evento',
      CONCETTO: 'concetto',
      LUOGO: 'luogo',
      MOVIMENTO: 'movimento',
      PERIODO: 'periodo',
      ISTITUZIONE: 'istituzione'
    };

    // Tipi di relazioni supportate
    this.tipiRelazione = {
      // Relazioni biografiche
      NACQUE_A: 'nacque_a',
      MORI_A: 'mori_a',
      NACQUE_NEL: 'nacque_nel',
      MORI_NEL: 'mori_nel',
      VISSE_IN: 'visse_in',
      
      // Relazioni con opere
      SCRISSE: 'scrisse',
      COMPOSE: 'compose',
      DIPINSE: 'dipinse',
      CREO: 'creo',
      PUBBLICATO_NEL: 'pubblicato_nel',
      
      // Relazioni intellettuali
      INFLUENZO: 'influenzo',
      FU_INFLUENZATO_DA: 'fu_influenzato_da',
      CRITICO: 'critico',
      AMMIRO: 'ammiro',
      CONOBBE: 'conobbe',
      STUDIO_CON: 'studio_con',
      
      // Relazioni con movimenti
      APPARTENNE_A: 'appartenne_a',
      FONDO: 'fondo',
      RAPPRESENTO: 'rappresento',
      
      // Relazioni storiche
      PARTECIPO_A: 'partecipo_a',
      CAUSO: 'causo',
      FU_CAUSATO_DA: 'fu_causato_da',
      PRECEDETTE: 'precedette',
      SEGUI: 'segui',
      CONTEMPORANEO_A: 'contemporaneo_a',
      
      // Relazioni concettuali
      ESPRIME: 'esprime',
      SI_OPPONE_A: 'si_oppone_a',
      DERIVA_DA: 'deriva_da',
      CONTIENE: 'contiene',
      
      // Relazioni geografiche
      SI_SVOLSE_A: 'si_svolse_a',
      ORIGINARIO_DI: 'originario_di'
    };

    // Template per domande basate su relazioni
    this.templateDomande = this.inizializzaTemplateDomande();

    console.log('🕸️ KnowledgeGraph inizializzato');
  }

  // ==================== GESTIONE NODI ====================

  /**
   * ➕ Aggiungi un nodo al grafo
   */
  aggiungiNodo(tipo, nome, attributi = {}) {
    // Verifica se esiste già
    const nomeNorm = this.normalizzaNome(nome);
    if (this.indicePerNome.has(nomeNorm)) {
      // Aggiorna attributi esistenti
      const idEsistente = this.indicePerNome.get(nomeNorm);
      const nodoEsistente = this.nodi.get(idEsistente);
      nodoEsistente.attributi = { ...nodoEsistente.attributi, ...attributi };
      return idEsistente;
    }

    const id = `n_${++this.contatorNodo}`;
    
    const nodo = {
      id,
      tipo,
      nome,
      nomeNormalizzato: nomeNorm,
      attributi: {
        ...attributi,
        creatoIl: new Date().toISOString()
      },
      metadata: {
        numeroRelazioni: 0,
        importanza: 0
      }
    };

    this.nodi.set(id, nodo);
    
    // Aggiorna indici
    if (!this.indicePerTipo.has(tipo)) {
      this.indicePerTipo.set(tipo, new Set());
    }
    this.indicePerTipo.get(tipo).add(id);
    this.indicePerNome.set(nomeNorm, id);
    this.indiceRelazioni.set(id, new Set());

    return id;
  }

  /**
   * 🔍 Trova un nodo per nome
   */
  trovaNodoPerNome(nome) {
    const nomeNorm = this.normalizzaNome(nome);
    const id = this.indicePerNome.get(nomeNorm);
    return id ? this.nodi.get(id) : null;
  }

  /**
   * 📋 Ottieni tutti i nodi di un tipo
   */
  getNodiPerTipo(tipo) {
    const ids = this.indicePerTipo.get(tipo);
    if (!ids) return [];
    return Array.from(ids).map(id => this.nodi.get(id));
  }

  // ==================== GESTIONE ARCHI ====================

  /**
   * ➕ Aggiungi una relazione tra due nodi
   */
  aggiungiRelazione(idDa, idA, tipo, attributi = {}) {
    // Verifica che i nodi esistano
    if (!this.nodi.has(idDa) || !this.nodi.has(idA)) {
      console.warn(`⚠️ Tentativo di creare relazione tra nodi inesistenti: ${idDa} -> ${idA}`);
      return null;
    }

    // Verifica se la relazione esiste già
    const relazioniDa = this.indiceRelazioni.get(idDa);
    for (const arcoId of relazioniDa) {
      const arco = this.archi.get(arcoId);
      if (arco.a === idA && arco.tipo === tipo) {
        // Relazione già esistente, aggiorna attributi
        arco.attributi = { ...arco.attributi, ...attributi };
        return arcoId;
      }
    }

    const id = `a_${++this.contatorArco}`;
    
    const arco = {
      id,
      da: idDa,
      a: idA,
      tipo,
      attributi: {
        ...attributi,
        creatoIl: new Date().toISOString()
      }
    };

    this.archi.set(id, arco);
    
    // Aggiorna indici relazioni
    this.indiceRelazioni.get(idDa).add(id);
    this.indiceRelazioni.get(idA).add(id);
    
    // Aggiorna contatori nei nodi
    this.nodi.get(idDa).metadata.numeroRelazioni++;
    this.nodi.get(idA).metadata.numeroRelazioni++;

    return id;
  }

  /**
   * 🔍 Trova relazioni di un nodo
   */
  getRelazioniDiNodo(idNodo, direzione = 'tutte') {
    const archiIds = this.indiceRelazioni.get(idNodo);
    if (!archiIds) return [];

    const archi = Array.from(archiIds).map(id => this.archi.get(id));
    
    switch (direzione) {
      case 'uscenti':
        return archi.filter(a => a.da === idNodo);
      case 'entranti':
        return archi.filter(a => a.a === idNodo);
      default:
        return archi;
    }
  }

  /**
   * 🔗 Trova nodi collegati
   */
  getNodiCollegati(idNodo, tipoRelazione = null) {
    const relazioni = this.getRelazioniDiNodo(idNodo);
    const nodiCollegati = [];

    for (const rel of relazioni) {
      if (tipoRelazione && rel.tipo !== tipoRelazione) continue;
      
      const idAltro = rel.da === idNodo ? rel.a : rel.da;
      const nodoAltro = this.nodi.get(idAltro);
      
      if (nodoAltro) {
        nodiCollegati.push({
          nodo: nodoAltro,
          relazione: rel,
          direzione: rel.da === idNodo ? 'uscente' : 'entrante'
        });
      }
    }

    return nodiCollegati;
  }

  // ==================== POPOLAMENTO DA FATTI ====================

  /**
   * 📥 Popola il grafo dai fatti estratti dal SemanticParser
   */
  popolaDaFatti(fattiEstratti, materia, argomento) {
    const stats = {
      nodiCreati: 0,
      relazioniCreate: 0,
      errori: []
    };

    // Processa fatti biografici
    if (fattiEstratti.biografici) {
      for (const fatto of fattiEstratti.biografici) {
        try {
          const idPersona = this.aggiungiNodo(
            this.tipiNodo.PERSONA,
            fatto.personaggio,
            {
              materia,
              argomento,
              confidence: fatto.confidence
            }
          );
          stats.nodiCreati++;

          if (fatto.data) {
            if (fatto.tipo === 'nascita') {
              this.nodi.get(idPersona).attributi.annoNascita = fatto.data;
            } else if (fatto.tipo === 'morte') {
              this.nodi.get(idPersona).attributi.annoMorte = fatto.data;
            }
          }

          if (fatto.luogo) {
            const idLuogo = this.aggiungiNodo(
              this.tipiNodo.LUOGO,
              fatto.luogo,
              { materia }
            );
            stats.nodiCreati++;

            const tipoRel = fatto.tipo === 'nascita' ? 
              this.tipiRelazione.NACQUE_A : this.tipiRelazione.MORI_A;
            
            this.aggiungiRelazione(idPersona, idLuogo, tipoRel, {
              anno: fatto.data
            });
            stats.relazioniCreate++;
          }
        } catch (e) {
          stats.errori.push(`Errore biografico: ${e.message}`);
        }
      }
    }

    // Processa opere
    if (fattiEstratti.opere) {
      for (const fatto of fattiEstratti.opere) {
        try {
          const idOpera = this.aggiungiNodo(
            this.tipiNodo.OPERA,
            fatto.titolo,
            {
              anno: fatto.anno,
              genere: fatto.genere,
              materia,
              argomento,
              confidence: fatto.confidence
            }
          );
          stats.nodiCreati++;

          if (fatto.autore) {
            const idAutore = this.aggiungiNodo(
              this.tipiNodo.PERSONA,
              fatto.autore,
              { materia }
            );
            
            this.aggiungiRelazione(idAutore, idOpera, this.tipiRelazione.SCRISSE, {
              anno: fatto.anno
            });
            stats.relazioniCreate++;
          }
        } catch (e) {
          stats.errori.push(`Errore opera: ${e.message}`);
        }
      }
    }

    // Processa eventi
    if (fattiEstratti.eventi) {
      for (const fatto of fattiEstratti.eventi) {
        try {
          const idEvento = this.aggiungiNodo(
            this.tipiNodo.EVENTO,
            fatto.descrizione.substring(0, 100),
            {
              descrizioneCompleta: fatto.descrizione,
              anno: fatto.data,
              sottotipo: fatto.sottotipo,
              materia,
              argomento,
              confidence: fatto.confidence
            }
          );
          stats.nodiCreati++;
        } catch (e) {
          stats.errori.push(`Errore evento: ${e.message}`);
        }
      }
    }

    // Processa definizioni
    if (fattiEstratti.definizioni) {
      for (const fatto of fattiEstratti.definizioni) {
        try {
          const idConcetto = this.aggiungiNodo(
            this.tipiNodo.CONCETTO,
            fatto.termine,
            {
              definizione: fatto.spiegazione,
              categoria: fatto.categoria,
              materia,
              argomento,
              confidence: fatto.confidence
            }
          );
          stats.nodiCreati++;
        } catch (e) {
          stats.errori.push(`Errore definizione: ${e.message}`);
        }
      }
    }

    // Processa relazioni
    if (fattiEstratti.relazioni) {
      for (const fatto of fattiEstratti.relazioni) {
        try {
          if (fatto.sottotipo === 'causale') {
            // Crea nodi per causa ed effetto se non esistono
            const idCausa = this.aggiungiNodo(
              this.tipiNodo.EVENTO,
              fatto.causa.substring(0, 80),
              { descrizione: fatto.causa, materia }
            );
            const idEffetto = this.aggiungiNodo(
              this.tipiNodo.EVENTO,
              fatto.effetto.substring(0, 80),
              { descrizione: fatto.effetto, materia }
            );
            
            this.aggiungiRelazione(idCausa, idEffetto, this.tipiRelazione.CAUSO);
            stats.nodiCreati += 2;
            stats.relazioniCreate++;
            
          } else if (fatto.sottotipo === 'influenza') {
            const idSoggetto = this.aggiungiNodo(
              this.tipiNodo.PERSONA,
              fatto.soggetto,
              { materia }
            );
            const idOggetto = this.aggiungiNodo(
              this.tipiNodo.PERSONA,
              fatto.oggetto,
              { materia }
            );
            
            this.aggiungiRelazione(idSoggetto, idOggetto, this.tipiRelazione.INFLUENZO);
            stats.relazioniCreate++;
            
          } else if (fatto.sottotipo === 'appartenenza') {
            const idPersonaggio = this.aggiungiNodo(
              this.tipiNodo.PERSONA,
              fatto.personaggio,
              { materia }
            );
            const idMovimento = this.aggiungiNodo(
              this.tipiNodo.MOVIMENTO,
              fatto.movimento,
              { materia }
            );
            
            this.aggiungiRelazione(idPersonaggio, idMovimento, this.tipiRelazione.APPARTENNE_A);
            stats.relazioniCreate++;
          }
        } catch (e) {
          stats.errori.push(`Errore relazione: ${e.message}`);
        }
      }
    }

    // Processa concetti
    if (fattiEstratti.concetti) {
      for (const fatto of fattiEstratti.concetti) {
        try {
          this.aggiungiNodo(
            this.tipiNodo.MOVIMENTO,
            fatto.nome,
            {
              contesto: fatto.contesto,
              materia,
              argomento,
              confidence: fatto.confidence
            }
          );
          stats.nodiCreati++;
        } catch (e) {
          stats.errori.push(`Errore concetto: ${e.message}`);
        }
      }
    }

    // Calcola importanza dei nodi
    this.calcolaImportanza();

    return stats;
  }

  // ==================== QUERY AVANZATE ====================

  /**
   * 🔍 Trova percorso tra due nodi (BFS)
   */
  trovaPercorso(idInizio, idFine, maxPassi = 5) {
    if (idInizio === idFine) return [idInizio];
    
    const visitati = new Set([idInizio]);
    const coda = [[idInizio]];
    
    while (coda.length > 0) {
      const percorso = coda.shift();
      if (percorso.length > maxPassi) continue;
      
      const ultimo = percorso[percorso.length - 1];
      const collegati = this.getNodiCollegati(ultimo);
      
      for (const { nodo } of collegati) {
        if (nodo.id === idFine) {
          return [...percorso, idFine];
        }
        
        if (!visitati.has(nodo.id)) {
          visitati.add(nodo.id);
          coda.push([...percorso, nodo.id]);
        }
      }
    }
    
    return null; // Nessun percorso trovato
  }

  /**
   * 🔗 Trova nodi correlati (stesso periodo, materia, movimento)
   */
  trovaNodContemporanei(idNodo, raggio = 20) {
    const nodo = this.nodi.get(idNodo);
    if (!nodo) return [];

    const annoRif = nodo.attributi.annoNascita || nodo.attributi.anno;
    if (!annoRif) return [];

    const anno = parseInt(annoRif);
    const contemporanei = [];

    for (const [id, altroNodo] of this.nodi) {
      if (id === idNodo) continue;
      
      const altroAnno = parseInt(
        altroNodo.attributi.annoNascita || altroNodo.attributi.anno
      );
      
      if (altroAnno && Math.abs(altroAnno - anno) <= raggio) {
        contemporanei.push({
          nodo: altroNodo,
          differenzaAnni: altroAnno - anno
        });
      }
    }

    return contemporanei.sort((a, b) => 
      Math.abs(a.differenzaAnni) - Math.abs(b.differenzaAnni)
    );
  }

  /**
   * 📊 Calcola importanza dei nodi (PageRank semplificato)
   */
  calcolaImportanza() {
    // Inizializza importanza
    for (const [id, nodo] of this.nodi) {
      nodo.metadata.importanza = 1;
    }

    // Itera per convergenza
    for (let i = 0; i < 10; i++) {
      const nuovaImportanza = new Map();
      
      for (const [id, nodo] of this.nodi) {
        let importanza = 0.15; // Base
        
        const entranti = this.getRelazioniDiNodo(id, 'entranti');
        for (const rel of entranti) {
          const nodoDa = this.nodi.get(rel.da);
          const uscenti = this.getRelazioniDiNodo(rel.da, 'uscenti').length;
          if (uscenti > 0) {
            importanza += 0.85 * (nodoDa.metadata.importanza / uscenti);
          }
        }
        
        nuovaImportanza.set(id, importanza);
      }
      
      for (const [id, imp] of nuovaImportanza) {
        this.nodi.get(id).metadata.importanza = imp;
      }
    }
  }

  /**
   * 🏆 Ottieni nodi più importanti per tipo
   */
  getNodiPiuImportanti(tipo, limite = 10) {
    const nodiTipo = this.getNodiPerTipo(tipo);
    return nodiTipo
      .sort((a, b) => b.metadata.importanza - a.metadata.importanza)
      .slice(0, limite);
  }

  // ==================== GENERAZIONE DOMANDE ====================

  /**
   * 📝 Genera domande possibili da un nodo
   */
  generaDomandeDaNodo(idNodo) {
    const nodo = this.nodi.get(idNodo);
    if (!nodo) return [];

    const domande = [];
    const relazioni = this.getRelazioniDiNodo(idNodo);

    // Domande basate su attributi del nodo
    if (nodo.tipo === this.tipiNodo.PERSONA) {
      if (nodo.attributi.annoNascita) {
        domande.push({
          tipo: 'data',
          livello: 'conoscenza',
          template: `In che anno nacque ${nodo.nome}?`,
          rispostaCorretta: nodo.attributi.annoNascita,
          nodoRiferimento: idNodo,
          confidence: 0.9
        });
      }
      if (nodo.attributi.annoMorte) {
        domande.push({
          tipo: 'data',
          livello: 'conoscenza',
          template: `In che anno morì ${nodo.nome}?`,
          rispostaCorretta: nodo.attributi.annoMorte,
          nodoRiferimento: idNodo,
          confidence: 0.9
        });
      }
    }

    if (nodo.tipo === this.tipiNodo.OPERA) {
      if (nodo.attributi.anno) {
        domande.push({
          tipo: 'data',
          livello: 'conoscenza',
          template: `In che anno fu pubblicata l'opera "${nodo.nome}"?`,
          rispostaCorretta: nodo.attributi.anno,
          nodoRiferimento: idNodo,
          confidence: 0.85
        });
      }
    }

    if (nodo.tipo === this.tipiNodo.CONCETTO && nodo.attributi.definizione) {
      domande.push({
        tipo: 'definizione',
        livello: 'comprensione',
        template: `Cosa si intende per "${nodo.nome}"?`,
        rispostaCorretta: nodo.attributi.definizione,
        nodoRiferimento: idNodo,
        confidence: 0.8
      });
    }

    // Domande basate su relazioni
    for (const rel of relazioni) {
      const templates = this.templateDomande[rel.tipo];
      if (!templates) continue;

      const altroNodo = this.nodi.get(rel.da === idNodo ? rel.a : rel.da);
      if (!altroNodo) continue;

      for (const template of templates) {
        const domanda = this.compilaTemplateDomanda(
          template,
          nodo,
          altroNodo,
          rel
        );
        if (domanda) {
          domande.push(domanda);
        }
      }
    }

    return domande;
  }

  /**
   * 📋 Inizializza template domande per ogni tipo di relazione
   */
  inizializzaTemplateDomande() {
    return {
      [this.tipiRelazione.SCRISSE]: [
        {
          template: 'Chi scrisse "{opera}"?',
          variabili: { opera: 'a' },
          tipoRisposta: 'persona',
          livello: 'conoscenza'
        },
        {
          template: 'Quale opera fu scritta da {autore}?',
          variabili: { autore: 'da' },
          tipoRisposta: 'opera',
          livello: 'conoscenza'
        }
      ],
      [this.tipiRelazione.NACQUE_A]: [
        {
          template: 'Dove nacque {persona}?',
          variabili: { persona: 'da' },
          tipoRisposta: 'luogo',
          livello: 'conoscenza'
        }
      ],
      [this.tipiRelazione.APPARTENNE_A]: [
        {
          template: 'A quale movimento letterario appartenne {autore}?',
          variabili: { autore: 'da' },
          tipoRisposta: 'movimento',
          livello: 'comprensione'
        },
        {
          template: 'Chi fu esponente del {movimento}?',
          variabili: { movimento: 'a' },
          tipoRisposta: 'persona',
          livello: 'conoscenza'
        }
      ],
      [this.tipiRelazione.INFLUENZO]: [
        {
          template: 'Chi influenzò il pensiero di {autore}?',
          variabili: { autore: 'a' },
          tipoRisposta: 'persona',
          livello: 'analisi'
        },
        {
          template: 'Quale autore fu influenzato da {maestro}?',
          variabili: { maestro: 'da' },
          tipoRisposta: 'persona',
          livello: 'analisi'
        }
      ],
      [this.tipiRelazione.CAUSO]: [
        {
          template: 'Quale fu la conseguenza di {causa}?',
          variabili: { causa: 'da' },
          tipoRisposta: 'evento',
          livello: 'analisi'
        },
        {
          template: 'Cosa causò {effetto}?',
          variabili: { effetto: 'a' },
          tipoRisposta: 'evento',
          livello: 'analisi'
        }
      ]
    };
  }

  /**
   * 📝 Compila un template di domanda con i dati reali
   */
  compilaTemplateDomanda(templateObj, nodoPrincipale, nodoSecondario, relazione) {
    let testo = templateObj.template;
    
    // Sostituisci variabili
    for (const [chiave, direzione] of Object.entries(templateObj.variabili)) {
      const nodo = direzione === 'da' ? nodoPrincipale : nodoSecondario;
      testo = testo.replace(`{${chiave}}`, nodo.nome);
    }

    // Determina risposta corretta
    let rispostaCorretta;
    if (templateObj.tipoRisposta === 'persona' || templateObj.tipoRisposta === 'luogo' ||
        templateObj.tipoRisposta === 'movimento' || templateObj.tipoRisposta === 'opera') {
      rispostaCorretta = nodoSecondario.nome;
    } else {
      rispostaCorretta = nodoSecondario.attributi.descrizione || nodoSecondario.nome;
    }

    return {
      tipo: templateObj.tipoRisposta,
      livello: templateObj.livello,
      template: testo,
      rispostaCorretta,
      nodoRiferimento: nodoPrincipale.id,
      relazioneRiferimento: relazione.id,
      confidence: 0.85
    };
  }

  /**
   * 🎯 Trova distrattori intelligenti usando il grafo
   */
  trovaDistratoriDaGrafo(idNodo, tipoRisposta, numeroDistattori = 3) {
    const nodo = this.nodi.get(idNodo);
    if (!nodo) return [];

    const distrattori = [];
    
    // 1. Prima cerca nodi dello stesso tipo
    const nodiStessoTipo = this.getNodiPerTipo(nodo.tipo)
      .filter(n => n.id !== idNodo);
    
    // 2. Priorità ai contemporanei
    const contemporanei = this.trovaNodContemporanei(idNodo, 30);
    for (const { nodo: nodoCont } of contemporanei) {
      if (nodoCont.tipo === nodo.tipo && distrattori.length < numeroDistattori) {
        distrattori.push({
          valore: nodoCont.nome,
          motivazione: 'contemporaneo',
          confidence: 0.9
        });
      }
    }

    // 3. Poi nodi collegati da relazioni simili
    const collegati = this.getNodiCollegati(idNodo);
    for (const { nodo: nodoColl } of collegati) {
      if (nodoColl.tipo === nodo.tipo && distrattori.length < numeroDistattori) {
        if (!distrattori.some(d => d.valore === nodoColl.nome)) {
          distrattori.push({
            valore: nodoColl.nome,
            motivazione: 'collegato',
            confidence: 0.85
          });
        }
      }
    }

    // 4. Infine altri nodi dello stesso tipo (casuali)
    const shuffled = nodiStessoTipo.sort(() => Math.random() - 0.5);
    for (const altroNodo of shuffled) {
      if (distrattori.length >= numeroDistattori) break;
      if (!distrattori.some(d => d.valore === altroNodo.nome)) {
        distrattori.push({
          valore: altroNodo.nome,
          motivazione: 'stesso_tipo',
          confidence: 0.7
        });
      }
    }

    return distrattori.slice(0, numeroDistattori);
  }

  // ==================== UTILITY ====================

  /**
   * 🔤 Normalizza un nome per confronto
   */
  normalizzaNome(nome) {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // Rimuovi accenti
      .replace(/[^a-z0-9\s]/g, '')       // Solo alfanumerici
      .replace(/\s+/g, '_')              // Spazi -> underscore
      .trim();
  }

  /**
   * 📊 Ottieni statistiche del grafo
   */
  getStatistiche() {
    const stats = {
      totaleNodi: this.nodi.size,
      totaleArchi: this.archi.size,
      nodiPerTipo: {},
      relazioniPerTipo: {},
      nodiPiuConnessi: []
    };

    // Conta nodi per tipo
    for (const [tipo, ids] of this.indicePerTipo) {
      stats.nodiPerTipo[tipo] = ids.size;
    }

    // Conta relazioni per tipo
    for (const [id, arco] of this.archi) {
      stats.relazioniPerTipo[arco.tipo] = (stats.relazioniPerTipo[arco.tipo] || 0) + 1;
    }

    // Top 10 nodi più connessi
    const nodiOrdinati = Array.from(this.nodi.values())
      .sort((a, b) => b.metadata.numeroRelazioni - a.metadata.numeroRelazioni)
      .slice(0, 10);
    
    stats.nodiPiuConnessi = nodiOrdinati.map(n => ({
      nome: n.nome,
      tipo: n.tipo,
      relazioni: n.metadata.numeroRelazioni
    }));

    return stats;
  }

  /**
   * 💾 Esporta il grafo in formato JSON
   */
  esporta() {
    return {
      nodi: Array.from(this.nodi.values()),
      archi: Array.from(this.archi.values()),
      statistiche: this.getStatistiche(),
      esportatoIl: new Date().toISOString()
    };
  }

  /**
   * 📥 Importa un grafo da JSON
   */
  importa(dati) {
    // Reset
    this.nodi.clear();
    this.archi.clear();
    this.indicePerTipo.clear();
    this.indicePerNome.clear();
    this.indiceRelazioni.clear();

    // Importa nodi
    for (const nodo of dati.nodi) {
      this.nodi.set(nodo.id, nodo);
      
      if (!this.indicePerTipo.has(nodo.tipo)) {
        this.indicePerTipo.set(nodo.tipo, new Set());
      }
      this.indicePerTipo.get(nodo.tipo).add(nodo.id);
      this.indicePerNome.set(nodo.nomeNormalizzato, nodo.id);
      this.indiceRelazioni.set(nodo.id, new Set());
    }

    // Importa archi
    for (const arco of dati.archi) {
      this.archi.set(arco.id, arco);
      this.indiceRelazioni.get(arco.da)?.add(arco.id);
      this.indiceRelazioni.get(arco.a)?.add(arco.id);
    }

    // Aggiorna contatori
    this.contatorNodo = Math.max(...Array.from(this.nodi.keys())
      .map(id => parseInt(id.split('_')[1]) || 0));
    this.contatorArco = Math.max(...Array.from(this.archi.keys())
      .map(id => parseInt(id.split('_')[1]) || 0));

    console.log(`📥 Importati ${this.nodi.size} nodi e ${this.archi.size} archi`);
  }
}

module.exports = KnowledgeGraph;
