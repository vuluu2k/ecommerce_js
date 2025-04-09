"use strict";
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "ping") {
    message.reply("pong");
  }

  if (message.content === "hello") {
    message.reply("Xin chào người anh em bạn cần gì?");
  }
});

const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);
