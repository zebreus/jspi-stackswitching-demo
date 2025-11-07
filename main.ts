// @ts-nocheck

// Keeps track of all continuations
const continuations: Record<number, { resume?: () => void | Promise<never> }> = {
  0: {},
};
// Current active continuation id
let current_continuation = 0;

// Counter for assigning new continuation ids
let next_free_continuation_id = 1;

export async function main() {
  const wasmBytes =
     !("Deno" in globalThis)
      ? ((await (await fetch("./example1.wasm")).body?.getReader().read())?.value)
      : await Deno.readFile("./example1.wasm");
  if (!wasmBytes) {
    throw new Error("Failed to load WASM bytes");
  }
  const wasmModule = await WebAssembly.compile(wasmBytes);

  const importObject = {
    console: {
      log: (ptr: number, len: number) => {
        const memory = wasmInstance.exports.memory as WebAssembly.Memory;
        const bytes = new Uint8Array(memory.buffer, ptr, len);
        const message = new TextDecoder().decode(bytes);
        console.log(message);
      },
      continuation_new: (fn: number) => {
        const id = next_free_continuation_id;
        next_free_continuation_id += 1;
        continuations[id] = {
          // Put an initializer function into the resume function
          resume: async () => {
            await WebAssembly.promising(exports.entrypoint)(fn);
            throw new Error("Entrypoint actually returned");
          },
        };
        return id;
      },
      // Transfer control to a paused continuation
      continuation_switch: new WebAssembly.Suspending((to_continuation_id: number) => {
        // Setup a promise that will resume the current continuation later when resolved
        const from_continuation = continuations[current_continuation];
        if (from_continuation.resume) {
          throw new Error("The current greenlet is already paused");
        }
        const promise = new Promise<void>((resolve) => {
          from_continuation.resume = resolve as () => void;
        });

        // Resume the promise on the continuation we are switching to
        const to_continuation = continuations[to_continuation_id];
        const resume = to_continuation?.resume;
        delete to_continuation?.resume;
        if (!resume) {
          throw new Error("To greenlet does not exist");
        }
        
        // Update the current continuation id and resume
        current_continuation = to_continuation_id;

        // Resume does NOT! return control directly to the resumed
        // continuation, but just resolves the promise so javascripts
        // async runtime can resume it when it feels like doing that
        resume!();

        // Return a new promise
        return promise;
      }),
    },
  };

  const wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
  const exports = wasmInstance.exports as {
    _main: () => void;
    entrypoint: () => void;
  };

  const main = WebAssembly.promising(exports._main);
  await main();
}

if ("Deno" in globalThis) {
  await main();
}