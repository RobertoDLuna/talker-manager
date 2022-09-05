const authWatched = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;

  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/; 
  
  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  if (!dateFormat.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const authRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

const authTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

module.exports = {
  authTalk,
  authWatched,
  authRate,
};