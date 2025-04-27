const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Erro: Apenas imagens (JPEG, JPG, PNG, GIF) são permitidas!');
    }
  },
});

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Rota para upload de imagens
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Rota para download de imagens
app.get('/api/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Arquivo não encontrado.' });
  }
});

// Rota para gerar um link temporário
app.post('/api/generate-link', (req, res) => {
  const { imageData } = req.body; // Recebe a imagem em base64
  if (!imageData) {
    return res.status(400).json({ error: 'Nenhum dado de imagem fornecido.' });
  }

  // Gera um ID único para o link
  const linkId = Date.now().toString(36);
  // Armazena a imagem temporariamente (em memória ou banco de dados)
  temporaryImageStorage[linkId] = imageData;

  // Retorna o link temporário
  res.json({ url: `http://localhost:${PORT}/api/image/${linkId}` });
});

// Rota para acessar a imagem temporária
app.get('/api/image/:linkId', (req, res) => {
  const { linkId } = req.params;
  const imageData = temporaryImageStorage[linkId];
  if (!imageData) {
    return res.status(404).json({ error: 'Link expirado ou inválido.' });
  }

  // Retorna a imagem
  res.setHeader('Content-Type', 'image/png'); // Ajuste o tipo conforme necessário
  res.send(Buffer.from(imageData.split(',')[1], 'base64'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});