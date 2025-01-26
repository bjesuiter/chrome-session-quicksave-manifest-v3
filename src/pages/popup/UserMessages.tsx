import { getMessages } from "@src/lib/main/messages-service";
import { For } from "solid-js";

export function UserMessages() {
  return (
    <div class="flex-col items-stretch bg-slate-100 p-2">
      <For each={getMessages()}>
        {({ type, title, message }) => (
          <div class="flex items-center space-x-2">
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
            <div class="font-light">{message}</div>
          </div>
        )}
      </For>
    </div>
  );
}
