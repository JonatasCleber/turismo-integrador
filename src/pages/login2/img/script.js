// ============================================================
// 1) CONFIGURAÇÃO
//    Endereço do servidor (backend) que salva no banco de dados.
//    Troque pelo endereço do seu servidor.
// ============================================================
const urlServidor = "http://localhost:3000";


// ============================================================
// 2) FUNÇÃO QUE ENVIA OS DADOS PARA O SERVIDOR
//    caminho = a rota do servidor (ex: "/login")
//    dados = o que vai ser enviado (email, senha...)
//    Devolve true se o servidor aceitou e false se deu erro.
// ============================================================
async function enviarDados(caminho, dados) {
    try {
        const resposta = await fetch(urlServidor + caminho, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // JSON.stringify transforma os dados em texto para o envio
            body: JSON.stringify(dados)
        });

        // resposta.ok é true quando o servidor respondeu com sucesso
        return resposta.ok;
    } catch (erro) {
        // Cai aqui se o servidor estiver desligado ou sem internet
        console.log(erro);
        return false;
    }
}


// ============================================================
// 3) PÁGINA LOGIN (login.html)
// ============================================================
const campoEmailLogin = document.querySelector("input.login0");
const campoSenhaLogin = document.getElementById("senha");
const botaoEntrar = document.querySelector(".Entrar0");

// Só roda se o botão existir (ou seja, se estiver na página de login)
if (botaoEntrar) {
    botaoEntrar.addEventListener("click", async function () {

        // value pega o que foi digitado; trim() tira espaços do começo e do fim
        const email = campoEmailLogin.value.trim();
        const senha = campoSenhaLogin.value;

        // Se algum campo estiver vazio, avisa e para por aqui
        if (email === "" || senha === "") {
            alert("Preencha o email e a senha.");
            return;
        }

        const deuCerto = await enviarDados("/login", { email: email, senha: senha });

        if (deuCerto) {
            alert("Login feito com sucesso!");
        } else {
            alert("Não foi possível entrar. Confira o email e a senha.");
        }
    });
}


// ============================================================
// 4) PÁGINA ESQUECI A SENHA (novasenha.html)
// ============================================================
const campoEmailRecuperar = document.getElementById("emailj");
const botaoEnviarLink = document.querySelector(".Entrarj");

if (botaoEnviarLink) {
    botaoEnviarLink.addEventListener("click", async function () {

        const email = campoEmailRecuperar.value.trim();

        // Um email válido precisa ter o @
        if (email === "" || !email.includes("@")) {
            alert("Digite um email válido.");
            return;
        }

        const deuCerto = await enviarDados("/novasenha", { email: email });

        if (deuCerto) {
            alert("Link de recuperação enviado para o seu email.");
        } else {
            alert("Não foi possível enviar o link. Tente novamente.");
        }
    });
}


// ============================================================
// 5) PÁGINA CADASTRO (cadastro.html)
// ============================================================
const campoEmailCadastro = document.querySelector(".login");
const campoSenhaCadastro = document.querySelector(".senha");
const campoNomeUsuario = document.querySelector(".nomedeusuario");
const botaoCriarConta = document.querySelector(".loginEntra");

if (botaoCriarConta) {

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
            document.querySelector(".data").textContent = diaEscolhido;

            // Fecha o menu depois de escolher
            document.querySelector(".menudodia").removeAttribute("open");
        });
    });

    // --- Mês ---
    // posicao é o número do item na lista (começa em 0)
    itensMes.forEach(function (item, posicao) {
        item.addEventListener("click", function () {
            // Janeiro é posição 0, então somamos 1 para ficar 1 a 12
            mesEscolhido = posicao + 1;

            document.querySelector(".btn-mes").textContent = item.textContent;
            document.querySelector(".menudomes").removeAttribute("open");
        });
    });

    // --- Ano ---
    itensAno.forEach(function (item) {
        item.addEventListener("click", function () {
            anoEscolhido = item.textContent;

            document.querySelector(".ano").textContent = anoEscolhido;
            document.querySelector(".menuano").removeAttribute("open");
        });
    });

    // --- Botão Criar conta ---
    botaoCriarConta.addEventListener("click", async function () {

        const email = campoEmailCadastro.value.trim();
        const senha = campoSenhaCadastro.value;
        const nomeUsuario = campoNomeUsuario.value.trim();

        // Testes simples, um de cada vez
        if (email === "" || !email.includes("@")) {
            alert("Digite um email válido.");
            return;
        }

        if (senha.length < 6) {
            alert("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }

        if (nomeUsuario.length < 3) {
            alert("O nome de usuário precisa ter pelo menos 3 letras.");
            return;
        }

        if (diaEscolhido === "" || mesEscolhido === "" || anoEscolhido === "") {
            alert("Escolha o dia, o mês e o ano do seu nascimento.");
            return;
        }

        // Junta tudo em um objeto para enviar ao banco de dados
        const dadosCadastro = {
            email: email,
            senha: senha,
            nomeUsuario: nomeUsuario,
            dia: diaEscolhido,
            mes: mesEscolhido,
            ano: anoEscolhido
        };

        const deuCerto = await enviarDados("/cadastro", dadosCadastro);

        if (deuCerto) {
            alert("Conta criada com sucesso!");
        } else {
            alert("Não foi possível criar a conta. Tente novamente.");
        }
    });
}
