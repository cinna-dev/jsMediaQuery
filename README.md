# jsMediaQuery

## initiate typescript

### tsconfig

create `tsconfig.json`

```bash
touch tsconfig.json
```

```json
{
  "compilerOptions": {
    "target": "es2020",
    "watch": true,
    "moduleResolution": "node",
    "lib": ["dom", "es2020"], // adds external libraries like Classes from  the DOM
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  }
}
```

## Eslint in Typescript

### 1 Install

```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### 2 eslintrc

create `.eslintrc` _config_ in **root**

```bash
touch .eslintrc.js
```

config:

```js
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

### 3 eslintignore

create `eslintignore` in **root**

```bash
touch .eslintignore
```

ignore the `dist` folder and `node_modules`

```dot
node_modules
dist
```

### 4 script

`package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts <mySrcFolder>"
  }
}
```

### 5 vscode-eslint tasks.json

ctrl + p

`> Tasks: Configure Task`

`> npm: lint`

create a tasks.json in .vscode folder

```json
"tasks": [
  {
    "problemMatcher": ["$eslint-stylish"],
  }
]
```

### run eslint

package.json:

```json
"scripts": {
    "lint": "eslint -c .eslintrc --ext .ts src",
    "lint-fix": "eslint -c .eslintrc --ext .ts src --fix",
    "tsc": "eslint -c .eslintrc --ext .ts src tsc"
  },
```

```bash
npm run lint
```

**formating**

```bash
npm run ling-fix
```
