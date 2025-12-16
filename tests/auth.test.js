const request = require('supertest');
const app = require('../src/index'); // express app
const prisma = require('../src/prisma');

describe('Auth: flusso registrazione / login / refresh / me', () => {
  const agente = request.agent(app); // mantiene cookie tra richieste

  const testUser = {
    email: 'test-studente@example.com',
    password: 'password123',
    nome: 'Studente Test',
    ruolo: 'STUDENTE'
  };

  // Pulizia DB prima di iniziare
  beforeAll(async () => {
    // assicurati che prisma sia connesso
    await prisma.$connect();
    // Rimuovi dati (ordine per foreign keys)
    await prisma.refreshToken.deleteMany().catch(() => {});
    await prisma.progresso.deleteMany().catch(() => {});
    await prisma.domanda.deleteMany().catch(() => {});
    await prisma.quiz.deleteMany().catch(() => {});
    await prisma.argomento.deleteMany().catch(() => {});
    await prisma.sezioneAnno.deleteMany().catch(() => {});
    await prisma.materia.deleteMany().catch(() => {});
    await prisma.distintivoUtente.deleteMany().catch(() => {});
    await prisma.distintivo.deleteMany().catch(() => {});
    await prisma.notifica.deleteMany().catch(() => {});
    await prisma.utente.deleteMany().catch(() => {});
  });

  afterAll(async () => {
    // pulizia finale
    await prisma.refreshToken.deleteMany().catch(() => {});
    await prisma.utente.deleteMany().catch(() => {});
    await prisma.$disconnect();
  });

  test('POST /api/auth/registrati crea utente e setta refresh cookie', async () => {
    const res = await agente
      .post('/api/auth/registrati')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('utente');
    // supertest agent salva i cookie internamente; verifichiamo che è stato impostato
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const hasRefresh = cookies.some(c => c.includes('refreshToken='));
    expect(hasRefresh).toBe(true);
  });

  test('POST /api/auth/login ritorna token e cookie refresh', async () => {
    const res = await agente
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.utente.email).toBe(testUser.email);
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(c => c.includes('refreshToken='))).toBe(true);
  });

  test('POST /api/auth/refresh usa cookie per ottenere nuovo access token', async () => {
    // l'agente mantiene cookie dai passi precedenti
    const res = await agente.post('/api/auth/refresh').expect(200);
    expect(res.body).toHaveProperty('token');
  });

  test('GET /api/auth/me con Authorization ritorna profilo', async () => {
    // otteniamo un token nuovo
    const login = await agente.post('/api/auth/login').send({ email: testUser.email, password: testUser.password }).expect(200);
    const token = login.body.token;
    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body).toHaveProperty('utente');
    expect(me.body.utente.email).toBe(testUser.email);
  });

  test('POST /api/auth/logout revoca refresh token e cancella cookie', async () => {
    // Chiamiamo logout: l'agente ha cookie attivi
    const res = await agente.post('/api/auth/logout').expect(200);
    expect(res.body).toEqual({ ok: true });
    // Possiamo provare a chiamare refresh di nuovo: dovrebbe restituire 401
    const res2 = await agente.post('/api/auth/refresh');
    expect(res2.status).toBe(401);
  });
});