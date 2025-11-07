# Deno + WebAssembly Hello World

Simple Deno project that calls a WebAssembly function to print "Hello, World!".

## Files

- `hello.wat` - WebAssembly Text module
- `main.ts` - Deno script that loads and calls the WASM module

## Setup

1. Compile WAT to WASM: `wat2wasm hello.wat -o hello.wasm`
2. Run: `deno task start`
