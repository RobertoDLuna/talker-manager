const express = require('express');
const fs = require('fs').promises;
const { join } = require('path');

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

talker.get('/', async (_req, res, next) => {
  try {
    const result = await readTalkers();
    return res.status(200).json(result);
  } catch (err) {
    console.log('error -> router get all talkers');
    next(err);
  }
});

module.exports = talker;