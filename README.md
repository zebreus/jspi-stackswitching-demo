# Deno + WebAssembly Hello World Demo

This project demonstrates how to call WebAssembly functions from a Deno application. It includes a WAT (WebAssembly Text) module that can print "Hello, World!".

## Project Structure

- `hello.wat` - WebAssembly Text module with a Hello World function
- `main.ts` - Simple Deno script that demonstrates WASM concepts
- `wasm-demo.ts` - Enhanced demo with programmatically created WASM
- `wasm-loader.ts` - Complete WASM loader that can load compiled modules
- `deno.json` - Deno project configuration

## Prerequisites

1. **Deno** - Make sure you have Deno installed
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. **WebAssembly Binary Toolkit (wabt)** - For compiling WAT to WASM
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install wabt
   
   # On macOS
   brew install wabt
   
   # Or download from: https://github.com/WebAssembly/wabt/releases
   ```

## Quick Start

### Option 1: Run the basic demo
```bash
deno task demo
```

### Option 2: Compile WAT and run with real WASM
```bash
# Compile the WAT file to WASM
deno task compile-wat
# or manually: wat2wasm hello.wat -o hello.wasm

# Run the loader demo
deno task loader
```

### Option 3: Run the main demo
```bash
deno task start
```

## What Each File Does

### `hello.wat`
Contains a WebAssembly Text module that:
- Imports a console.log function from JavaScript
- Stores "Hello, World!" in memory
- Exports a `sayHello` function that calls console.log

### `main.ts`
A simple demonstration that shows the concept but doesn't compile WAT directly (requires external tools).

### `wasm-demo.ts`
Creates a minimal WASM module programmatically and demonstrates:
- How to create WASM binary data
- How to compile and instantiate WASM modules
- How to call exported WASM functions

### `wasm-loader.ts`
A complete implementation that:
- Loads compiled WASM files from disk
- Handles import objects for WASM modules
- Reads strings from WASM memory
- Provides proper error handling and fallbacks

## Understanding the WAT Module

The `hello.wat` file contains:

```wat
(module
  ;; Import console.log from JavaScript
  (import "console" "log" (func $log (param i32 i32)))
  
  ;; Memory to store strings
  (memory (export "memory") 1)
  
  ;; Our "Hello, World!" string data
  (data (i32.const 0) "Hello, World!")
  
  ;; Function that calls console.log with our string
  (func (export "sayHello")
    i32.const 0    ;; pointer to string start
    i32.const 13   ;; string length
    call $log
  )
)
```

## Available Tasks

- `deno task start` - Run the main demo
- `deno task demo` - Run the enhanced WASM demo
- `deno task loader` - Run the WASM loader demo
- `deno task compile-wat` - Compile WAT to WASM (requires wabt)
- `deno task dev` - Run with file watching for development

## Learning WebAssembly with Deno

This project demonstrates:

1. **WAT Syntax** - How to write WebAssembly Text format
2. **WASM Compilation** - Converting WAT to binary WASM
3. **Module Loading** - Loading WASM modules in Deno
4. **Function Calls** - Calling WASM functions from JavaScript/TypeScript
5. **Memory Management** - Reading/writing WASM linear memory
6. **Import Objects** - Providing JavaScript functions to WASM modules

## Next Steps

1. Modify the WAT file to add more functions
2. Experiment with different data types (i32, f32, f64)
3. Try passing more complex data between JS and WASM
4. Explore WASM's linear memory model
5. Look into WASI (WebAssembly System Interface) for more complex applications

## Troubleshooting

### "WASM file not found" error
Make sure to compile the WAT file first:
```bash
wat2wasm hello.wat -o hello.wasm
```

### "wabt not found" error
Install the WebAssembly Binary Toolkit:
- Ubuntu/Debian: `sudo apt-get install wabt`
- macOS: `brew install wabt`
- Windows: Download from GitHub releases

### Permission errors
Make sure Deno has read permissions:
```bash
deno run --allow-read your-script.ts
```
