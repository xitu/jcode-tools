import './styles.css';

// eslint-disable-next-line no-undef
if(typeof BigInt === 'function' && !BigInt.prototype.toJSON) {
  // eslint-disable-next-line no-undef
  BigInt.prototype.toJSON = function () { return `${this}n` };
}

window.JCode = window.JCode || {};

function setValue(data, key, value, i) {
  data[key] = data[key] || [];
  data[key][i] = value;
}

function createTableData(data) {
  const tableData = {};
  if(data) {
    let i = 0;
    // eslint-disable-next-line no-restricted-syntax
    for(const [k, v] of Object.entries(data)) {
      if(typeof v === 'function') {
        // eslint-disable-next-line no-continue
        continue; // skip
      }
      setValue(tableData, '(index)', k, i);
      if(typeof v !== 'object' || v instanceof RegExp) {
        setValue(tableData, 'Value', v, i);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for(const [_k, _v] of Object.entries(v)) {
          tableData[_k] = tableData[_k] || [];
          tableData[_k][i] = _v;
        }
      }
      i++;
    }
    return tableData;
  }
  return data;
}

function buildTable(tableData, columns) {
  const len = tableData['(index)'].length;
  if(len) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    table.appendChild(thead);
    table.className = 'jcode-logger__table';
    let keys = Object.keys(tableData);
    if(columns) {
      keys = keys.filter(k => k === '(index)'
        || k === 'Value' || columns.includes(k));
    }
    const tr = document.createElement('tr');
    tr.innerHTML = keys.map((k, i) => `<th data-index="${i}">${k}</th>`).join('');
    thead.appendChild(tr);
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for(let i = 0; i < len; i++) {
      const row = document.createElement('tr');
      tbody.appendChild(row);
      for(let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const col = document.createElement('td');
        if(i in tableData[key]) {
          let v = tableData[key][i];
          if(typeof v === 'string' && key !== '(index)') {
            v = `'${v}'`;
          }
          if(Array.isArray(v)) {
            if(v.length > 3) {
              col.innerHTML = `${v.slice(0, 3)}... (total: ${v.length})`;
            }
          } else if(typeof v === 'bigint') {
            col.innerHTML = `${v}n`;
          } else if(typeof v === 'symbol') {
            col.innerHTML = v.toString();
          } else col.innerHTML = v;
          if(key !== '(index)') {
            col.className = Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
          }
        }
        row.appendChild(col);
      }
    }
    return table;
  }
}

JCode.getCustomCode = async () => {
  let el;
  do {
    el = document.querySelector('body>script:last-of-type');
    if(el && /^text\/.*/.test(el.type)) return el.textContent;
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 50));
  } while(1);
};

const _console = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  table: console.table,
};

JCode.logger = (container, host = _console) => {
  const el = document.createElement('div');
  el.className = 'jcode-logger';
  container.append(el);
  const makeLogger = (type) => {
    return (...args) => {
      if(host) host[type](...args);
      const msg = args.join(' ');
      const log = document.createElement('pre');
      log.className = `jcode-logger__${type}`;
      log.textContent = msg;
      el.appendChild(log);
    };
  };
  return {
    log: makeLogger('log'),
    warn: makeLogger('warn'),
    error: makeLogger('error'),
    table: (data, columns) => {
      host.table(data, columns);
      const d = createTableData(data);
      const table = buildTable(d, columns);
      table.addEventListener('click', (e) => {
        const target = e.target;
        if(target.tagName === 'TH') {
          // sort
          const index = Number(target.dataset.index);
          const rows = [...table.querySelectorAll('tr')].slice(1);
          rows.sort((a, b) => {
            const x = a.children[index].textContent;
            const y = b.children[index].textContent;
            if(x > y) return target.dataset.sort === 'asc' ? -1 : 1;
            if(x < y) return target.dataset.sort === 'asc' ? 1 : -1;
            return 0;
          });
          rows.forEach((row) => {
            table.appendChild(row);
          });
          target.dataset.sort = target.dataset.sort === 'asc' ? 'desc' : 'asc';
        }
      });
      el.appendChild(table);
    },
  };
};