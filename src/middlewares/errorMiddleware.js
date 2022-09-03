const errorMiddleware = (err, req, res, _next) => {
    console.log('Error middleware', err.message);
    if (err.status) return res.status(err.status).json({ message: err.message });
  
    return res.status(500).json({ message: 'Erro interno' });
  };
  
module.exports = errorMiddleware;