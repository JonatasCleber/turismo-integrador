// ============================================================
// 1) FALAR COM O SERVIDOR
//    O banco de dados agora fica no servidor (SQLite), e não mais
//    no localStorage. Aqui fica a função que conversa com ele.
// ============================================================

// Endereço do servidor (o mesmo que você liga no terminal com "node server.js")
const API = "http://localhost:3000/api";

// Manda os dados para o servidor e devolve a resposta dele.
// Se o servidor estiver desligado, avisa a pessoa e devolve null.
async function chamarApi(rota, dados) {
    try {
        const resposta = await fetch(API + rota, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        return await resposta.json();
    } catch (erro) {
        alert("Não foi possível conectar ao servidor. Ele está ligado? (node server.js)");
        return null;
    }
}


// ============================================================
// 2) FUNÇÕES DAS BORDAS
// ============================================================

// Deixa a borda do campo vermelha (erro)
function bordaVermelha(campo) {
    campo.style.border = "1px solid oklch(61.647% 0.25062 29.013)";
}

// Deixa a borda do campo verde (deu certo)
function bordaVerde(campo) {
    campo.style.border = "1px solid green";
}

// Tira a cor e volta para a borda normal do CSS
function tirarBorda(campo) {
    campo.style.border = "";
}

// Quando a pessoa digita de novo no campo, a borda volta ao normal
function limparAoDigitar(campo) {
    campo.addEventListener("input", function () {
        tirarBorda(campo);
    });
}

// O servidor devolve uma lista com o nome dos campos errados (ex: ["email", "senha"]).
// Esta função pinta de vermelho a borda de cada um deles.
// "campos" liga o nome que o servidor usa ao campo da página.
function pintarErros(erros, campos) {
    (erros || []).forEach(function (nome) {
        if (campos[nome]) {
            bordaVermelha(campos[nome]);
        }
    });
}


// ============================================================
// 3) SAIR DA CONTA
// ============================================================
function sair() {
    // Apaga quem estava logado e recarrega a página (volta para o estado "sem login")
    localStorage.removeItem("usuarioLogado");
    window.location.reload();
}


// ============================================================
// 4) PÁGINA INICIAL (Bem_estar.html)
// ============================================================
// Espera a página terminar de carregar para procurar os links
window.addEventListener("load", function () {

    // O link "Seu Perfil" e o botão "Entrar" do menu
    const linkPerfil = document.querySelector(".account a");
    const botaoEntrarMenu = document.querySelector(".btnEntrar");

    // Pega o nome de quem fez login
    const nomeLogado = localStorage.getItem("usuarioLogado");

    // Se tem alguém logado, mostra o nome e transforma "Entrar" em "Sair"
    if (nomeLogado !== null) {

        // Só troca se o link existir na página
        if (linkPerfil) {
            linkPerfil.textContent = "Olá, " + nomeLogado;
        }

        if (botaoEntrarMenu) {
            botaoEntrarMenu.textContent = "Sair";
            botaoEntrarMenu.setAttribute("href", "#");

            botaoEntrarMenu.addEventListener("click", function (evento) {
                // Impede o link de navegar; quem manda agora é a função sair()
                evento.preventDefault();
                sair();
            });
        }
    }
});


// ============================================================
// 5) PÁGINA LOGIN (login.html)
// ============================================================
const campoEmailLogin = document.querySelector("input.login0");
const campoSenhaLogin = document.getElementById("senha");
const botaoEntrar = document.querySelector(".Entrar0");

if (botaoEntrar) {

    limparAoDigitar(campoEmailLogin);
    limparAoDigitar(campoSenhaLogin);

    botaoEntrar.addEventListener("click", async function () {

        // Começa sem nenhuma borda vermelha
        tirarBorda(campoEmailLogin);
        tirarBorda(campoSenhaLogin);

        // value pega o que foi digitado; trim() tira espaços do começo e do fim
        // toLowerCase() deixa tudo em minúsculo para não errar por causa de letra maiúscula
        const email = campoEmailLogin.value.trim().toLowerCase();
        const senha = campoSenhaLogin.value;

        // Pergunta ao servidor se o email e a senha estão certos
        const resposta = await chamarApi("/login", { email: email, senha: senha });

        // null = servidor desligado (o aviso já foi mostrado)
        if (resposta === null) {
            return;
        }

        // Se teve erro, pinta os campos errados e para por aqui
        if (!resposta.ok) {
            pintarErros(resposta.erros, {
                email: campoEmailLogin,
                senha: campoSenhaLogin
            });
            return;
        }

        // Guarda quem entrou e vai para a página Bem_estar
        localStorage.setItem("usuarioLogado", resposta.nomeUsuario);
        window.location.href = "../bem-estar/Bem_estar.html";
    });
}


// ============================================================
// 6) PÁGINA ESQUECI A SENHA (novasenha.html)
// ============================================================
const campoEmailRecuperar = document.getElementById("emailj");
const campoNovaSenha = document.getElementById("senhanovaj");
const campoConfirmarSenha = document.getElementById("confirmarsenhaj");
const botaoTrocarSenha = document.querySelector(".Entrarj");

if (botaoTrocarSenha) {

    limparAoDigitar(campoEmailRecuperar);
    limparAoDigitar(campoNovaSenha);
    limparAoDigitar(campoConfirmarSenha);

    botaoTrocarSenha.addEventListener("click", async function () {

        // Começa sem nenhuma borda colorida
        tirarBorda(campoEmailRecuperar);
        tirarBorda(campoNovaSenha);
        tirarBorda(campoConfirmarSenha);

        const resposta = await chamarApi("/trocar-senha", {
            email: campoEmailRecuperar.value.trim().toLowerCase(),
            novaSenha: campoNovaSenha.value,
            confirmarSenha: campoConfirmarSenha.value
        });

        if (resposta === null) {
            return;
        }

        if (!resposta.ok) {
            pintarErros(resposta.erros, {
                email: campoEmailRecuperar,
                novaSenha: campoNovaSenha,
                confirmarSenha: campoConfirmarSenha
            });
            return;
        }

        // Deu certo: os três campos ficam com a borda verde
        bordaVerde(campoEmailRecuperar);
        bordaVerde(campoNovaSenha);
        bordaVerde(campoConfirmarSenha);
    });
}


// ============================================================
// 7) PÁGINA CADASTRO (cadastro.html)
// ============================================================
const campoEmailCadastro = document.querySelector(".login");
const campoSenhaCadastro = document.querySelector(".senha");
const campoNomeUsuario = document.querySelector(".nomedeusuario");
const botaoCriarConta = document.querySelector(".loginEntra");

if (botaoCriarConta) {

    // Os três botões que mostram Dia, Mês e Ano
    const resumoDia = document.querySelector(".data");
    const resumoMes = document.querySelector(".btn-mes");
    const resumoAno = document.querySelector(".ano");

    limparAoDigitar(campoEmailCadastro);
    limparAoDigitar(campoSenhaCadastro);
    limparAoDigitar(campoNomeUsuario);

    // Variáveis que guardam a data escolhida (começam vazias)
    let diaEscolhido = "";
    let mesEscolhido = "";
    let anoEscolhido = "";

    // Pega todos os itens de cada menu
    const itensDia = document.querySelectorAll(".dia");
    const itensMes = document.querySelectorAll(".mes");
    const itensAno = document.querySelectorAll(".item-ano");

    // --- Dia ---
    // forEach repete o código para cada dia da lista
    itensDia.forEach(function (item) {
        item.addEventListener("click", function () {
            diaEscolhido = item.textContent;

            // Mostra o dia escolhido no lugar da palavra "Dia"
            resumoDia.textContent = diaEscolhido;

            // Tira a borda vermelha do dia e do mês (a data pode ter ficado certa agora)
            tirarBorda(resumoDia);
            tirarBorda(resumoMes);

            // Fecha o menu depois de escolher
            document.querySelector(".menudodia").removeAttribute("open");
        });
    });

    // --- Mês ---
    // posicao é o número do item na lista (começa em 0)
    itensMes.forEach(function (item, posicao) {
        item.addEventListener("click", function () {
            // Janeiro é posição 0, então somamos 1 para ficar de 1 a 12
            mesEscolhido = posicao + 1;

            resumoMes.textContent = item.textContent;

            tirarBorda(resumoDia);
            tirarBorda(resumoMes);

            document.querySelector(".menudomes").removeAttribute("open");
        });
    });

    // --- Ano ---
    itensAno.forEach(function (item) {
        item.addEventListener("click", function () {
            anoEscolhido = item.textContent;

            resumoAno.textContent = anoEscolhido;

            tirarBorda(resumoAno);

            document.querySelector(".menuano").removeAttribute("open");
        });
    });

    // --- Botão Criar conta ---
    botaoCriarConta.addEventListener("click", async function () {

        // Começa sem nenhuma borda vermelha
        tirarBorda(campoEmailCadastro);
        tirarBorda(campoSenhaCadastro);
        tirarBorda(campoNomeUsuario);
        tirarBorda(resumoDia);
        tirarBorda(resumoMes);
        tirarBorda(resumoAno);

        // Manda tudo para o servidor. Ele confere os dados (email repetido,
        // senha curta, data que não existe...) e salva no banco se estiver tudo certo.
        const resposta = await chamarApi("/cadastro", {
            email: campoEmailCadastro.value.trim().toLowerCase(),
            senha: campoSenhaCadastro.value,
            nomeUsuario: campoNomeUsuario.value.trim(),
            dia: diaEscolhido,
            mes: mesEscolhido,
            ano: anoEscolhido
        });

        if (resposta === null) {
            return;
        }

        // Se teve erro, pinta os campos errados e para por aqui
        if (!resposta.ok) {
            pintarErros(resposta.erros, {
                email: campoEmailCadastro,
                senha: campoSenhaCadastro,
                nomeUsuario: campoNomeUsuario,
                dia: resumoDia,
                mes: resumoMes,
                ano: resumoAno
            });
            return;
        }

        // Conta criada: vai para a página de login (está na mesma pasta)
        window.location.href = "login.html";
    });
}
