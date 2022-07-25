import {getCustomCode} from './get-custom-code';

function codeXWS(url) {
  return new Promise((resolve, reject) => {
    try {
      const socket = new WebSocket(url);
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if(data.type === 'init') {
          socket.clientID = data.message;
        }
        resolve(socket);
      });
    } catch (ex) {
      reject(ex.message);
    }
  });
}

function defer() {
  let resolve,
    reject;
  // eslint-disable-next-line promise/param-names
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    resolve,
    reject,
    promise,
  };
}

const defaultURL = 'https://codex.juejin.fun';
const defaultWsURL = 'wss://ws.juejin.fun';

export class CodeXClient {
  constructor(url = defaultURL, wsURL = defaultWsURL) {
    this.url = url;
    this.wsURL = wsURL;
    this.socket = null;
    this.onmessage = null;
    this.onerror = null;
    this.socketReady = defer();
  }

  async input(message) {
    await this.socketReady.promise;
    this.socket.send(JSON.stringify({type: 'stdin', message}));
  }

  async runCode({code, language, input, timeout = 8} = {}) {
    if(!code) code = await getCustomCode();
    if(language == null) {
      const el = document.querySelector('body>script:last-of-type');
      language = el.type.split('/')[1];
    }
    if(language === 'node') language = 'js';
    if(language === 'perl') language = 'pl';
    if(language === 'python') language = 'py';
    if(language === 'golang') language = 'go';
    if(language === 'ruby') language = 'rb';
    if(language === 'rust') language = 'rs';
    if(language === 'csharp') language = 'cs';
    if(language === 'erlang') language = 'erl';
    const data = {
      code,
      language,
      input,
      timeout,
    };
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      if(!this.socket) {
        this.socket = await codeXWS(this.wsURL);
        this.socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          if(data.type === 'ready') {
            this.socketReady.resolve();
          } else if(data.type === 'stdout') {
            if(this.onmessage) this.onmessage(data.message);
            // console.log('Message from server ', event.data);
          } else if(data.type === 'stderr') {
            if(this.onerror) this.onerror(data.message);
          }
        });
      }
      if(this.socket) data.wsID = this.socket.clientID;
      config.body = JSON.stringify(data);
      const response = await fetch(this.url, config);
      const result = await response.json();
      return result;
    } catch (ex) {
      if(this.socket) this.socket.close();
      this.socket = null;
      console.error(ex);
    }
  }
}