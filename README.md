# CRO (frontend)

Centralni register oseb

## Prerequisites

Before installing dependencies, ensure you have the following installed and properly set up:

### **Node.js version 16**  
Verify your Node.js version with:  
```bash
node --version
```

### **MS Visual Studio 2017 Build Tools**  
Download and install from [this link](https://aka.ms/vs/15/release/vs_buildtools.exe).  

Set Visual Studio Version for Node.js
```bash
npm config set msvs_version 2017
```

### **Python version 2.x** (must be accessible in your PATH as `python` or `python2`)  
Verify your Python version with:  
```bash
python --version
```
or

```bash
python2 --version
```

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
