const express = require('express');
const path = require('path');
const app = express();

// Produtos fixos
const produtos = [
    { id: 1, nome: "Camiseta Estampada", preco: "49.90", img: "https://placehold.co/600x400/000000/FFFFFF?text=Camiseta" },
    { id: 2, nome: "Caneca Personalizada", preco: "29.90", img: "https://placehold.co/600x400/000000/FFFFFF?text=Caneca" },
    { id: 3, nome: "Boné Trucker", preco: "39.90", img: "https://placehold.co/600x400/000000/FFFFFF?text=Boné" },
    { id: 4, nome: "Moletom Canguru", preco: "99.90", img: "https://placehold.co/600x400/000000/FFFFFF?text=Moletom" }
];

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/produtos', (req, res) => {
    res.json(produtos);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/admin/login', (req, res) => {
    const { senha } = req.body;
    if (senha === '1234') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Senha incorreta' });
    }
});

module.exports = app;