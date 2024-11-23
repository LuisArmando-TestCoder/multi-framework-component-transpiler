#!/usr/bin/env node

/**
 * Multi-framework Component Transpiler
 *
 * This script reads an input file (JavaScript, TypeScript, JSX, TSX, Vue, or Svelte)
 * and generates transpiled versions in multiple frameworks and formats:
 *
 * - file.tsx (TypeScript React)
 * - file.jsx (JavaScript React)
 * - file.js (Vanilla JavaScript ESNext)
 * - file.es5.js (Vanilla JavaScript ES5)
 * - file.ts (TypeScript)
 * - file.svelte (JavaScript Svelte)
 * - file.ts.svelte (TypeScript Svelte)
 * - file.vue (JavaScript Vue)
 * - file.ts.vue (TypeScript Vue)
 * - angular_folder/ (Angular component in TypeScript)
 */

const fs = require("fs");
const path = require("path");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const vueCompiler = require("vue-template-compiler");
const svelte = require("svelte/compiler");

// Read command-line arguments
const inputFile = process.argv[2];
const outputDir = process.argv[3] || "./transpiled-components";

// Check if input file is provided
if (!inputFile) {
  console.error("Usage: node transpiler.js <inputFile> [outputDir]");
  process.exit(1);
}

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Input file "${inputFile}" does not exist.`);
  process.exit(1);
}

// Read the input file
const code = fs.readFileSync(inputFile, "utf-8");

// Determine the input file type based on extension
const ext = path.extname(inputFile).toLowerCase();

let globalCode = "";

// Function to extract global code from AST
function extractGlobalCode(ast) {
  const globalIdentifiers = ["window", "document", "localStorage"];
  const globalCodeNodes = [];

  traverse(ast, {
    enter(path) {
      if (
        path.isIdentifier() &&
        globalIdentifiers.includes(path.node.name) &&
        !path.scope.hasBinding(path.node.name)
      ) {
        const statement = path.getStatementParent().node;
        globalCodeNodes.push(statement);
      }
    },
  });

  // Remove duplicates
  const uniqueNodes = Array.from(new Set(globalCodeNodes));

  // Generate code from AST nodes
  const globalCode = uniqueNodes.map((node) => generator(node).code).join("\n");

  return globalCode;
}

// Parse the input code and extract global code
try {
  let ast;
  switch (ext) {
    case ".js":
    case ".jsx":
    case ".ts":
    case ".tsx":
      ast = babelParser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
      globalCode = extractGlobalCode(ast);
      break;
    case ".vue":
      const parsedVue = vueCompiler.parseComponent(code);
      if (parsedVue.script && parsedVue.script.content) {
        ast = babelParser.parse(parsedVue.script.content, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });
        globalCode = extractGlobalCode(ast);
      }
      break;
    case ".svelte":
      // Extract script content manually
      const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      if (scriptMatch && scriptMatch[1]) {
        ast = babelParser.parse(scriptMatch[1], {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });
        globalCode = extractGlobalCode(ast);
      }
      break;
    default:
      console.error(`Unsupported file extension "${ext}"`);
      process.exit(1);
  }
} catch (error) {
  console.error("Error parsing input file:", error.message);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper functions to generate code for each framework

// React Component
function generateReactComponent(globalCode, isTypeScript) {
  const useEffectHook = `
  useEffect(()${isTypeScript ? ": void" : ""} => {
    ${globalCode}
  }, []);
  `;

  const component = `
import React, { useEffect } from 'react';

function MyComponent()${isTypeScript ? ": JSX.Element" : ""} {
  ${useEffectHook}
  return <div>My Component</div>;
}

export default MyComponent;
  `;

  return component.trim();
}

// Vue Component
function generateVueComponent(globalCode, isTypeScript) {
  const scriptLang = isTypeScript ? 'lang="ts"' : "";
  const onMountedHook = `
onMounted(()${isTypeScript ? ": void" : ""} => {
  ${globalCode}
});
  `;

  const component = `
<template>
  <div>My Component</div>
</template>

<script setup ${scriptLang}>
import { onMounted } from 'vue';

${onMountedHook}
</script>
  `;

  return component.trim();
}

// Svelte Component
function generateSvelteComponent(globalCode, isTypeScript) {
  const scriptLang = isTypeScript ? 'lang="ts"' : "";
  const onMountHook = `
onMount(()${isTypeScript ? ": void" : ""} => {
  ${globalCode}
});
  `;

  const component = `
<script ${scriptLang}>
  import { onMount } from 'svelte';

  ${onMountHook}
</script>

<div>My Component</div>
  `;

  return component.trim();
}

// Angular Component
function generateAngularComponent(globalCode) {
  const component = `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: \`
    <div>My Component</div>
  \`,
})
export class MyComponent implements OnInit {
  ngOnInit(): void {
    ${globalCode}
  }
}
  `;

  return component.trim();
}

// Vanilla JavaScript
function generateVanillaJS(globalCode, version, isTypeScript) {
  let codeWrapper;

  if (version === "ES5") {
    codeWrapper = `(function() {
${globalCode}
})();`;
  } else {
    codeWrapper = `(()${isTypeScript ? ": void" : ""} => {
${globalCode}
})();`;
  }

  return codeWrapper.trim();
}

// Write the generated code to files

// React JSX (JavaScript)
const reactJSX = generateReactComponent(globalCode, false);
fs.writeFileSync(path.join(outputDir, "file.jsx"), reactJSX);

// React TSX (TypeScript)
const reactTSX = generateReactComponent(globalCode, true);
fs.writeFileSync(path.join(outputDir, "file.tsx"), reactTSX);

// Vue JavaScript
const vueJS = generateVueComponent(globalCode, false);
fs.writeFileSync(path.join(outputDir, "file.vue"), vueJS);

// Vue TypeScript
const vueTS = generateVueComponent(globalCode, true);
fs.writeFileSync(path.join(outputDir, "file.ts.vue"), vueTS);

// Svelte JavaScript
const svelteJS = generateSvelteComponent(globalCode, false);
fs.writeFileSync(path.join(outputDir, "file.svelte"), svelteJS);

// Svelte TypeScript
const svelteTS = generateSvelteComponent(globalCode, true);
fs.writeFileSync(path.join(outputDir, "file.ts.svelte"), svelteTS);

// Angular TypeScript
const angularTS = generateAngularComponent(globalCode);
const angularDir = path.join(outputDir, "angular_folder");
if (!fs.existsSync(angularDir)) {
  fs.mkdirSync(angularDir);
}
fs.writeFileSync(path.join(angularDir, "my-component.component.ts"), angularTS);

// Vanilla JavaScript ESNext
const vanillaJS = generateVanillaJS(globalCode, "ESNext", false);
fs.writeFileSync(path.join(outputDir, "file.js"), vanillaJS);

// Vanilla JavaScript ES5
const vanillaES5 = generateVanillaJS(globalCode, "ES5", false);
fs.writeFileSync(path.join(outputDir, "file.es5.js"), vanillaES5);

// Vanilla TypeScript
const vanillaTS = generateVanillaJS(globalCode, "ESNext", true);
fs.writeFileSync(path.join(outputDir, "file.ts"), vanillaTS);

console.log("Transpilation completed. Files generated in:", outputDir);
