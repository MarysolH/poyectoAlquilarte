import request from 'supertest';
import app from '../app.js';

describe('Test ruta /ping', () => {
  it('GET /ping responde con status 200 y mensaje pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, mensaje: 'pong' });
  });
});