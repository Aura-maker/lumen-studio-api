const request = require('supertest');
const app = require('../src/index');
const prisma = require('../src/prisma');

describe('Quiz: creazione e invio (flusso semplificato)', () => {
  const agente = request.agent(app);
  let docenteToken;
  let studenteToken;
  let quizId;

  const docente = { email: 'docente@test.edu', password: 'password', nome: 'Docente T', ruolo: 'DOCENTE' };
  const studente = { email: 'studente@test.edu', password: 'password', nome: 'Studente T', ruolo: 'STUDENTE' };

  beforeAll(async () => {
    await prisma.$connect();
    // pulizie minimali per evitare conflitti
    await prisma.refreshToken.deleteMany().catch(() => {});
    await prisma.progresso.deleteMany().catch(() => {});
    await prisma.domanda.deleteMany().catch(() => {});
    await prisma.quiz.deleteMany().catch(() => {});
    await prisma.argomento.deleteMany().catch(() => {});
    await prisma.materia.deleteMany().catch(() => {});
    await prisma.utente.deleteMany().catch(() => {});
    // crea docente e studente tramite API registrati
    await agente.post('/api/auth/registrati').send(docente).expect(201);
    await agente.post('/api/auth/registrati').send(studente).expect(201);

    // login per ottenere token per docente e studente
    const rDoc = await agente.post('/api/auth/login').send({ email: docente.email, password: docente.password }).expect(200);
    docenteToken = rDoc.body.token;
    const rStu = await agente.post('/api/auth/login').send({ email: studente.email, password: studente.password }).expect(200);
    studenteToken = rStu.body.token;
  });

  afterAll(async () => {
    await prisma.progresso.deleteMany().catch(() => {});
    await prisma.domanda.deleteMany().catch(() => {});
    await prisma.quiz.deleteMany().catch(() => {});
    await prisma.argomento.deleteMany().catch(() => {});
    await prisma.materia.deleteMany().catch(() => {});
    await prisma.utente.deleteMany().catch(() => {});
    await prisma.$disconnect();
  });

  test('Docente crea materia, argomento e quiz con domande', async () => {
    // crea materia
    const mat = await request(app)
      .post('/api/materie')
      .set('Authorization', `Bearer ${docenteToken}`)
      .send({ nome: 'Italiano', descrizione: 'Lingua e letteratura italiana', sezioni: [{ etichetta: '5° anno' }] })
      .expect(201);
    const materiaId = mat.body.materia.id;

    // crea argomento
    const arg = await request(app)
      .post('/api/argomenti')
      .set('Authorization', `Bearer ${docenteToken}`)
      .send({ titolo: 'Letteratura latina', descrizione: 'Tito Livio - Quintiliano', materiaId, da: 'Tito Livio', a: 'Quintiliano' })
      .expect(201);
    const argId = arg.body.argomento.id;

    // crea quiz con 1 domanda multipla e 1 multi-selezione
    const quizPayload = {
      titolo: 'Quiz prova',
      descrizione: 'Quiz di esempio',
      argomentoId: argId,
      tempoLimite: 600,
      pubblico: true,
      domande: [
        { testo: 'Qual è la capitale d\'Italia?', tipo: 'multipla', scelte: [{ testo: 'Roma', isCorrect: true }, { testo: 'Milano', isCorrect: false }], punti: 2 },
        { testo: 'Seleziona le lingue romanze', tipo: 'multi-selezione', scelte: [{ testo: 'Italiano', isCorrect: true }, { testo: 'Inglese', isCorrect: false }, { testo: 'Spagnolo', isCorrect: true }], punti: 3 }
      ]
    };

    const qres = await request(app).post('/api/quiz').set('Authorization', `Bearer ${docenteToken}`).send(quizPayload).expect(201);
    quizId = qres.body.quiz.id;
    expect(qres.body.quiz.domande.length).toBe(2);
  });

  test('Studente invia risposte e riceve valutazione', async () => {
    // trova le domande del quiz
    const q = await request(app).get(`/api/quiz/${quizId}`).set('Authorization', `Bearer ${studenteToken}`).expect(200);
    const domande = q.body.quiz.domande;
    // Prepara risposte: corrette per entrambe
    const risposte = domande.map(d => {
      if (d.tipo === 'multipla') return { domandaId: d.id, risposta: 'Roma' };
      if (d.tipo === 'multi-selezione') return { domandaId: d.id, risposta: ['Italiano', 'Spagnolo'] };
      return { domandaId: d.id, risposta: '' };
    });

    const submit = await request(app)
      .post(`/api/quiz/${quizId}/invia`)
      .set('Authorization', `Bearer ${studenteToken}`)
      .send({ risposte, tempoUsato: 120 })
      .expect(200);

    expect(submit.body).toHaveProperty('progresso');
    expect(submit.body).toHaveProperty('punteggio');
    expect(submit.body.punteggio).toBeGreaterThan(0);
    expect(submit.body.dettagli.length).toBe(domande.length);
  });
});