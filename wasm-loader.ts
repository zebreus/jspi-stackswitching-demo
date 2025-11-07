/**
 * WASM Loader - Loads and executes compiled WebAssembly modules
 */

interface WasmExports {
  sayHello?: () => void;
  memory?: WebAssembly.Memory;
  getStringPtr?: () => number;
  getStringLen?: () => number;
}

export async function loadWasmModule(wasmPath: string): Promise<WebAssembly.Instance> {
  try {
    console.log(`📦 Loading WASM module from: ${wasmPath}`);
    
    // Check if file exists
    try {
      await Deno.stat(wasmPath);
    } catch {
      throw new Error(`WASM file not found: ${wasmPath}`);
    }
    
    // Read the WASM binary
    const wasmBytes = await Deno.readFile(wasmPath);
    console.log(`✅ Read ${wasmBytes.length} bytes from WASM file`);
    
    // Create import object for functions that WASM might need
    const importObject = {
      console: {
        log: (ptr: number, len: number) => {
          console.log(`WASM Console: ptr=${ptr}, len=${len}`);
        }
      },
      env: {
        // Add any environment functions WASM might need
      }
    };
    
    // Compile and instantiate the WASM module
    console.log("🔨 Compiling WASM module...");
    const wasmModule = await WebAssembly.compile(wasmBytes);
    
    console.log("🚀 Instantiating WASM module...");
    const wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
    
    console.log("✅ WASM module loaded successfully!");
    return wasmInstance;
    
  } catch (error) {
    console.error("❌ Error loading WASM module:", error);
    throw error;
  }
}

export function readStringFromWasm(
  memory: WebAssembly.Memory, 
  ptr: number, 
  len: number
): string {
  const bytes = new Uint8Array(memory.buffer, ptr, len);
  return new TextDecoder().decode(bytes);
}

export async function runWasmWithLoader() {
  console.log("🦕 Deno WASM Loader Demo");
  console.log("========================");
  
  const wasmPath = "./hello.wasm";
  
  try {
    // Try to load the compiled WASM file
    const wasmInstance = await loadWasmModule(wasmPath);
    const exports = wasmInstance.exports as WasmExports;
    
    // Check what functions are exported
    console.log("📋 Available exports:", Object.keys(exports));
    
    // Call the hello function if it exists
    if (exports.sayHello) {
      console.log("🎯 Calling sayHello function...");
      exports.sayHello();
    }
    
    // If there's memory, read the "Hello, World!" string that we know is at position 0
    if (exports.memory) {
      const message = readStringFromWasm(exports.memory, 0, 13); // "Hello, World!" is 13 chars
      console.log(`📝 String from WASM memory: "${message}"`);
    }
    
    // If there's memory and string functions, read the string
    if (exports.memory && exports.getStringPtr && exports.getStringLen) {
      const ptr = exports.getStringPtr();
      const len = exports.getStringLen();
      const message = readStringFromWasm(exports.memory, ptr, len);
      console.log(`📝 String from WASM memory (via functions): "${message}"`);
    }
    
  } catch (_error) {
    console.log("⚠️  Could not load compiled WASM file.");
    console.log("💡 To create the WASM file, run:");
    console.log("   wat2wasm hello.wat -o hello.wasm");
    console.log("");
    console.log("🔄 Falling back to simulated output...");
    console.log("🎉 Hello, World! (simulated WASM output)");
  }
}

if (import.meta.main) {
  await runWasmWithLoader();
}
