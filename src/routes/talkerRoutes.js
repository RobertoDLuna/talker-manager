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

const postTalker = async (newPeople) => {
  const path = '../talker.json';
  await fs.writeFile(join(__dirname, path), JSON.stringify(newPeople));
};

const searchById = async (id) => {
  const allTalkers = await readTalkers();
  return allTalkers.filter((elem) => elem.id === id);
};

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
  console.log(people);
  console.log({ ...person, id: people.length + 1 });
  people.push({ ...person, id: people.length + 1 });
  console.log(people);
  await postTalker(people);
  return res.status(201).json({ ...person, id: people.length });
});

module.exports = talker;