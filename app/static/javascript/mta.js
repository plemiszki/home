window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.indexOf('/mta') > -1) {
    Mta.initialize();
  }
});

Mta = {

  initialize() {
    window.setTimeout(() => {
      window.location.reload();
    }, 60 * 1000);
  }
}
