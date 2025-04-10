"use strict";
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { set } = require("lodash");

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

class DiscordLogger {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channelId = DISCORD_CHANNEL_ID;

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
      // You can send a test message here to ensure it runs after the client is ready
      this.sendToMessage("Bot is now online!");
    });

    this.client.login(DISCORD_TOKEN).catch((error) => {
      console.error("Failed to login:", error);
    });
  }

  async sendToMessage(message = "Hello!") {
    // Ensure client is ready before trying to send
    if (!this.client.isReady()) {
      console.error("Client not ready yet, message not sent");
      return;
    }

    try {
      // const channel = await this.client.channels.fetch(this.channelId);
      const channel = this.client.channels.cache.get(this.channelId);
      if (!channel) {
        console.error("Channel not found", this.channelId);
        return;
      }
      await channel.send(message);
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

// Create the logger instance
const loggerService = new DiscordLogger();

setInterval(() => {
  loggerService.sendToMessage("Hello from the logger!");
}, 10000);

// Wait for the client to be ready before sending messages
// Instead of sending immediately, you could expose this as a function
// that can be called when needed

module.exports = loggerService;
