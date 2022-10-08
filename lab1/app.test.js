const app = require('./server');
const supertest = require('supertest');
const request = supertest(app);

it('gets hello world message', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello World');
});

it('gets new message using dotenv', async () => {
    const response = await request.get('/new');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hi all!');
});
