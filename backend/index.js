import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import rotas from "./routes/routeFuncionarios.js";

dotenv.config();

const app = express();
const PORTA = 3000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/api/funcionarios", rotas);

app.use((req, res) => {
  res.status(404).json({ erro: "Página não encontrada" });
});

app.use((erro, req, res, next) => {
  const codigoStatus = erro.statusCode || 500;
  const mensagem = erro.message || "Erro interno do servidor";
  res.status(codigoStatus).json({ erro: mensagem });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
