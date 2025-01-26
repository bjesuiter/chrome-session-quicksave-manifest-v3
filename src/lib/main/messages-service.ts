/**
 * A service to show messages to the user via the popup ui and the badge service.
 */

import { createStore } from "solid-js/store";

type Message = {
  type: "info" | "warning" | "error" | "success";
  title?: string;
  message: string;
};

const [userMessages, setUserMessages] = createStore<Message[]>([]);

export function getMessages() {
  return userMessages;
}

export function clearMessages() {
  setUserMessages([]);
}

export function clearMessage(index: number) {
  setUserMessages(index, undefined);
}

export function showInfoMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "info", title, message }]);
}

export function showWarningMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "warning", title, message }]);
}

export function showErrorMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "error", title, message }]);
}

export function showSuccessMessage(message: string, title?: string) {
  setUserMessages([...userMessages, { type: "success", title, message }]);
}

// Example Messages
showInfoMessage("Info", "Welcome");
showWarningMessage("Warning", "Welcome");
showErrorMessage("Error", "Welcome");
showSuccessMessage("Success", "Welcome");
