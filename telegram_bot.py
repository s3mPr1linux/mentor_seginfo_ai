import os
import logging
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters
from dotenv import load_dotenv

load_dotenv()

API_URL = "http://127.0.0.1:5000/"  # ou o IP local, se for outro dispositivo
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

logging.basicConfig(level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Olá! Sou seu mentor de Segurança da Informação. Me envie sua dúvida!")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_msg = update.message.text
    try:
        response = requests.post(API_URL, json={"message": user_msg})
        result = response.json()
        await update.message.reply_text(result.get("reply", "Erro na resposta da API."))
    except Exception as e:
        await update.message.reply_text(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Bot do Telegram rodando...")
    app.run_polling()

