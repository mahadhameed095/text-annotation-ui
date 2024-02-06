import request from 'supertest';
import app from './app';

export const client = request(app);