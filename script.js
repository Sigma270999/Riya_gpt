addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const BOT_TOKEN = "7696636704:AAGJdIAjJ2SVRas6giwSFlo7dIJUAYdFyg8";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/`;

// Function to handle incoming requests
async function handleRequest(request) {
  if (request.method === "POST") {
    const update = await request.json();

    // Handle "/start" command
    if (update.message && update.message.text === "/start") {
      return sendWelcomeMessage(update.message.chat.id);
    }

    // Handle other messages
    if (update.message && update.message.text) {
      return handleUserMessage(update.message.chat.id, update.message.text);
    }
  }

  return new Response("OK");
}

// Function to send a welcome message with an inline keyboard
async function sendWelcomeMessage(chatId) {
  const photoUrl = "https://iili.io/2kYJYnn.jpg";
  const caption = "Welcome! Send me a message, and I'll process it for you.";
  const replyMarkup = {
    inline_keyboard: [
      [{ text: "Channel", url: "https://t.me/PAYOUTNEXU" }],
      [{ text: "Developer", url: "https://t.me/PAYOUTNEXU" }],
    ],
  };

  const body = {
    chat_id: chatId,
    photo: photoUrl,
    caption: caption,
    reply_markup: replyMarkup,
  };

  return sendTelegramRequest("sendPhoto", body);
}

// Function to process user messages
async function handleUserMessage(chatId, userText) {
  const apiUrl = `https://last-warning.serv00.net/Muskan_gf.php?wife=${encodeURIComponent(userText)}`;

  try {
    const apiResponse = await fetch(apiUrl);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      const replyText = data.response || "No response available";

      return sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: replyText,
      });
    } else {
      return sendTelegramRequest("sendMessage", {
        chat_id: chatId,
        text: "Sorry, I couldn't process your request right now.",
      });
    }
  } catch (error) {
    return sendTelegramRequest("sendMessage", {
      chat_id: chatId,
      text: `An error occurred: ${error.message}`,
    });
  }
}

// Helper function to send requests to Telegram API
async function sendTelegramRequest(method, body) {
  const url = `${TELEGRAM_API}${method}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
        }
