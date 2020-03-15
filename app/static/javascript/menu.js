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
    Menu.getTemp();
    window.setInterval(Menu.getTemp, 3000);
  },

  clickItem(e) {
    window.location = e.target.dataset.url;
  },

  getTemp() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/indoor_temp');
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        let response = JSON.parse(xhr.response);
        document.querySelector('.temperature-container').classList.remove('hidden');
        document.getElementById('temp-c').innerHTML = response.tempC;
        document.getElementById('temp-f').innerHTML = response.tempF;
      }
    };
    xhr.send();
  }
}
