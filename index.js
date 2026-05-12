import express from 'express';

const app = express();

const PORT = 3000;

// rota principal
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Yearbook API está no ar! 🎓'
  });
});

// desafio do aluno
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date()
  });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

export default app;