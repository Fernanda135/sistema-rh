import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const variaveisObrigatorias = [
    "PG_USER",
    "PG_HOST",
    "PG_DATABASE",
    "PG_PASSWORD",
    "PG_PORT"
];

variaveisObrigatorias.forEach((nomeVar) => {
    if (!process.env[nomeVar]) {
        console.error("Falta a variável de ambiente obrigatória:", nomeVar);
        process.exit(1);
    }
});

// criar conexões
const db = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});

// conectar com o postgres
// sucesso
db.on("connect", () => console.log("Conectado ao PostgreSQL"));
// erro
db.on("error", (erro) => {
    console.error("Erro no banco de dados:", erro);
    process.exit(1);
});

export const query = (texto, parametros) => db.query(texto, parametros);
