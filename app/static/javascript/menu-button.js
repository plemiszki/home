window.addEventListener('DOMContentLoaded', () => {
  let { pathname } = window.location;
  if (document.querySelector('.old-menu-button')) {
    MenuButton.initialize();
  }
});

MenuButton = {

  initialize() {
    document.querySelector('.old-menu-button').addEventListener('click', MenuButton.clickMenuButton);
  },

  clickMenuButton() {
    window.location.pathname = '/';
  }
}
