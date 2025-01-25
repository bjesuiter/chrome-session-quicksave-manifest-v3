import { isDev } from "@src/lib/flags";
import "@src/styles/tailwind.css";
import { Show } from "solid-js";

export function OptionsPage() {
  return (
    <div class="fixed inset-0 bg-slate-100 text-slate-800">
      <div class="mx-auto my-10 min-w-[300px] max-w-[900px] overflow-hidden rounded border-2 border-slate-200">
        <header class="flex flex-row items-center gap-4 bg-slate-800 p-5 text-white">
          <img
            class="size-12"
            src={chrome.runtime.getURL("icons/icon-512.png")}
          />
          <h1 class="text-2xl font-semibold">Session Quicksave Options</h1>
        </header>

        {/* Content Section */}
        <section class="min-h-[150px] overflow-y-auto p-5">
          <Show when={isDev}>
            <h2 class="my-2 text-xl font-bold text-red-600">DEV Section</h2>
            <div class="border-b-2 border-dashed border-red-600" />
          </Show>
        </section>
      </div>
    </div>
  );
}
