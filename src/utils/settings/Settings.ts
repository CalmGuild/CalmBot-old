import fs from "fs-extra";
import logger from "../logger/Logger";

export interface ISettings {
  disabled: boolean;
  disabledReason: string | undefined;
}

export const defaultSettings: ISettings = {
  disabled: false,
  disabledReason: undefined,
};

const settingsPath = "./settings.json";

export async function getSettings(): Promise<ISettings> {
  return new Promise((resolve, reject) => {
    fs.readJson(settingsPath)
      .then((settings: any) => {
        resolve(Object.assign(settings, defaultSettings));
      })
      .catch(() => {
        logger.warn("No settings file provided, using default settings!");
        resolve(defaultSettings);
      });
  });
}

export function saveSettings(settings: ISettings) {
  fs.writeJson(settingsPath, settings)
    .then(() => {
      logger.info(`Saved settings ${JSON.stringify(settings)}`);
    })
    .catch((err) => {
      logger.error(`Error saving settings ${JSON.stringify(err)}`);
    });
}
