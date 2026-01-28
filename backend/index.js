import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import rotas from "./routes/rotas.js";

dotenv.config();

const app = express();
const PORTA = 3000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/api/funcionarios", rotas);

// tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: "Página não encontrada" });
});

// erros nas rotas
app.use((erro, req, res, next) => {
  const codigoStatus = erro.statusCode || 500;
  const mensagem = erro.message || "Erro interno do servidor";
  res.status(codigoStatus).json({ erro: mensagem });
});

// iniciar servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
