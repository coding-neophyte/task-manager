const Mongoose = require('mongoose');
const request = require('supertest');
const Task = require('../lib/models/Task');
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

describe('Testing Task Route and Model', () => {
  beforeAll(async() => {
    await db.setUp();
  });
  afterEach(async() => {
    await db.dropCollections();
  });
  afterAll(async() => {
    await db.dropDatabase();
  });

  it('should create and save a new task', async () => {
    const newTask = new Task({
      title: 'Cook Dinner',
      description: 'baked salmon and asparagus',
      userId: expect.any(String),
      completed: false


    });
    const savedTask = await newTask.save();

    expect(savedTask.id).toBeDefined();
    expect(savedTask.title).toBe(newTask.title);
    expect(savedTask.description).toBe(newTask.description);
    expect(savedTask.userId).toBeDefined();
    expect(savedTask.completed).toBe(false);
  });

  it('should let auth users add a task', async () => {
    const user = await agent.post('/api/auth/signup').send(userData);
    await agent.post('/api/auth/login').send({
      email: user._body.email,
      password: userData.password
    });

    const res = await agent.post('/api/task').send({
      title: 'Cook Dinner',
      description: 'baked salmon and asparagus',
      userId: expect.any(String),
      completed: false
    });

    expect(res.body.title).toBe('Cook Dinner');
    expect(res.body.description).toBe('baked salmon and asparagus');
    expect(res.body.userId).toBe(user._body._id);
    expect(res.body.completed).toBe(false);
  });
});
