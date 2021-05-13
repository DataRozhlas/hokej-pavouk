document.getElementsByTagName("article")[0].classList.add("b-data--no-img");
document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("search").tabIndex = "-1";
});
// branding start
var branding = document.createElement("div");
branding.className = "branding";
var brandingHolder = document.createElement("a");
brandingHolder.href = "https://www.irozhlas.cz/sport/ms-hokej/2021";
brandingHolder.className = "branding__holder";
brandingHolder.onclick =
  "ga('gtm1.send', 'event', 'ondemand', 'click' , 'MS hokej 2021  - branding');";
brandingHolder.innerHTML = "Mistrovství světa v hokeji 2021";
branding.appendChild(brandingHolder);
var body = document.getElementsByTagName("body")[0];
body.insertBefore(branding, body.firstChild);
