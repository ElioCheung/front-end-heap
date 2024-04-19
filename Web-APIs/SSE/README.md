# SSE(Server-sent events) 服务端发送事件

> SSE 基于 HTTP/2 服务器推送的特性，实现服务端主动向客户端推送资源，从而减少了客户端向服务端发起请求的次数，提高页面的加载速度。 [详情参照MDN Server-sent events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events)

## 浏览器

Web API原生提供 EventSource 构造函数，用于从指定的URL接收服务器事件。

### 实例化
```
const sse = new EventSource(url);
```

### 实例化方法

close：关闭连接

### 事件

- error: 连接失败时触发
- open: 与服务端成功建立连接时触发
- [event]： 从服务端接收到数据时触发，事件名由服务端可自定义

监听事件的方式
```
// 方式一
sse.onerror = () => {};

// 方式二
sse.addEventListener('error', () => {});
```

## 服务端

服务端实现SSE推送：

- 开启HTTP/2服务：协议规定，使用HTTP/2时，必须开启TLS；
  ```
  // 本地临时证书生成命令
  openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
  ```

- 设置响应头
  ```
  // express demo
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', 
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  ```

- 向客户端推送数据
  ```
  // express demo
  const data = new Date().toISOString();
  res.write('event: ping\n'); // 事件名称定义格式：`event: <event-name>\`
  res.write('data: ' + data + '\n\n'); // 事件内容定义格式：`data: <event-data>\n\n`
  res.uncork(); // 手动刷新响应的数据缓冲区并将数据发送到客户端
  ```

- 监听客户端关闭事件，释放资源
  ```
  req.client.on('close', () => {
    res.end();
  });
  ```
