
# DanmakuTree

Build Status: ![ALL OS Build](https://github.com/DanmakuTree/DanmakuTree/workflows/ALL%20OS%20Build/badge.svg)

### Getting Started

Clone this repository, install dependencies and run using either `dev`, `debug` or `build` command.

```bash
# Clone this repository
git clone https://github.com/mubaidr/vue-electron

# change directory to cloned path
cd vue-electron

# Install dependencies
npm install

# Run in `debug` mode, to debug app using VSCODE
npm run debug

# Run in `dev` mode
npm run dev

# Build installer for this app
npm run build
```

### Project structure

`src/main` contains electron main script.

`src/renderer` contains vue-js application.

`src/utilities/workerSample.ts` a sample worker script.

### Notice

Do not use path included non ascii characters in your development environment, or you may fail to install dependencies.

请不要在开发环境中使用包含非ascii字符路径,否则可能无法安装依赖包。

( please blame node-gyp and python →_→ ) 