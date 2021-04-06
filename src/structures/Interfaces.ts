import { Message, PermissionResolvable } from "discord.js";
import Client from "./Client";

export type RunCallback = (client: Client, message: Message, args: string[]) => void;
export type Permission = PermissionResolvable | PermissionsEnum;

export interface ICommand {
  settings: ICommandSettings | undefined;
  run: RunCallback;
  category?: string;
  subCommandSettings?: ISubCommandSettings;
  subCommands?: Map<string, ICommand>;
}

export interface ICommandSettings {
  description: string;
  usage: string;
  guildOnly?: boolean;
  permissions?: Permission;
  minimumArgs?: number;
  maximumArgs?: number;
}

export interface ISubCommandSettings {
  defaultSubCommand?: string;
  guildOnly?: boolean;
  minimumArgs?: number;
  maximumArgs?: number;
  permissions?: Permission;
}

export enum PermissionsEnum {
  DEVELOPER,
  ADMIN,
  STAFF,
}
