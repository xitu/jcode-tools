export const getCustomCode = async () => {
  let el;
  do {
    el = document.querySelector('body>script:last-of-type');
    if(el && /^text\/.*/.test(el.type)) return el.textContent;
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 50));
  } while(1);
};
