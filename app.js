const Aceito = 'Aceito';
const Preparando = 'Preparando';
const Transporte = 'Em Transporte';

const status = {
  Aceito,
  Preparando,
  Transporte,
};

const pedidos = {
  45800: Object.values(status)[0],
  45799: Object.values(status)[1],
  45798: Object.values(status)[2],
};

addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/status/')) {
    const pedidoId = url.pathname.split('/').pop();
    if (pedidos[pedidoId]) {
      event.respondWith(
        new Response(JSON.stringify({ pedidoId, status: pedidos[pedidoId] }), {
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else {
      event.respondWith(
        new Response(JSON.stringify({ mensagem: 'Pedido não encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
  } else if (url.pathname === '/atualizar-status' && request.method === 'POST') {
    const pedidoId = url.searchParams.get('pedido');
    const novoStatus = url.searchParams.get('status');

    if (!pedidoId || !pedidos[pedidoId]) {
      event.respondWith(
        new Response(JSON.stringify({ erro: 'Pedido não encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else if (!novoStatus) {
      event.respondWith(
        new Response(JSON.stringify({ erro: 'Bad Request - Informe o novo Status' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else if (!status[novoStatus]) {
      event.respondWith(
        new Response(JSON.stringify({ erro: 'Bad Request - Informe um Status Válido' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else {
      event.respondWith(
        new Response(
          JSON.stringify({
            mensagem: `Atualização de status '${status[novoStatus]}' enviada com sucesso para o pedido '${pedidoId}'`,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );
    }
  } else {
    event.respondWith(
      new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      })
    );
  }
});