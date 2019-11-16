window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' || window.location.pathname === '/home') {
    Home.initialize();
  }
});

Home = {

  initialize() {
    document.getElementById('random-album').addEventListener('click', Home.clickRandom);
    let albumButtons = document.querySelectorAll('.album');
    for (let i = 0; i < albumButtons.length; i++) {
      albumButtons[i].addEventListener('click', Home.clickAlbum);
    }
  },

  clickRandom() {
    let totalAlbums = document.querySelectorAll('.album').length;
    let selectedId = Math.floor(Math.random() * (totalAlbums)) + 1;
    window.location.pathname = `/play/${selectedId}`;
  },

  clickAlbum(e) {
    let target = e.target;
    if (target.tagName !== 'DIV') {
      target = e.target.parentElement;
    }
    let albumId = target.dataset.id;
    window.location.pathname = `/play/${albumId}`;
  }
}
