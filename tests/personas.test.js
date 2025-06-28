import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Test básico de /personas', () => {
  it('GET /personas responde con status 200', async () => {
    const res = await request(app).get('/personas');
    expect(res.statusCode).toBe(200);
  }, 150000);
});