/**
 * A service to show messages to the user via the popup ui and the badge service.
 */

import { makePersisted } from "@solid-primitives/storage";
import { createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import {
  clearBadge,
  setErrBadge,
  setInfoBadge,
  setOkBadge,
  setWarningBadge,
} from "../chrome-services/badge-service";
import { ChromeLocalStorageAdapterForSolidStore } from "../chrome-services/chrome-local-storage-adapter-for-solid-store";
import { ChromeExtensionLocalStorageSync } from "../persistent-storage/sync-via-chrome-local-storage";

type Message = {
  type: "info" | "warning" | "error" | "success";
  // auto-generated unique id for each message
  id: string;
  cancelable?: boolean;
  title?: string;
  timeout?: number;
  message: string;
};

export const [userMessages, setUserMessages] = makePersisted(
  // eslint-disable-next-line solid/reactivity
  createStore<Message[]>([]),
  {
    // used to sync messages between popup html and background service worker
    name: "userMessages",
    storage: ChromeLocalStorageAdapterForSolidStore(),
    sync: ChromeExtensionLocalStorageSync,
  },
);

export function clearMessages() {
  setUserMessages([]);
}

export function clearMessage(index: number) {
  setUserMessages((messages) => messages.filter((_, i) => i !== index));
}

export function clearMessageById(id: string) {
  setUserMessages((messages) => messages.filter((m) => m.id !== id));
}

export function showMessage(message: Omit<Message, "id">) {
  const newMsg = {
    cancelable: true,
    id: crypto.randomUUID(),
    ...message,
  };
  setUserMessages([...userMessages, newMsg]);

  if (message.timeout) {
    setTimeout(() => {
      clearMessageById(newMsg.id);
    }, message.timeout);
  }
}

export function showInfoMessage(message: Omit<Message, "type" | "id">) {
  showMessage({ type: "info", ...message });
}

export function showWarningMessage(message: Omit<Message, "type" | "id">) {
  showMessage({ type: "warning", ...message });
}

export function showErrorMessage(message: Omit<Message, "type" | "id">) {
  showMessage({ type: "error", ...message });
}

export function showSuccessMessage(message: Omit<Message, "type" | "id">) {
  showMessage({ type: "success", ...message });
}

export const mostSevereMessageType = createMemo(() => {
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
      clearBadge();
      break;
  }
});
