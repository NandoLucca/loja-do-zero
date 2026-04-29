const express = require('express');
const fs = require('fs');
const multer = require('multer'); // 1. Importa o multer
const path = require('path');
const app = express();
const PORT = 3000;

const SENHA_ADMIN = "1234"; // TROCA ESSA SENHA DEPOIS!

// 2. Configuração do Multer: onde salvar e com qual nome
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // Salva dentro de public/uploads
  },
  filename: function (req, file, cb) {
    // Cria nome único: 1714425289123-nome-original.jpg
    // Isso evita sobrescrever se subir 2 imagens com mesmo nome
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let produtos = [];
const ARQUIVO_PRODUTOS = 'produtos.json';

function carregarProdutos() {
  try {
    const data = fs.readFileSync(ARQUIVO_PRODUTOS, 'utf8');
    produtos = JSON.parse(data);
  } catch (err) {
    produtos = [
      { id: 1, nome: "Camiseta Dev Fullstack", preco: 89.90, img: "https://placehold.co/400x400/3B82F6/FFFFFF/png?text=Camiseta" },
      { id: 2, nome: "Caneca Git Commit", preco: 39.90, img: "https://placehold.co/400x400/8B5CF6/FFFFFF/png?text=Caneca" },
      { id: 3, nome: "Mouse Pad Código", preco: 29.90, img: "https://placehold.co/400x400/10B981/FFFFFF/png?text=Mouse+Pad" },
      { id: 4, nome: "Adesivo \"Funciona na minha máquina\"", preco: 5.90, img: "https://placehold.co/400x400/F59E0B/FFFFFF/png?text=Adesivo" }
    ];
    salvarProdutos();
  }
}

function salvarProdutos() {
  fs.writeFileSync(ARQUIVO_PRODUTOS, JSON.stringify(produtos, null, 2));
}

carregarProdutos();

// API que a loja usa
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

// Rota do painel
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

app.post('/admin/login', (req, res) => {
  const { senha } = req.body;
  if (senha === SENHA_ADMIN) res.json({ sucesso: true });
  else res.status(401).json({ erro: 'Senha incorreta' });
});

app.post('/admin/produtos', (req, res) => {
  const { senha } = req.body;
  if (senha!== SENHA_ADMIN) return res.status(401).json({ erro: 'Não autorizado' });
  res.json(produtos);
});

// 3. ROTA DE ADICIONAR MUDOU: upload.single('imagem') processa o arquivo
app.post('/admin/add', upload.single('imagem'), (req, res) => {
  const { senha, nome, preco } = req.body;
  if (senha!== SENHA_ADMIN) return res.status(401).json({ erro: 'Não autorizado' });

  const novoId = produtos.length > 0? Math.max(...produtos.map(p => p.id)) + 1 : 1;

  // 4. Se enviou arquivo, usa o caminho dele. Se não, usa placeholder
  let imgPath = "https://placehold.co/400x400/64748B/FFFFFF/png?text=Produto";
  if (req.file) {
    // req.file.filename = nome que o multer deu pro arquivo
    imgPath = '/uploads/' + req.file.filename;
  }

  const novoProduto = {
    id: novoId,
    nome: nome,
    preco: parseFloat(preco),
    img: imgPath
  };

  produtos.push(novoProduto);
  salvarProdutos();
  res.json({ sucesso: true, produto: novoProduto });
});

app.post('/admin/delete', (req, res) => {
  const { senha, id } = req.body;
  if (senha!== SENHA_ADMIN) return res.status(401).json({ erro: 'Não autorizado' });

  // 5. Deleta a imagem da pasta junto com o produto
  const produto = produtos.find(p => p.id === parseInt(id));
  if (produto && produto.img.startsWith('/uploads/')) {
    try {
      fs.unlinkSync('public' + produto.img);
    } catch (e) { console.log('Erro ao deletar imagem:', e.message); }
  }

  produtos = produtos.filter(p => p.id!== parseInt(id));
  salvarProdutos();
  res.json({ sucesso: true });
});
// EDITAR PRODUTO - COLA ISSO ANTES DO app.listen
app.post('/admin/edit', upload.single('imagem'), (req, res) => {
  const { senha, id, nome, preco } = req.body;
  if (senha!== SENHA_ADMIN) return res.status(401).json({ erro: 'Não autorizado' });

  const index = produtos.findIndex(p => p.id === parseInt(id));
  if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado' });

  // Se enviou uma imagem NOVA, apaga a antiga e salva a nova
  if (req.file) {
    const produtoAntigo = produtos[index];
    // Só apaga se for uma imagem da pasta uploads, não um link externo
    if (produtoAntigo.img.startsWith('/uploads/')) {
      try {
        fs.unlinkSync('public' + produtoAntigo.img);
      } catch (e) {
        console.log('Aviso: Não consegui deletar imagem antiga:', e.message);
      }
    }
    produtos[index].img = '/uploads/' + req.file.filename;
  }

  // Atualiza nome e preço
  produtos[index].nome = nome;
  produtos[index].preco = parseFloat(preco);

  salvarProdutos();
  res.json({ sucesso: true, produto: produtos[index] });
});

a// Exporta o app pra Vercel usar
module.exports = app;