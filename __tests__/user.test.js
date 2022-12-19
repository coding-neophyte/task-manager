const Mongoose = require('mongoose');
const request = require('supertest');
const User = require('../lib/models/User');
const db = require('../mongoose-setup');
const app = require('../lib/app');

const agent = request.agent(app);

const userData = {
  name: 'fakename',
  username: 'fakeusername',
  email: 'fakeemail@mail.com',
  password: 'fakepassword'
};

Mongoose.set('strictQuery', true);

describe('Testing User Models', () => {
  beforeAll(async() => {
    await db.setUp();
  });
  afterEach(async() => {
    await db.dropCollections();
  });
  afterAll(async () => {
    await db.dropDatabase();
  });

  it('should create and save new user', async () => {
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);

  });

  it('should create new user', async () => {
    const res = await agent.post('/api/auth/signup').send(userData);

    expect(res.body).toEqual({
      _id: expect.any(String),
      name: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: expect.any(Number)
    });
  });

  it('should log in existing user', async () => {
    await agent.post('/api/auth/signup').send(userData);

    const res = await agent.post('/api/auth/login').send({
      email: userData.email,
      password: userData.password
    });
    expect(res.body).toEqual({
      message: 'Signed In Successfully'
    });
  });
});
