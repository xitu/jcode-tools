// src/styles.css
var styles_default = `.jcode-logger pre {
  margin: 0;
  padding: 0;
  padding-left: 1rem;
  overflow-x: scroll;
}

.jcode-logger__warn {
  background-color: #fefbe7;
}

.jcode-logger__error {
  background-color: #fcf1f0;
}

.jcode-logger__warn::before {
  content: "!";
  background: #ecbe41;
  border-top-left-radius: 100%;
  border-top-right-radius: 100%;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  text-align: center;
  color: white;
  position: relative;
  left: -0.5rem;
  transform: scale(0.75);
}

.jcode-logger__error::before {
  content: "x";
  background: #bb2f22;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  text-align: center;
  color: white;
  position: relative;
  left: -0.5rem;
  transform: scale(0.75);
}

table.jcode-logger__table {
  width: 100%;
  border: solid 1px #dfe1e3;
  border-spacing: 0;
  margin: 1.2rem 0;
  display: table!important;
}

.jcode-logger__table tr th {
  font-weight: normal;
  text-align: left;
  background-color: #f1f3f4;
  user-select: none;
}

.jcode-logger__table tr th:hover {
  font-weight: normal;
  text-align: left;
  background-color: #d1d3d4;
}

.jcode-logger__table tr td,
.jcode-logger__table tr th {
  padding: 2px 6px;
}

.jcode-logger__table th {
  border: solid 1px #dfe1e3;
}

.jcode-logger__table td:not(:last-child) {
  border-right: solid 1px #dfe1e3;
}

.jcode-logger__table tr:nth-child(2n) {
  background-color: #f1f3f4;
}

.jcode-logger .null::after {
  content: 'null';
  color: #999;
}

.jcode-logger .undefined::after {
  content: 'undefined';
  color: #999;
}

.jcode-logger .number,
.jcode-logger .boolean {
  color: #16229f;
}

.jcode-logger .string,
.jcode-logger .regexp,
.jcode-logger .symbol {
  color: #bb2f22;
}

.jcode-logger .bigint,
.jcode-logger .array {
  color: #396b2f;
}

.jcode-logger__table td:first-child {
  color: inherit;
}

.jcode-logger__dir {
  list-style-type: none;
  padding: 0;
}

.jcode-logger__dir li {
  margin-left: 1rem;
  font-size: 12px;
}

.jcode-logger__dir em {
  font-style: normal;
  color: #7d237c;
  margin-right: .5rem;
}

.jcode-logger__dir em::after {
  content: ':';
}

.jcode-logger__dir > div:first-child::before,
.jcode-logger__group > div:first-child::before {
  content: ' ';
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 8.67px;
  border-color: transparent;
  border-left-color: currentColor;
  transform: translateX(6px);
}

.jcode-logger__dir {
  margin: 0;
}

.jcode-logger__dir > div ~ li {
  display: none;
}

.jcode-logger__dir > div.expand::before {
  transform: rotate(90deg) translateX(6px);
}

.jcode-logger__dir > div.expand ~ li,
.jcode-logger__group > div.expand ~ * {
  display: block;
}

.jcode-logger__group :not(:first-child) {
  margin-left: 1rem;
}

.jcode-logger__group > div {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.jcode-logger__group > div ~ * {
  display: none;
}`;

// src/inject-esm.js
var headEl = document.head || document.getElementsByTagName("head")[0];
var styleEl = document.createElement("style");
if (styleEl.styleSheet) {
  styleEl.styleSheet.cssText = styles_default;
} else {
  styleEl.appendChild(document.createTextNode(styles_default));
}
headEl.appendChild(styleEl);

// src/get-custom-code.js
var getCustomCode = async () => {
  let el;
  do {
    el = document.querySelector("body>script:last-of-type");
    if (el && /^text\/.*/.test(el.type))
      return el.textContent;
    await new Promise((resolve) => setTimeout(resolve, 50));
  } while (1);
};

