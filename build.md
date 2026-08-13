# Build Zebrunner Appium Inspector

```zsh
# This process may take up to 10 minutes (5 on average), please be patient.
npm ci
rm -rf ./release/*
npm run build:electron
CSC_IDENTITY_AUTO_DISCOVERY=true npx electron-builder build --mac dmg --arm64 --publish never
```

```zsh
open ./release/
```
