// ============================================================
// SERVIDOR DO PORTAL MANDACARÚ
// Express (cria as rotas) + SQLite (banco de dados em um arquivo)
// Para ligar: no terminal, dentro da pasta "server", rode:  node server.js
// ============================================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const PORTA = 3000;
const PASTA_PROJETO = path.join(__dirname, ".."); // turismo-integrador/


// ============================================================
// 1) BANCO DE DADOS
// ============================================================

// Abre o arquivo banco.db (se não existir, ele é criado)
const db = new Database(path.join(__dirname, "banco.db"));

// Roda o schema.sql: cria a tabela "usuarios" se ainda não existir
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

// Comandos SQL prontos para reutilizar (o "?" é preenchido depois, o que evita SQL injection)
const buscarPorEmail = db.prepare("SELECT * FROM usuarios WHERE email = ?");
const buscarPorNome = db.prepare("SELECT id FROM usuarios WHERE nome_usuario = ?");
const inserirUsuario = db.prepare(
    "INSERT INTO usuarios (email, senha_hash, nome_usuario, data_nascimento) VALUES (?, ?, ?, ?)"
);
const atualizarSenha = db.prepare("UPDATE usuarios SET senha_hash = ? WHERE email = ?");


// ============================================================
// 2) FUNÇÕES AUXILIARES
// ============================================================

// Garante que o valor recebido é um texto (se não for, vira texto vazio)
function texto(valor) {
    return typeof valor === "string" ? valor : "";
}

// O email precisa ter @ e ponto, e não pode ter espaço
function emailValido(email) {
    return email.includes("@") && email.includes(".") && !email.includes(" ");
}

// Transforma a senha em um "hash" (um embaralhado que não volta ao original).
// O "sal" é um texto aleatório que deixa cada hash diferente, mesmo com senhas iguais.
function gerarHash(senha) {
    const sal = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(senha, sal, 64).toString("hex");
    return sal + ":" + hash;
}

// Confere se a senha digitada bate com o hash salvo no banco
function senhaConfere(senha, salvo) {
    const partes = salvo.split(":");
    const sal = partes[0];
    const hashSalvo = Buffer.from(partes[1], "hex");
    const hashTentativa = crypto.scryptSync(senha, sal, 64);

    return crypto.timingSafeEqual(hashSalvo, hashTentativa);
}

// Confere dia, mês e ano. Devolve a lista dos campos com erro (vazia = tudo certo)
function validarData(dia, mes, ano) {
    const erros = [];
    const anoAtual = new Date().getFullYear();

    if (!Number.isInteger(dia) || dia < 1 || dia > 31) erros.push("dia");
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) erros.push("mes");
    if (!Number.isInteger(ano) || ano < 1900 || ano > anoAtual) erros.push("ano");

    // Se os três existem, confere se a data é real (ex: 31 de fevereiro não existe)
    if (erros.length === 0) {
        const ultimoDiaDoMes = new Date(ano, mes, 0).getDate();

        if (dia > ultimoDiaDoMes) {
            erros.push("dia", "mes");
        }
    }

    return erros;
}


// ============================================================
// 3) CONFIGURAÇÃO DO SERVIDOR
// ============================================================
const app = express();

app.use(cors());         // deixa o site (mesmo em outra porta, como o Live Server) falar com o servidor
app.use(express.json()); // entende os dados que o site manda em formato JSON

// Entrega as páginas do site. Só "src" e "public" ficam abertas:
// assim ninguém consegue baixar o arquivo banco.db pelo navegador.
app.use("/src", express.static(path.join(PASTA_PROJETO, "src")));
app.use("/public", express.static(path.join(PASTA_PROJETO, "public")));

// Se abrir só http://localhost:3000, vai para a página inicial
app.get("/", function (req, res) {
    res.redirect("/src/pages/bem-estar/Bem_estar.html");
});


