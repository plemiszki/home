window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.slice(0, 6) === '/music' && window.location.pathname.indexOf('/play/') === -1) {
    AlbumSelect.initialize();
  }
});

AlbumSelect = {

  initialize() {
    document.getElementById('random-album').addEventListener('click', AlbumSelect.clickRandom);
    let albumButtons = document.querySelectorAll('.album');
    for (let i = 0; i < albumButtons.length; i++) {
      albumButtons[i].addEventListener('click', AlbumSelect.clickAlbum);
    }
  },

  clickRandom() {
    let albumIds = [];
    let albumButtons = document.querySelectorAll('.album');
    for (let i = 0; i < albumButtons.length; i++) {
      albumIds.push(albumButtons[i].dataset.id);
    }
    let randomId = albumIds[Math.floor(Math.random() * albumIds.length)];
    window.location.pathname = `/play/${randomId}`;
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
