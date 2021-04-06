import { ISubCommandSettings, PermissionsEnum } from "../../../structures/Interfaces";

const settings: ISubCommandSettings = {
  defaultSubCommand: "add",
  guildOnly: true,
  permissions: PermissionsEnum.STAFF,
};

export default settings;