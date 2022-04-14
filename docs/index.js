import data from './data.js';

const sidebarMenu = document.querySelector('.sidebar-menu');
const selectedID = location.hash.slice(2);
let selectedItem = null;

function initDemos(demos, container) {
  demos.forEach((demo) => {
    if(demo.type === 'folder') {
      const el = document.createElement('div');
      el.className = demo.folded ? 'sidebar-menuFolder folded' : 'sidebar-menuFolder';
      const p = document.createElement('p');
      p.className = 'title';
      p.textContent = demo.name;
      el.appendChild(p);
      const c = document.createElement('div');
      c.className = 'content';
      el.appendChild(c);
      container.appendChild(el);
      initDemos(demo.content, c);
    } else {
      const el = document.createElement('div');
      const a = document.createElement('a');
      a.id = `code_${demo.id}`;
      a.href = `#/${demo.id}`;
      a.className = 'sidebar-menuItem';
      a.textContent = demo.name;
      el.appendChild(a);
      container.appendChild(el);
      if(demo.id === selectedID) selectedItem = a;
      if(demo.default && !selectedItem) selectedItem = a;
    }
  });
}

initDemos(data, sidebarMenu);

if(selectedItem) {
  const url = selectedItem.getAttribute('href');
  selectedItem.className = 'sidebar-menuItem active';
  loadCodeFrame(url, false);
}

function loadCodeFrame(url, pushState = true) {
  const src = url.replace(/^#/, '//code.juejin.cn/pen');
  window.frames[0].location.replace(src);
  if(pushState) history.pushState({url}, '', url);
  else history.replaceState({url}, '', url);
}

const container = document.querySelector('main');
document.querySelector('.handler').addEventListener('click', () => {
  container.className = container.className === 'max' ? '' : 'max';
});

const menu = document.querySelector('.sidebar-menu');
menu.addEventListener('click', (evt) => {
  const {target} = evt;
  const activeEl = menu.querySelector('a.sidebar-menuItem.active');

  if(target !== activeEl && /^sidebar-menuItem/.test(target.className)) {
    if(activeEl) activeEl.className = 'sidebar-menuItem';
    target.className = 'sidebar-menuItem active';
    loadCodeFrame(target.getAttribute('href'));
  }

  const parent = target.parentElement;
  if(parent && /^sidebar-menuFolder/.test(parent.className)) {
    parent.className = parent.className === 'sidebar-menuFolder' ? 'sidebar-menuFolder folded' : 'sidebar-menuFolder';
  }

  evt.preventDefault();
});

window.onpopstate = function (e) {
  const items = document.querySelectorAll('.sidebar-menuItem');
  items.forEach((item) => {
    item.className = 'sidebar-menuItem';
    if(item.getAttribute('href') === e.state.url) {
      item.className = 'sidebar-menuItem active';
    }
  });
};