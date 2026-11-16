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

## Connect to MCloud

Add the Zebrunner cloud provider in the session builder and set:

- WebDriver URL: the Selenium/Appium hub of [MCloud](https://github.com/zebrunner/mcloud), `https://<host>:<port>/mcloud/wd/hub` (the port can be omitted for 443), the same path when MCloud runs inside [Zebrunner CE](https://zebrunner.github.io/community-edition);
- Username and Password: the user and the password of the [basic authentication of the hub](https://github.com/zebrunner/mcloud/blob/develop/configuration/stf-proxy/htpasswd/README.md).