// src/codex-client.js
function codeXWS(url) {
  return new Promise((resolve, reject) => {
    try {
      const socket = new WebSocket(url);
      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "init") {
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
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    resolve,
    reject,
    promise
  };
}
var defaultURL = "https://codex.juejin.fun";
var defaultWsURL = "wss://ws.juejin.fun";
var langMap = {
  kotlin: "kt",
  node: "js",
  perl: "pl",
  python: "py",
  golang: "go",
  ruby: "rb",
  rust: "rs",
  csharp: "cs",
  erlang: "erl"
};
var CodeXClient = class {
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
    this.socket.send(JSON.stringify({ type: "stdin", message }));
  }
  async runCode({ code, language, input, timeout = 8 } = {}) {
    if (!code)
      code = await getCustomCode();
    if (language == null) {
      const el = document.querySelector("body>script:last-of-type");
      language = el.type.split("/")[1];
    }
    if (langMap[language])
      language = langMap[language];
    const data = {
      code,
      language,
      input,
      timeout
    };
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      if (!this.socket) {
        this.socket = await codeXWS(this.wsURL);
        this.socket.addEventListener("message", (event) => {
          const data2 = JSON.parse(event.data);
          if (data2.type === "ready") {
            this.socketReady.resolve();
          } else if (data2.type === "stdout") {
            if (this.onmessage)
              this.onmessage(data2.message);
          } else if (data2.type === "stderr") {
            if (this.onerror)
              this.onerror(data2.message);
          }
        });
      }
      if (this.socket)
        data.wsID = this.socket.clientID;
      config.body = JSON.stringify(data);
      const response = await fetch(this.url, config);
      const result = await response.json();
      return result;
    } catch (ex) {
      if (this.socket)
        this.socket.close();
      this.socket = null;
      console.error(ex);
    }
  }
};

