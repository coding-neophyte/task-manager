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
  it('should get single task by id', async () => {
    const user = await agent.post('/api/auth/signup').send(userData);
    const newTask = await agent.post('/api/task').send({
      title: 'Study',
      description: 'study dsa for two hours',
      userId: user._body._id
    });


    const res = await agent.get(`/api/task/${newTask._body._id}`);

    expect(res.body._id).toBe(newTask._body._id);
    expect(res.body.title).toBe(newTask._body.title);
    expect(res.body.description).toBe(newTask._body.description);
    expect(res.body.userId).toEqual(user._body._id);
    expect(res.body.completed).toBe(false);

  });

  it('should return list of user task', async () => {
    const user = await agent.post('/api/auth/signup').send(userData);


    const task1 = {
      title: 'clean house',
      description: 'clean up for afterwork',
      userId: user._body._id
    };

    const task2 = {
      title: 'clean car',
      description: 'take car to car wash',
      userId: user._body._id
    };

    await agent.post('/api/task').send(task1);
    await agent.post('/api/task').send(task2);

    const res = await agent.get('/api/task');

    expect(res.body).toHaveLength(2);
  });

  it('should allow user to update task', async () => {
    const user = await agent.post('/api/auth/signup').send(userData);
    const task1 = {
      title: 'clean house',
      description: 'clean up for afterwork',
      userId: user._body._id
    };

    const newTask = await agent.post('/api/task').send(task1);

    const res = await agent.put(`/api/task/${newTask._body._id}`).send({
      completed: true

    });

    expect(res.body.completed).toBe(true);

  });

  it('should allow user to delete a task', async () => {
    const user = await agent.post('/api/auth/post').send(userData);
    const task2 = {
      title: 'clean car',
      description: 'take car to car wash',
      userId: user._body._id
    };

    const newTask = await agent.post('/api/task').send(task2);

    const res = await agent.delete(`/api/task/${newTask._body._id}`);

    expect(res.body).toEqual({});
  });
});
