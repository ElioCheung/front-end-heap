const express = require('express');
const spdy = require('spdy');
const path = require('node:path');
const fs = require('node:fs');

const app = express();

const INTERVAL = 2000;

app.use(express.static(path.join(__dirname, 'web')));

app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  let interval = setInterval(() => {
    const data = new Date().toISOString();
    res.write('event: ping\n'); // 事件名称定义格式：`event: <event-name>\`
    res.write('data: ' + data + '\n\n'); // 事件内容定义格式：`data: <event-data>\n\n`
    res.uncork(); // 手动刷新响应的数据缓冲区并将数据发送到客户端
  }, INTERVAL);

  req.client.on('close', () => {
    res.end();
    clearInterval(interval);
    console.log(`Connection closed by client.`);
  });
});

app.disabled('etag');

spdy
  .createServer({
    key: fs.readFileSync(path.join(__dirname, 'pem', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'pem', 'cert.pem')),
  }, app)
  .listen(3000, () => console.log('SSE server started on port 3000'));