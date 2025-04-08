document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("sendButton");
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const toggleDarkMode = document.getElementById("toggleDarkMode");
    const body = document.getElementById("body");
    const toggleDot = document.getElementById("toggleDot");

    function addMessage(sender, message) {
        const bubble = document.createElement("div");
        bubble.className = sender === "Usuário"
            ? "self-end bg-blue-100 dark:bg-blue-700 p-2 rounded"
            : "self-start bg-gray-200 dark:bg-gray-600 p-2 rounded";
        bubble.textContent = `${sender}: ${message}`;
        chatBox.appendChild(bubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage("Usuário", message);
        userInput.value = "";

        try {
            const response = await fetch("/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            addMessage("Mentor", data.reply || "Erro ao obter resposta.");
        } catch (err) {
            addMessage("Erro", "Ocorreu um problema ao enviar sua pergunta.");
        }
    }

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    toggleDarkMode.addEventListener("change", () => {
        body.classList.toggle("dark");
        toggleDot.classList.toggle("translate-x-5");
    });
});

