const token = localStorage.getItem("token");

function isLoggedIn() {
  return token !== null;
}

function logout() {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "index.html";
}
