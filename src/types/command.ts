import { CommandInteraction } from "discord.js";

export type Command = {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: CommandInteraction) => Promise<void>;
};
