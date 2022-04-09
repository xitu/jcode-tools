// 让页面上内联的JS能够运行
document.body.querySelectorAll('script:not([data-preview])').forEach((el) => {
  const type = el.getAttribute('type');
  if(!type || type === 'module' || type === 'text/javascript') {
    const b = el.nextElementSibling;
    const parent = el.parentElement;

    const code = el.textContent;
    // const script = el.cloneNode(false);
    const script = document.createElement('script');
    script.textContent = code;
    const matched = el.cloneNode(false).outerHTML.match(/<script((?:\s[_\w][_-\w]*="[^"]*")*)>/im);
    if(matched && matched[1]) {
      const kvs = matched[1].trim().split(/\s/);
      kvs.forEach((kv) => {
        const m = kv.match(/^([_\w][_-\w]*)="([^"]*)"$/);
        if(m) {
          script.setAttribute(m[1], m[2] || m[1]);
        }
      });
    }

    if(b) {
      el.remove();
      parent.insertBefore(script, b);
    } else {
      parent.appendChild(script);
    }
  }
});