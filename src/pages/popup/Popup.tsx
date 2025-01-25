import "@src/styles/tailwind.css";

export function PopupPage() {
  return (
    <div class="flex h-fit w-[350px] flex-col gap-2 bg-slate-800 p-4 text-white" >
      <p class='pl-1 text-lg'>Please name your session</p>

      <input type="text" placeholder="Session Name" class='m-1 rounded p-2 text-base' />

      <div class='flex justify-end gap-2'>
            <button onClick={() => window.close()} class="rounded border-2 border-blue-500 bg-white px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">Cancel</button>
            <button class="rounded border-2 border-green-500 bg-white px-4 py-2 font-semibold text-green-700 hover:border-transparent hover:bg-green-500 hover:text-white">Save</button>
      </div>
    </div>
  );
}
