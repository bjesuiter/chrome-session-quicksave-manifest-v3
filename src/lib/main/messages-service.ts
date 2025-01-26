/**
 * A service to show messages to the user via the popup ui and the badge service.
 */

import { createStore } from "solid-js/store/types/server.js";

type Message = {
  type: "info" | "warning" | "error";
  title?: string;
  message: string;
};

const [userMessages, setUserMessages] = createStore<Message[]>([]);

export function showInfoMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "info", title, message }]);
}

export function showWarningMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "warning", title, message }]);
}

export function showErrorMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "error", title, message }]);
}

export function clearMessages() {
  setUserMessages([]);
}

export function clearMessage(index: number) {
  setUserMessages(index, undefined);
}

export function getMessages() {
  return userMessages;
}
