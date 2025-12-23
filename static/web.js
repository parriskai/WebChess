import * as web_bg from "./web_bg.js";

console.log("Load");

const wasm_core = await WebAssembly.instantiateStreaming(
  fetch("web_bg.wasm"),
  {"./web_bg.js": web_bg}
);

const wasm = wasm_core.instance.exports;

web_bg.__wbg_set_wasm(wasm);

console.log("Start");

wasm.__wbindgen_start();

export * from "./web_bg.js";