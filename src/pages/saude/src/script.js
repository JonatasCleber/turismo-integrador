/*
    primeiro chamei uma funçao, a mesma que esta dentro do html: filtrar('clinicaGeral')
    inves de colocar um filtro especifico, botei uma "variavel" chamada pedido
    selecionei a class "lugar-card" que são os lugares e conectei a um forEach
    o .lugar-card vai ter uma variavel chamada "lugar"
    esse forEach é um for loop resumido, a logica vai ser dentro dele
    
    lembrando que a conexão funciona no proprio html o data-tipo
    em que ser igual ao que esta em filtrar()
    EXEMPLO:
        filtrar('clinicaGeral')
        data-tipo="clinicaGeral"
    LOGICA:
        Se o pedido "a variavel no filtro" for igual ao filtro "todos" aparece todos dentro de ' ',
        ou se lugar "lugar-card" for igual a pedido, aparece dentro de ' '
        se nao, nao vai aparecer nada "none"

*/
function filtrar(pedido) {
  document.querySelectorAll('.lugar-card').forEach(lugar => {
    if (pedido === 'todos' || lugar.dataset.tipo === pedido) {
      lugar.style.display = '';
    } else {
      lugar.style.display = 'none';
    }
  });
}