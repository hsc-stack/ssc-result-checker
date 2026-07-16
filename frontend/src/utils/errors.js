import { ERROR_TRANSLATIONS } from "../constants";

export function translateError(msg) {
  return ERROR_TRANSLATIONS[msg] || msg;
}
