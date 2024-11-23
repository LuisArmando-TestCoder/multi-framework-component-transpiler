# Multi-Framework Component Transpiler

**Transpile components to multiple frameworks with ease.**  
This tool converts your global JavaScript code or framework-specific files into compatible components for multiple frameworks, including React, Vue, Svelte, Angular, and vanilla JavaScript.

---

## Features

- Supports **React**, **Vue**, **Svelte**, **Angular**, and **Vanilla JS**.
- Generates both **JavaScript** and **TypeScript** components.
- Handles lifecycle hooks for each framework (e.g., `useEffect`, `onMounted`, `onMount`, etc.).
- Works with `.js`, `.ts`, `.jsx`, `.tsx`, `.vue`, and `.svelte` input files.

---

## Installation

### Install via npm (Global)

```bash
npm install -g multi-framework-component-transpiler
```

---

## Usage

After installation, use the `multi-transpile` command to transpile your input files.

### Command Syntax

```bash
multi-transpile <inputFile> [outputDir]
```

- **`<inputFile>`**: The path to the input file. Supported formats: `.js`, `.jsx`, `.ts`, `.tsx`, `.vue`, `.svelte`.
- **`[outputDir]`**: (Optional) The directory where transpiled files will be saved. Defaults to `./transpiled-components`.

### Example

```bash
multi-transpile input.js ./output
```

This command reads `input.js`, processes the global and framework-specific code, and generates components in multiple frameworks in the `./output` directory.

---

## Output Files

The tool generates the following files:

### React
- `file.jsx` (React component in JavaScript)
- `file.tsx` (React component in TypeScript)

### Vue
- `file.vue` (Vue component in JavaScript)
- `file.ts.vue` (Vue component in TypeScript)

### Svelte
- `file.svelte` (Svelte component in JavaScript)
- `file.ts.svelte` (Svelte component in TypeScript)

### Angular
- `angular_folder/my-component.component.ts` (Angular component in TypeScript)

### Vanilla JavaScript
- `file.js` (Vanilla JavaScript ESNext)
- `file.es5.js` (Vanilla JavaScript ES5)
- `file.ts` (Vanilla TypeScript)

---

## Example Input and Output

### Input (`input.js`)

```javascript
// Some global code
console.log(window.location.href);
localStorage.setItem('key', 'value');

// A sample function
function greet() {
  alert('Hello, World!');
}
```

### Example Output (`output/` Directory)

#### React (JavaScript)
**`file.jsx`**
```jsx
import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    console.log(window.location.href);
    localStorage.setItem('key', 'value');
  }, []);

  return <div>My Component</div>;
}

export default MyComponent;
```

#### Vue (TypeScript)
**`file.ts.vue`**
```vue
<template>
  <div>My Component</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted((): void => {
  console.log(window.location.href);
  localStorage.setItem('key', 'value');
});
</script>
```

#### Angular
**`angular_folder/my-component.component.ts`**
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<div>My Component</div>`,
})
export class MyComponent implements OnInit {
  ngOnInit(): void {
    console.log(window.location.href);
    localStorage.setItem('key', 'value');
  }
}
```

---

## Supported Input Formats

- JavaScript (`.js`)
- TypeScript (`.ts`)
- React (`.jsx`, `.tsx`)
- Vue (`.vue`)
- Svelte (`.svelte`)

---

## Supported Frameworks

The following frameworks are supported, along with their respective lifecycle hooks:

| Framework | Lifecycle Hook               |
|-----------|------------------------------|
| React     | `useEffect`                 |
| Vue       | `onMounted`                 |
| Svelte    | `onMount`                   |
| Angular   | `ngOnInit`                  |
| Vanilla   | IIFE (`Immediately Invoked Function Expression`) |

---

## Development

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- npm (Node Package Manager)

### Clone the Repository

```bash
git clone https://github.com/LuisArmando-TestCoder/multi-framework-component-transpiler.git
cd multi-framework-component-transpiler
```

### Install Dependencies

```bash
npm install
```

### Test Locally

To test the command locally without publishing:

```bash
npm link
```

You can now use the `multi-transpile` command globally on your system.

---

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit your changes with clear messages.
4. Submit a pull request.

---

## Issues and Feedback

If you encounter any issues or have feedback, please submit an issue on GitHub:

[Report an Issue](https://github.com/LuisArmando-TestCoder/multi-framework-component-transpiler/issues)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Me, myself and I

*PD: Still in progress, tho...*