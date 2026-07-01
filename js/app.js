const btn = document.getElementById("themeBtn");

btn.onclick = () => {
  document.body.classList.toggle("light");

  btn.innerHTML = document.body.classList.contains("light") ? "☀️" : "🌙";
};
