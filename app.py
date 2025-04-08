from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import logging
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

# Logging
logging.basicConfig(level=logging.INFO)

# Rota principal (HTML)
@app.route("/")
def index():
    return render_template("index.html")

# Rota da API para perguntas
@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    user_message = data.get("message")

    app.logger.info(f"Mensagem recebida: {user_message}")

    if not user_message:
        return jsonify({"error": "Mensagem não fornecida"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # ou "gpt-4" se disponível
            messages=[
                {"role": "system", "content": "Você é um mentor de Segurança da Informação, experiente e acessível. Ajude iniciantes com dicas, exemplos e clareza."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message["content"]
        return jsonify({"reply": reply})

    except Exception as e:
        app.logger.error(f"Erro ao chamar OpenAI: {str(e)}")
        return jsonify({"error": f"Erro: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

