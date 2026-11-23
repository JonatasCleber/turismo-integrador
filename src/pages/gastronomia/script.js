

function filtrar(pedido) {
  document.querySelectorAll('.lugar-card').forEach(lugar => {
    if (pedido === 'todos' || lugar.dataset.tipo === pedido) {
      lugar.style.display = '';
    } else {
      lugar.style.display = 'none';
    }
  });
}
