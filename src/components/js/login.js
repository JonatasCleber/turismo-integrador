
const formulario = document.querySelector(".login-form");

formulario.addEventListener("submit", function(verificar) {

    verificar.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Digite um e-mail válido!");
        return;
    }

    alert("Login realizado com sucesso!");

    console.log("E-mail:", email);

});