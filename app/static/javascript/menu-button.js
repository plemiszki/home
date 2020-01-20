window.addEventListener('DOMContentLoaded', () => {
  let { pathname } = window.location;
  if (pathname !== '/' && pathname.slice(0, 6) !== '/admin') {
    MenuButton.initialize();
  }
});

MenuButton = {

  initialize() {
    document.querySelector('.menu-button').addEventListener('click', MenuButton.clickMenuButton);
  },

  clickMenuButton() {
    window.location.pathname = '/';
  }
}
