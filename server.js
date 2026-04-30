const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const produtos = [
  {
    id: 1,
    nome: "JBL, Fone de Ouvido Bluetooth, Tune 520BT, On-ear, Sem Fio - Azul",
    preco: 209.90,
    imagem: "https://m.media-amazon.com/images/I/51ouXTgynpL._AC_SL1500_.jpg",
    linkAfiliado: "https://amzn.to/4cIUvBz",
    categoria: "Acessórios"
  },
  {
    id: 2,
    nome: "Echo Dot (Geração mais recente) | Smart speaker com Alexa, som vibrante e potente, Wi-Fi e Bluetooth | Cor Branca",
    preco: 359.01,
    imagem: "https://m.media-amazon.com/images/I/61aCuWauwBL._AC_SL1000_.jpg",
    linkAfiliado: "https://amzn.to/4ejqOIy",
    categoria: "Casa Inteligente"
  },
  {
    id: 3,
    nome: "Smartphone Samsung Galaxy A15 4G 128GB - Azul Claro",
    preco: 1033.80,
    imagem: "https://m.media-amazon.com/images/I/51ANPzwsJOL._AC_SL1080_.jpg",
    linkAfiliado: "https://amzn.to/42q1vNP",
    categoria: "Smartphones"
  },
  {
    id: 4,
    nome: "I2GO, Carregador Portátil (Power Bank) Ultra Rápido 20000mAh, Power Delivery 20W, 2 Saídas USB + 1 Saída/Entrada USB-C, Preto, i2GO PRO",
    preco: 169.90,
    imagem: "https://m.media-amazon.com/images/I/51sXTXpIA1S._AC_SL1000_.jpg",
    linkAfiliado: "https://amzn.to/42DG8bD",
    categoria: "Acessórios"
  },
  {
    id: 5,
    nome: "Samsung Smart TV 43\" FHD F6000F 2025",
    preco: 1629.00,
    imagem: "https://m.media-amazon.com/images/I/71n1lF2hSbL._AC_SL1500_.jpg",
    linkAfiliado: "https://amzn.to/4n4mQFV",
    categoria: "Casa Inteligente"
  },
  {
    id: 6,
    nome: "Caixa de Som Bluetooth JBL Flip 6 30W Preta",
    preco: 729.99,
    imagem: "https://m.media-amazon.com/images/I/61pVu6ootbL._AC_SL1500_.jpg",
    linkAfiliado: "https://amzn.to/425dY9m",
    categoria: "Acessórios"
  }
];

app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.listen(PORT, () => {
  console.log(`TechProEletro rodando na porta ${PORT}`);
});