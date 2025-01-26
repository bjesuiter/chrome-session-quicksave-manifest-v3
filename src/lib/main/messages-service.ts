/**
 * A service to show messages to the user via the popup ui and the badge service.
 */

import { createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import {
  setErrBadge,
  setInfoBadge,
  setOkBadge,
  setWarningBadge,
} from "../chrome-services/badge-service";

type Message = {
  type: "info" | "warning" | "error" | "success";
  title?: string;
  message: string;
};

export const [userMessages, setUserMessages] = createStore<Message[]>([]);

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

export const mostSevereMessageType = createMemo(() => {
  // eslint-disable-next-line solid/reactivity
  const messages = userMessages;

  if (messages.length === 0) {
    return undefined;
  }

  if (messages.some((m) => m.type === "error")) {
    return "error";
  }

  if (messages.some((m) => m.type === "warning")) {
    return "warning";
  }

  if (messages.some((m) => m.type === "info")) {
    return "info";
  }

  if (messages.some((m) => m.type === "success")) {
    return "success";
  }
});

// Show badge depending on the most severe message type
createEffect(() => {
  const type = mostSevereMessageType();
  switch (type) {
    case "error":
      // show error badge
      setErrBadge(0);
      break;
    case "warning":
      // show warning badge
      setWarningBadge(0);
      break;
    case "info":
      // show info badge
      setInfoBadge(0);
      break;
    case "success":
      // show success badge
      setOkBadge(0);
      break;
    default:
      // hide badge
      break;
  }
});
