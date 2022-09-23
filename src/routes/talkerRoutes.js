const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const authAge = require('../middlewares/authAge');
const authName = require('../middlewares/authName');
const { authWatched, authRate, authTalk } = require('../middlewares/authTalk');

const talker = express.Router();

const readTalkers = async () => {
  const path = '../talker.json';
  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    console.log('contentFile');
    return JSON.parse(contentFile);
  } catch (error) {
    return [];
  }
};
const searchById = async (id) => {
  const allTalkers = await readTalkers();
  return allTalkers.filter((elem) => elem.id === id);
};

const postTalker = async (newPeople) => {
  const path = '../talker.json';
  await fs.writeFile(join(__dirname, path), JSON.stringify(newPeople));
};

talker.get('/search', authMiddleware, async (req, res) => {
  const { q } = req.query;
  const people = await readTalkers();

  if (!q) {
    return res.status(200).json(people);
  }

  const filteredPeople = people.filter((person) => person.name.includes(q));

  return res.status(200).json(filteredPeople);
});

talker.get('/', async (_req, res, next) => {
  try {
    const result = await readTalkers();
    return res.status(200).json(result);
  } catch (err) {
    console.log('error -> router get all talkers');
    next(err);
  }
});

talker.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await searchById(Number(id));
    if (result.length > 0) return res.status(200).json(...result);
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (error) {
    console.log('error');
    next(error);
  }
});

talker.post('/', authMiddleware, authName, authAge, authTalk, authWatched, authRate, 
  async (req, res) => {
  const person = req.body;
  const people = await readTalkers();
  const newPerson = { ...person, id: people.length + 1 };
  people.push(newPerson);
  await postTalker(people);
  return res.status(201).json(newPerson);
});

talker.put('/:id', authMiddleware, authName, authAge, authTalk, authWatched, authRate, 
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const people = await readTalkers();
  const peopleUpdated = { name, age, talk, id: Number(id) };

  for (let i = 0; i < people.length; i += 1) {
    if (people[i].id === Number(id)) {
      people[i].name = name;
      people[i].age = age;
      people[i].talk = talk;
    }
  }

  console.log(people);
  await postTalker(people);
  return res.status(200).json(peopleUpdated);
});

talker.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const people = await readTalkers();
  const newPeople = people.filter((person) => person.id !== Number(id));

  await postTalker(newPeople);
  return res.status(204).end();
});

module.exports = talker;