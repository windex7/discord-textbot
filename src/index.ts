import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import path from "path";
import fs from "fs";
import "dotenv/config"; // Load .env file

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_BOT_TOKEN;
const applicationId = process.env.DISCORD_BOT_APPLICATION_ID;

if (!token) {
  console.log("Please provide a valid token in the .env file.");
  process.exit(1);
}
if (!applicationId) {
  console.log("Please provide a valid application ID in the .env file.");
  process.exit(1);
}

export const commands = new Collection<string, any>();
const folderPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(path.join(folderPath, folder))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(folderPath, folder, file));
    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
      console.log(`Command ${file} loaded.`);
    } else {
      console.log(`Command ${file} does not have a data / execute property.`);
      continue;
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  for (const [, command] of commands) {
    client.application?.commands.create(command.data.toJSON());
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(`Received interaction ${interaction}`);
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);

  if (!commands.has(commandName) || !command) {
    console.log(`Command ${commandName} not found in commands.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
