import { clearMessage, userMessages } from "@src/lib/main/messages-service";
import { For, Show } from "solid-js";
import CancelButton from "~icons/iconoir/cancel?width=24px&height=24px";

export function UserMessages() {
  const getOnClickHandler = (id) => {
    if (id === "invalid-session-folder") {
      return () => {
        chrome.runtime.openOptionsPage();
      };
    }
  };

  const isOnClickMessage = (id) => {
    return getOnClickHandler(id) !== undefined;
  };

  return (
    <Show when={userMessages.length > 0}>
      {/* Messages Area */}
      <div class="flex-col items-stretch bg-slate-100 p-2">
        {/* Each Message */}
        <For each={userMessages}>
          {({ type, title, message, cancelable, isModal, id }, index) => (
            <div
              classList={{
                "flex items-center space-x-2": true,
                "cursor-pointer": isOnClickMessage(id),
              }}
              onClick={isOnClickMessage(id) ? getOnClickHandler(id) : undefined}
            >
              <div
                classList={{
                  "size-3 rounded-full": true,
                  "bg-blue-600": type === "info",
                  "bg-yellow-500": type === "warning",
                  "bg-red-600": type === "error",
                  "bg-green-600": type === "success",
                }}
              />
              <div class="font-semibold">{title}</div>
              <div classList={{ "font-bold": isModal, "font-light": !isModal }}>
                {message}
              </div>
              <Show when={cancelable}>
                <div class="grow" />
                <CancelButton
                  class="cursor-pointer"
                  onClick={() => clearMessage(index())}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
