window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.indexOf('/play/') > -1) {
    Play.initialize();
  }
});

Play = {

  initialize() {
    window.setInterval(Play.checkStatus, 1000);
    let tableRows = document.querySelectorAll('td');
    for (let i = 0; i < tableRows.length; i++) {
      tableRows[i].addEventListener('click', Play.playSong);
    }
  },

  playSong(e) {
    let target = e.target;
    if (!target.classList.contains('playing')) {
      Play.removeHighlight();
      target.classList.add('playing');
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/play_song');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
          console.log(xhr.responseText);
        }
      };
      xhr.send(JSON.stringify({ track: target.dataset.track }));
    }
  },

  checkStatus() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/status');
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        let response = JSON.parse(xhr.response);
        if (response.message === 'next track') {
          let lastTrack = parseInt(document.querySelector('.playing').dataset.track, 10);
          let nextTrack = lastTrack + 1;
          Play.removeHighlight();
          document.querySelectorAll('td')[nextTrack - 1].classList.add('playing');
        } else if (response.message === 'next album') {
          window.location.pathname = `/music/play/${response.albumId}`;
        }
      }
    };
    xhr.send();
  },

  removeHighlight() {
    let tableRows = document.querySelectorAll('td');
    for (let i = 0; i < tableRows.length; i++) {
      tableRows[i].classList.remove('playing');
    }
  }
}
