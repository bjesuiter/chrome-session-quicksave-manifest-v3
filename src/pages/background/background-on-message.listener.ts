import {
  setErrBadge,
  setOkBadge,
} from "@src/lib/chrome-services/badge-service";

export const backgroundOnMessageListener = async (
  message,
  _sender,
  _sendResponse,
) => {
  console.log("Message received in background:", message);

  if (message.type === "command") {
    switch (message.command) {
      case "showOkBadge": {
        await setOkBadge();
        // Note: This command cannot get a response since the sender is not available anymore
        break;
      }
      case "showErrBadge": {
        await setErrBadge();
        // Note: This command cannot get a response since the sender is not available anymore
        break;
      }
      default: {
        console.warn(
          "Unknown command received in background:",
          message.command,
        );
        break;
      }
    }
  }

  // Return `true` if you want to send a response asynchronously
  return true;
};
