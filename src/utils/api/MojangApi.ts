import axios from "axios";
import logger from "../logger/Logger";

const MOJANG_API_URL = "https://api.mojang.com";

export default {
  getUUID(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${MOJANG_API_URL}/users/profiles/minecraft/${name}`)
        .then((response) => {
          resolve(response.data?.id);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  },
};
