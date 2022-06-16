window.JCode = window.JCode || {};

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
};

JCode.logger = (container, host = _console) => {
  const el = document.createElement('div');
  el.className = 'jcode-logger';
  container.append(el);
  const makeLogger = (type) => {
    return (...args) => {
      host[type](...args);
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
  };
};