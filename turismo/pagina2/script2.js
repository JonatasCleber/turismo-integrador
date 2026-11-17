function abrirFotos() {
  document.getElementById("telaFotos").style.display = "block";
}
function fecharFotos() {
  document.getElementById("telaFotos").style.display = "none";
}
var salvo = false;
function salvar() {
  var coracao = document.getElementById("coracao");
  if (salvo == false) {
    coracao.style.fill = "#e31c5f";
    coracao.style.stroke = "#e31c5f";
    salvo = true;
  } else {
    coracao.style.fill = "none";
    coracao.style.stroke = "currentColor";
    salvo = false;
  }
}
