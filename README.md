# calc-codex

This project contains a simple React implementation of a calculator inspired by Windows Calculator.

## Running the app

This project requires **Node.js 14.17.3** or later. If you use
[nvm](https://github.com/nvm-sh/nvm), you can run `nvm use` inside `calc-app`
and it will pick up the correct version from `.nvmrc`.

1. Navigate to the project folder and install dependencies:
   ```bash
   cd calc-app
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

The calculator supports parentheses using the `(` and `)` buttons so you can
enter expressions like `(1 + 2) * 3`. Additional functions such as `1/x`,
`x!`, `x^2`, `x^y`, and square root are available from their respective
buttons. The current memory value appears on the left side of the display and
the `MS` and `MR` buttons are disabled when no memory is stored.

Use `npm run build` to create a production build.
