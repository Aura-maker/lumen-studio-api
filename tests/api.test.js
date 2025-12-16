/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧪 API TESTS - JEST + SUPERTEST
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const request = require('supertest');

const BASE_URL = process.env.TEST_URL || 'http://localhost:4000';

describe('🏥 Health Checks', () => {
  test('GET /health should return 200', async () => {
    const res = await request(BASE_URL).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /health/detailed should return system info', async () => {
    const res = await request(BASE_URL).get('/health/detailed');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('checks');
    expect(res.body).toHaveProperty('uptime');
  });

  test('GET /health/ready should check database', async () => {
    const res = await request(BASE_URL).get('/health/ready');
    expect([200, 503]).toContain(res.status);
  });
});

describe('📚 Materie API', () => {
  test('GET /api/materie should return materie list', async () => {
    const res = await request(BASE_URL).get('/api/materie');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/materie/:id/argomenti should return argomenti', async () => {
    const res = await request(BASE_URL).get('/api/materie/italiano/argomenti');
    expect(res.status).toBe(200);
  });
});

describe('📝 Quiz API', () => {
  test('GET /api/quiz-ultimate/veloce should return quiz', async () => {
    const res = await request(BASE_URL).get('/api/quiz-ultimate/veloce?numDomande=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('quiz');
    expect(Array.isArray(res.body.quiz)).toBe(true);
  });

  test('GET /api/quiz-ultimate/veloce with materia filter', async () => {
    const res = await request(BASE_URL).get('/api/quiz-ultimate/veloce?materia=italiano&numDomande=3');
    expect(res.status).toBe(200);
    expect(res.body.quiz.every(q => q.materia === 'italiano')).toBe(true);
  });
});

describe('📚 Flashcard API', () => {
  test('GET /api/flashcards should return flashcards', async () => {
    const res = await request(BASE_URL).get('/api/flashcards');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('flashcards');
  });

  test('GET /api/flashcards with materia filter', async () => {
    const res = await request(BASE_URL).get('/api/flashcards?materia=italiano');
    expect(res.status).toBe(200);
  });
});

describe('🔐 Auth API', () => {
  const testUser = {
    email: `test${Date.now()}@test.com`,
    password: 'TestPassword123!',
    nome: 'Test User'
  };

  test('POST /api/auth/registrati should create user', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/registrati')
      .send(testUser);
    
    // Può essere 201 (creato) o 409 (già esiste)
    expect([201, 409, 400]).toContain(res.status);
  });

  test('POST /api/auth/login with wrong credentials should fail', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' });
    
    expect([401, 400]).toContain(res.status);
  });

  test('GET /api/auth/me without token should fail', async () => {
    const res = await request(BASE_URL).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('📋 Simulazioni API', () => {
  test('GET /api/simulazioni should return simulazioni', async () => {
    const res = await request(BASE_URL).get('/api/simulazioni');
    expect(res.status).toBe(200);
  });
});

describe('🎮 Gamification API', () => {
  test('GET /api/gamification/badge without auth should fail', async () => {
    const res = await request(BASE_URL).get('/api/gamification/badge');
    expect(res.status).toBe(401);
  });
});

describe('⚡ Performance Tests', () => {
  test('API response time should be < 500ms', async () => {
    const start = Date.now();
    await request(BASE_URL).get('/api/materie');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });

  test('Quiz API response time should be < 1000ms', async () => {
    const start = Date.now();
    await request(BASE_URL).get('/api/quiz-ultimate/veloce?numDomande=10');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });
});

describe('🛡️ Security Tests', () => {
  test('Should have security headers', async () => {
    const res = await request(BASE_URL).get('/health');
    // Helmet headers
    expect(res.headers).toHaveProperty('x-content-type-options');
  });

  test('Should reject SQL injection attempts', async () => {
    const res = await request(BASE_URL)
      .get('/api/materie/\'; DROP TABLE users; --');
    expect([400, 404]).toContain(res.status);
  });

  test('Should handle XSS in query params', async () => {
    const res = await request(BASE_URL)
      .get('/api/quiz-ultimate/veloce?materia=<script>alert(1)</script>');
    expect(res.status).not.toBe(500);
  });
});
