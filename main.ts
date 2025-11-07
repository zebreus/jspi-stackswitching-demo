async function main() {
  const wasmBytes = await Deno.readFile("./hello.wasm");
  
  const wasmModule = await WebAssembly.compile(wasmBytes);
  
  const importObject = {
    console: {
      log: (ptr: number, len: number) => {
        const memory = (wasmInstance.exports.memory as WebAssembly.Memory);
        const bytes = new Uint8Array(memory.buffer, ptr, len);
        const message = new TextDecoder().decode(bytes);
        console.log(message);
      }
    }
  };
  
  const wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
  
  (wasmInstance.exports as { sayHello: () => void }).sayHello();
}

if (import.meta.main) {
  main();
}
