#!/usr/bin/env -S deno run --allow-read
/**
 * Complete Demo - Shows all aspects of the Deno + WebAssembly project
 */

import { loadWasmModule, readStringFromWasm } from "./wasm-loader.ts";

async function completeDemo() {
  console.log("🦕✨ Complete Deno + WebAssembly Demo ✨🦕");
  console.log("==========================================");
  console.log("");
  
  try {
    console.log("1️⃣ Loading WebAssembly module compiled from WAT...");
    const wasmInstance = await loadWasmModule("./hello.wasm");
    const exports = wasmInstance.exports as {
      sayHello?: () => void;
      memory?: WebAssembly.Memory;
    };
    
    console.log("");
    console.log("2️⃣ Reading string directly from WASM memory...");
    if (exports.memory) {
      const helloString = readStringFromWasm(exports.memory, 0, 13);
      console.log(`   📖 Found in memory: "${helloString}"`);
    }
    
    console.log("");
    console.log("3️⃣ Calling WASM function that uses JavaScript import...");
    if (exports.sayHello) {
      console.log("   🎯 Calling sayHello()...");
      exports.sayHello();
      console.log("   ✅ Function call completed!");
    }
    
    console.log("");
    console.log("🎊 Demo completed successfully!");
    console.log("");
    console.log("🔍 What happened:");
    console.log("   • Loaded a WebAssembly module compiled from WAT");
    console.log("   • Read a string from WASM linear memory");
    console.log("   • Called a WASM function that imports JS console.log");
    console.log("   • The WASM function passed memory pointer and length to JS");
    console.log("");
    console.log("🚀 This demonstrates the core concepts of WASM integration!");
    
  } catch (error) {
    console.error("❌ Demo failed:", error);
    console.log("");
    console.log("💡 Make sure to compile the WAT file first:");
    console.log("   deno task compile-wat");
    console.log("   # or: wat2wasm hello.wat -o hello.wasm");
  }
}

if (import.meta.main) {
  await completeDemo();
}
