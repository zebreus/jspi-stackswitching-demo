# Tiny demo for using the WASM JavaScript Promise Integration API for stackswitching in wasm

Tiny demo for using the WASM JavaScript Promise Integration API for stackswitching in wasm.

## Files

- `main.ts` - Deno script that loads and calls the WASM module
- `example1.wat` - WebAssembly Text module using an imaginary stackswitching API
- `example2.py` - Python script that does the same as `example1.wat`

## Usage

### Deno

1. Install wabt and deno
2. Run: `deno task start`

### Browser

1. Install deno and emscripten (for emrun)
2. Run `deno task serve`

### Greenlet

1. Install python and greenlet
2. Run `python example1.py`