// ============================================================
// 4) ROTAS
//    Quando dá erro, o servidor responde { ok: false, erros: [...campos errados] }
//    e o site pinta de vermelho a borda de cada campo da lista.
// ============================================================

// ----- CADASTRO -----
app.post("/api/cadastro", function (req, res) {
    const corpo = req.body || {};

    const email = texto(corpo.email).trim().toLowerCase();
    const senha = texto(corpo.senha);
    const nomeUsuario = texto(corpo.nomeUsuario).trim();
    const dia = Number(corpo.dia);
    const mes = Number(corpo.mes);
    const ano = Number(corpo.ano);

    const erros = [];

    // Email inválido ou que já tem conta
    if (!emailValido(email) || buscarPorEmail.get(email)) {
        erros.push("email");
    }

    // Senha com menos de 6 caracteres
    if (senha.length < 6) {
        erros.push("senha");
    }

    // Nome de usuário com menos de 3 letras ou que já existe
    if (nomeUsuario.length < 3 || buscarPorNome.get(nomeUsuario)) {
        erros.push("nomeUsuario");
    }

    // Data de nascimento
    erros.push(...validarData(dia, mes, ano));

    if (erros.length > 0) {
        return res.status(400).json({ ok: false, erros: erros });
    }

    const dataNascimento =
        ano + "-" + String(mes).padStart(2, "0") + "-" + String(dia).padStart(2, "0");

    try {
        inserirUsuario.run(email, gerarHash(senha), nomeUsuario, dataNascimento);
    } catch (erro) {
        // Caso raro: outro cadastro igual entrou no mesmo instante
        if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(400).json({ ok: false, erros: ["email", "nomeUsuario"] });
        }
        throw erro;
    }

    res.json({ ok: true });
});


// ----- LOGIN -----
app.post("/api/login", function (req, res) {
    const corpo = req.body || {};

    const email = texto(corpo.email).trim().toLowerCase();
    const senha = texto(corpo.senha);

    const usuario = buscarPorEmail.get(email);
    const erros = [];

    // Email vazio ou não cadastrado
    if (!usuario) {
        erros.push("email");
    }

    // Senha vazia ou diferente da cadastrada
    if (senha === "" || (usuario && !senhaConfere(senha, usuario.senha_hash))) {
        erros.push("senha");
    }

    if (erros.length > 0) {
        return res.status(401).json({ ok: false, erros: erros });
    }

    res.json({ ok: true, nomeUsuario: usuario.nome_usuario });
});


// ----- ESQUECI A SENHA -----
app.post("/api/trocar-senha", function (req, res) {
    const corpo = req.body || {};

    const email = texto(corpo.email).trim().toLowerCase();
    const novaSenha = texto(corpo.novaSenha);
    const confirmarSenha = texto(corpo.confirmarSenha);

    const erros = [];

    // Email vazio ou que não tem conta
    if (!buscarPorEmail.get(email)) {
        erros.push("email");
    }

    // Nova senha com menos de 6 caracteres
    if (novaSenha.length < 6) {
        erros.push("novaSenha");
    }

    // Confirmação vazia ou diferente da nova senha
    if (confirmarSenha === "" || confirmarSenha !== novaSenha) {
        erros.push("confirmarSenha");
    }

    if (erros.length > 0) {
        return res.status(400).json({ ok: false, erros: erros });
    }

    atualizarSenha.run(gerarHash(novaSenha), email);

    res.json({ ok: true });
});


// ----- Qualquer erro inesperado cai aqui -----
app.use(function (erro, req, res, next) {
    console.error(erro);
    res.status(erro.status || 500).json({ ok: false, erros: [] });
});


// ============================================================
// 5) LIGAR O SERVIDOR
// ============================================================
app.listen(PORTA, function () {
    console.log("Servidor rodando em http://localhost:" + PORTA);
    console.log("Abra o site em: http://localhost:" + PORTA + "/src/pages/bem-estar/Bem_estar.html");
});
