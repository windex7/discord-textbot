import { REST, Routes } from "discord.js";
import path from "path";
import fs from "fs";
import "dotenv/config"; // Load .env file

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

const commands: any[] = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} does not have a "data" or "execute" property.`
      );
      continue;
    }
  }
}

console.log(commands);
const rest = new REST().setToken(token);
const reloadCommands = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    const data = await rest.put(Routes.applicationCommands(applicationId), {
      body: commands,
    });

    console.log(`Successfully reloaded application (/) commands. `);
  } catch (error) {
    console.error(error);
  }
};
reloadCommands();
