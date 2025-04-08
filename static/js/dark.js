// Ativa/desativa tema escuro e salva no localStorage
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("darkToggle").checked = isDark;
}

// Carrega tema salvo no localStorage
function loadTheme() {
  const saved = localStorage.getItem("theme");
  const isDark = saved === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  const toggle = document.getElementById("darkToggle");
  if (toggle) toggle.checked = isDark;
}

window.addEventListener("DOMContentLoaded", loadTheme);

// Envia a mensagem para a API
function sendMessage() {
  const message = document.getElementById("messageInput").value.trim();
  const responseDiv = document.getElementById("response");

  if (!message) {
    responseDiv.textContent = "Por favor, digite uma pergunta.";
    return;
  }

  responseDiv.textContent = "Pensando... 💭";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.reply) {
        responseDiv.textContent = data.reply;
      } else {
        responseDiv.textContent = "Erro: " + (data.error || "resposta inválida");
      }
    })
    .catch((err) => {
      responseDiv.textContent = "Erro ao conectar com a API.";
      console.error(err);
    });
}