// src/logger.js
if (typeof BigInt === "function" && !BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function() {
    return `${this}n`;
  };
}
function setValue(data, key, value, i) {
  data[key] = data[key] || [];
  data[key][i] = value;
}
function createTableData(data) {
  const tableData = {};
  if (data) {
    let i = 0;
    const numbericKeys = Object.keys(data).every((k) => k === Number(k).toString());
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === "function") {
        continue;
      }
      setValue(tableData, "(index)", numbericKeys ? Number(k) : k, i);
      if (v == null || typeof v !== "object" || v instanceof RegExp) {
        setValue(tableData, "Value", v, i);
      } else {
        for (const [_k, _v] of Object.entries(v)) {
          setValue(tableData, _k, _v, i);
        }
      }
      i++;
    }
    return tableData;
  }
  return data;
}
function buildTable(tableData, columns) {
  const len = tableData["(index)"].length;
  if (len) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    table.appendChild(thead);
    table.className = "jcode-logger__table";
    let keys = Object.keys(tableData);
    if (columns) {
      keys = keys.filter((k) => k === "(index)" || k === "Value" || columns.includes(k));
    }
    const tr = document.createElement("tr");
    tr.innerHTML = keys.map((k, i) => `<th data-index="${i}">${k}</th>`).join("");
    thead.appendChild(tr);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = 0; i < len; i++) {
      const row = document.createElement("tr");
      tbody.appendChild(row);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const col = document.createElement("td");
        if (i in tableData[key]) {
          let v = tableData[key][i];
          if (typeof v === "string" && key !== "(index)") {
            v = `'${v}'`;
          }
          if (Array.isArray(v)) {
            if (v.length > 3) {
              col.textContent = `${v.slice(0, 3)}... (total: ${v.length})`;
            }
          } else if (typeof v === "bigint") {
            col.textContent = `${v}n`;
          } else if (typeof v === "symbol") {
            col.textContent = v.toString();
          } else
            col.textContent = v;
          col.className = getName(v).toLowerCase();
        }
        row.appendChild(col);
      }
    }
    return table;
  }
}
function parseMsg(msg) {
  if (Object.prototype.toString.call(msg) === "[object Object]") {
    try {
      return JSON.stringify(msg);
    } catch (ex) {
      return msg.toString();
    }
  }
  return msg;
}
function buildMsg(args) {
  let firstMsg = parseMsg(args[0]);
  let ret = [];
  const placeHolder = /%[cdfios]/;
  let colors = 0;
  for (let i = 1; i < args.length; i++) {
    const currentMsg = parseMsg(args[i]);
    if (placeHolder.test(firstMsg)) {
      firstMsg = firstMsg.replace(placeHolder, (f) => {
        if (f === "%c") {
          const ret2 = `${colors ? "</span>" : ""}<span style="${currentMsg}">`;
          colors++;
          return ret2;
        }
        if (f === "%d" || f === "%i") {
          return parseInt(currentMsg, 10);
        }
        if (f === "%f") {
          return parseFloat(currentMsg);
        }
        if (f === "%s") {
          return currentMsg.toString();
        }
        if (f === "%o") {
          try {
            return JSON.stringify(currentMsg);
          } catch (ex) {
            return currentMsg.toString();
          }
        }
      });
    } else {
      ret.push(...args.slice(i).map(parseMsg));
      break;
    }
  }
  ret = [firstMsg, ...ret];
  if (colors)
    ret.push("</span>");
  return ret;
}
function getName(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
function buildDir(obj, level = 0) {
  const list = document.createElement("ul");
  list.className = "jcode-logger__dir";
  const name = getName(obj);
  const header = document.createElement("div");
  header.textContent = obj instanceof HTMLElement ? obj.tagName.toLowerCase() : name;
  header.addEventListener("click", () => {
    header.classList.toggle("expand");
  });
  list.appendChild(header);
  const kv = [];
  for (const k in obj) {
    if (typeof obj[k] !== "function") {
      kv.push([k, obj[k]]);
    }
  }
  if (Array.isArray(obj)) {
    kv.push(["length", obj.length]);
  }
  kv.sort((a, b) => {
    if (a[0] > b[0])
      return 1;
    if (a[0] < b[0])
      return -1;
    return 0;
  });
  for (let i = 0; i < kv.length; i++) {
    let [k, v] = kv[i];
    if (typeof v === "string") {
      v = `"${v}"`;
    }
    const li = document.createElement("li");
    const key = document.createElement("em");
    key.textContent = k;
    const value = document.createElement("span");
    value.className = getName(v).toLowerCase();
    if (Array.isArray(v) && v.length <= 0) {
      value.textContent = "Array(0)";
    } else if (v instanceof NodeList) {
      value.textContent = `NodeList(${v.length})`;
    } else if (v instanceof HTMLCollection) {
      value.textContent = `HTMLCollection(${v.length})`;
    } else if (v instanceof DOMTokenList) {
      value.textContent = `DOMTokenList(${v.length})`;
    } else if (v instanceof HTMLElement) {
      value.textContent = `${v.tagName.toLowerCase()}${v.id ? `#${v.id}` : ""}`;
    } else {
      value.textContent = v;
    }
    if (level < 2 && v && typeof v === "object" && !(v instanceof Window)) {
      const _list = buildDir(v, level + 1);
      _list.children[0].innerHTML = "";
      _list.children[0].appendChild(key);
      _list.children[0].appendChild(value);
      li.appendChild(_list);
    } else {
      li.appendChild(key);
      li.appendChild(value);
    }
    list.appendChild(li);
  }
  return list;
}
var _console = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  dir: console.dir,
  table: console.table,
  group: console.group,
  groupCollapsed: console.groupCollapsed,
  groupEnd: console.groupEnd,
  count: console.count,
  countReset: console.countReset,
  time: console.time,
  timeEnd: console.timeEnd,
  assert: console.assert,
  clear: console.clear
};
var logger = (container, host = _console) => {
  let el = document.createElement("div");
  el.className = "jcode-logger";
  container.append(el);
  const log = (msg, type = "info") => {
    const log2 = document.createElement("pre");
    log2.className = `jcode-logger__${type}`;
    log2.innerHTML = msg;
    el.appendChild(log2);
  };
  const makeLogger = (type) => {
    return (...args) => {
      if (host)
        host[type](...args);
      args = buildMsg(args);
      const msg = args.map((o) => {
        if (o == null)
          return String(o);
        return o.toString ? o.toString() : Object.prototype.toString.call(o);
      }).join(" ");
      log(msg, type);
    };
  };
  const groupStack = [];
  const group = (name, collapsed = false) => {
    const g = document.createElement("div");
    g.className = "jcode-logger__group";
    el.appendChild(g);
    const header = document.createElement("div");
    header.textContent = name;
    if (!collapsed)
      header.className = "expand";
    g.appendChild(header);
    header.addEventListener("click", () => {
      header.classList.toggle("expand");
    });
    groupStack.push(el);
    el = g;
  };
  const counter = {};
  const timer = {};
  return {
    log: makeLogger("log"),
    info: makeLogger("info"),
    warn: makeLogger("warn"),
    error: makeLogger("error"),
    assert: (cond, ...rest) => {
      if (host)
        host.assert(cond, ...rest);
      if (!cond) {
        const msg = buildMsg(rest).join(" ");
        log(`Assertion failed: ${msg}`, "error");
      }
    },
    clear: () => {
      if (host)
        host.clear();
      if (groupStack.length > 0) {
        el = groupStack[0];
        groupStack.length = 0;
      }
      el.innerHTML = "";
    },
    group: (name) => {
      if (host)
        host.group(name);
      group(name);
    },
    groupCollapsed: (name) => {
      if (host)
        host.groupCollapsed(name);
      group(name, true);
    },
    groupEnd: () => {
      if (host)
        host.groupEnd();
      if (groupStack.length > 0) {
        el = groupStack.pop();
      }
    },
    count: (msg = "default") => {
      if (host)
        host.count(msg);
      msg = msg.toString();
      counter[msg] = counter[msg] || 0;
      counter[msg]++;
      log(`${msg}: ${counter[msg]}`);
    },
    time: (msg = "default") => {
      if (host)
        host.time(msg);
      msg = msg.toString();
      if (!(msg in timer)) {
        timer[msg] = performance.now();
      } else {
        log(`Timer '${msg}' already exists`, "warn");
      }
    },
    countReset: (msg = "default") => {
      if (host)
        host.countReset(msg);
      msg = msg.toString();
      if (msg in counter) {
        delete counter[msg];
      } else {
        log(`Count for '${msg}' does not exist`, "warn");
      }
    },
    timeEnd: (msg = "default") => {
      if (host)
        host.timeEnd(msg);
      msg = msg.toString();
      if (msg in timer) {
        log(`${msg}: ${performance.now() - timer[msg]} ms`);
        delete timer[msg];
      } else {
        log(`Timer '${msg}' does not exist`, "warn");
      }
    },
    dir: (data) => {
      if (host)
        host.dir(data);
      const list = buildDir(data);
      el.appendChild(list);
    },
    table: (data, columns) => {
      if (host)
        host.table(data, columns);
      const d = createTableData(data);
      const table = buildTable(d, columns);
      table.addEventListener("click", (e) => {
        const target = e.target;
        if (target.tagName === "TH") {
          const index = Number(target.dataset.index);
          const rows = [...table.querySelectorAll("tr")].slice(1);
          rows.sort((a, b) => {
            a = a.children[index];
            b = b.children[index];
            let x = a.textContent;
            let y = b.textContent;
            if (a.className === "number") {
              x = Number(x);
            }
            if (b.className === "number") {
              y = Number(y);
            }
            if (a.className === "bigint") {
              x = BigInt(x.slice(0, -1));
            }
            if (b.className === "bigint") {
              y = BigInt(y.slice(0, -1));
            }
            if (x > y)
              return target.dataset.sort === "asc" ? -1 : 1;
            if (x < y)
              return target.dataset.sort === "asc" ? 1 : -1;
            return 0;
          });
          rows.forEach((row) => {
            table.appendChild(row);
          });
          target.dataset.sort = target.dataset.sort === "asc" ? "desc" : "asc";
        }
      });
      el.appendChild(table);
    }
  };
};

// src/storage.js
var kvHost = "https://55aus9vavw.hk.aircode.run/storage";
var Storage = class {
  constructor(bucket = location.href) {
    this.bucket = bucket;
  }
  async get(key) {
    const res = await fetch(`${kvHost}?key=${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Bucket-Id": this.bucket
      }
    });
    const ret = await res.json();
    this.result = ret;
    if (ret.error) {
      return null;
    }
    return ret.result.value;
  }
  async set(key, value) {
    const res = await fetch(kvHost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Bucket-Id": this.bucket
      },
      body: JSON.stringify({ key, value })
    });
    const ret = await res.json();
    this.result = ret;
    return !ret.error;
  }
  async del(key) {
    const res = await fetch(kvHost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Bucket-Id": this.bucket
      },
      body: JSON.stringify({ key })
    });
    const ret = await res.json();
    this.result = ret;
    return !ret.error;
  }
};

// src/index.js
function getBlobURL(jsCode) {
  const blob = new Blob([jsCode], { type: "text/javascript" });
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}
var getURL = async () => {
  const code = await getCustomCode();
  return getBlobURL(code);
};
export {
  CodeXClient,
  Storage,
  getCustomCode,
  getURL,
  logger
};
