function createSSE(url, type, cb) {
  const sse = new EventSource(url);
  sse.addEventListener(type, (event) => {
    if (event.data) {
      cb(event.data);
    }
  });

  sse.addEventListener('error', () => {
    console.log(`[EventSource Error]: EventSource failed.`);
  });

  sse.addEventListener('open', () => {
    console.log('[EventSource]: EventSource opened.');
  });

  return sse;
}

function init() {
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const list = document.getElementById('list');

  let sse = null;

  start.addEventListener('click', () => {
    sse = createSSE('/events', 'ping', (data) => {
      list.innerHTML += `<li>${data}</li>`;
    });
  });

  stop.addEventListener('click', () => {
    if (!sse) return;
    sse.close();
    sse = null;
  });
}

init();