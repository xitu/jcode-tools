function sleep(ms = 50) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.JCode = window.JCode || {};

JCode.getCustomCode = async () => {
  let el;
  do {
    el = document.querySelector('body>script:last-of-type');
    // eslint-disable-next-line no-await-in-loop
    await sleep();
  } while(!el || !/^text\/.+/.test(el.type));
  return el.textContent;
};
