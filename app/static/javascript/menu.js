window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/') {
    Menu.initialize();
  }
});

Menu = {

  initialize() {
    document.querySelectorAll('[data-url]').forEach((div) => {
      div.addEventListener('click', Menu.clickItem);
    });
  },

  clickItem(e) {
    window.location = e.target.dataset.url;
  }
}
