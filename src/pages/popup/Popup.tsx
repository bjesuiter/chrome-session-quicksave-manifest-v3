import { saveSession } from "@src/lib/chrome-services/bookmark-service";
import {
  showError,
  showSimpleNotification,
} from "@src/lib/chrome-services/notification-service";
import { readOptionSessionsFolderId } from "@src/lib/chrome-services/synced-storage-service";
import { getTabsInWindow } from "@src/lib/chrome-services/tabs-service";
import "@src/styles/tailwind.css";
import { format } from "date-fns";
import { createSignal } from "solid-js";

export function PopupPage() {
  const [sessionName, setSessionName] = createSignal(
    "New Session " + format(new Date(), "yyyy-MM-dd"),
  );

  const closePopup = () => {
    window.close();
  };

  const [isInputError, setIsInputError] = createSignal(false);

  const validateInput = (e) => {
    const input = e.target as HTMLInputElement;
    const trimmedValue = input.value.trim();

    // check custom validity first (to be able to undo it before checking for input.checkValidity())
    if (trimmedValue.length === 0) {
      input.setCustomValidity("You've got whitespace only!");
      setIsInputError(true);
      return;
    } else {
      input.setCustomValidity("");
      setIsInputError(false);
    }

    if (!input.checkValidity()) {
      setIsInputError(true);
    } else {
      setIsInputError(false);
      setSessionName(trimmedValue);
    }
  };

  const quicksaveSession = async (e) => {
    e.preventDefault();

    const currentWindow = await chrome.windows.getCurrent();
    // this uses the first result, may break easily!
    // replace with target folder selection via plugin later
    const sessionFolderId = await readOptionSessionsFolderId();
    const tabs: chrome.tabs.Tab[] = await getTabsInWindow(currentWindow.id);

    try {
      await saveSession(sessionFolderId, sessionName(), tabs);
      console.info(`Session "${sessionName()}" saved successfully`);
      closePopup();
    } catch (e) {
      console.error("Error saving session", e);
      await showError(
        "Session Quicksave - Error",
        `Error saving new Session "${sessionName()}". Please try again.`,
      );
      return;
    }

    // Todo: show notification which allows jumping to the new session folder in bookmark manager view
    // TODO: allow deleting the saved session directly (in case of an error)
    await showSimpleNotification(
      "Session Quicksave - Success",
      `Saved new Session "${sessionName()}" successfully`,
    );
  };

  return (
    <form
      onSubmit={quicksaveSession}
      class="flex h-fit w-[300px] flex-col gap-2 bg-slate-800 px-4 py-10 text-white"
    >
      <label for="sessionNameInput" class="pl-1 text-lg font-semibold">
        Please name your session
      </label>

      <input
        type="text"
        id="sessionNameInput"
        placeholder="Session Name"
        classList={{
          "m-1 rounded p-2 text-base text-slate-700": true,
          "border-red-500 focus:outline-none focus:ring-red-500 focus:ring-2 focus:ring-inset focus:ring-offset-1":
            isInputError(),
          "border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-inset focus:ring-offset-1":
            !isInputError(),
        }}
        required
        value={sessionName()}
        // onInput={(evt) => setSessionName(evt.target.value.trim())}
        onInput={validateInput}
      />

      <div class="flex justify-end gap-2">
        <button
          type="button"
          onClick={closePopup}
          class="rounded border-2 border-blue-500 bg-white px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded border-2 border-green-500 bg-white px-4 py-2 font-semibold text-green-700 hover:border-transparent hover:bg-green-500 hover:text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}
