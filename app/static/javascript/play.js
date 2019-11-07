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
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', '/api/status');
    // xhr.onload = () => {
    //   if (xhr.readyState === xhr.DONE) {
    //     console.log(xhr.responseText);
    //   }
    // };
    // xhr.send();
  },

  removeHighlight() {
    let tableRows = document.querySelectorAll('td');
    for (let i = 0; i < tableRows.length; i++) {
      tableRows[i].classList.remove('playing');
    }
  }
}
