import { saveSession } from "@src/lib/chrome-services/bookmark-service";
import { readOptionSessionsFolderId } from "@src/lib/chrome-services/synced-storage-service";
import { getTabsInWindow } from "@src/lib/chrome-services/tabs-service";
import "@src/styles/tailwind.css";
import { format } from "date-fns";
import { createSignal, Show } from "solid-js";

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

  const [saveError, setSaveError] = createSignal<
    undefined | { title: string; message: string }
  >();

  const quicksaveSession = async (e) => {
    e.preventDefault();

    const currentWindow = await chrome.windows.getCurrent();
    // this uses the first result, may break easily!
    // replace with target folder selection via plugin later
    const sessionFolderId = await readOptionSessionsFolderId();
    const tabs: chrome.tabs.Tab[] = await getTabsInWindow(currentWindow.id);

    try {
      await saveSession(sessionFolderId, sessionName(), tabs);
    } catch (e) {
      console.error(`Error saving new Session "${sessionName()}"`, e);
      await chrome.runtime.sendMessage({
        type: "command",
        command: "showErrBadge",
      });
      setSaveError({
        title: "Session Quicksave - Error",
        message: `Error saving new Session "${sessionName()}". Please try again.`,
      });
      return;
    }

    await chrome.runtime.sendMessage({
      type: "command",
      command: "showOkBadge",
    });
    closePopup();
  };

  // Test Error
  // setSaveError({
  //   title: "Session Quicksave - Error",
  //   message: `Error saving new Session "Test 2025-01-25". Please try again.`,
  // });

  return (
    <form
      onSubmit={quicksaveSession}
      class="flex h-fit w-[300px] flex-col gap-2 bg-slate-800 px-4 pb-10 pt-4 text-white"
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

      <Show when={saveError()}>
        <div class="mt-4 rounded bg-red-600 p-2 text-white">
          <h3 class="text-lg font-semibold">{saveError().title}</h3>
          <p class="text-sm">{saveError().message}</p>
        </div>
      </Show>
    </form>
  );
}
