import {BaseVendor} from './base.js';

export class ZebrunnerVendor extends BaseVendor {
  override async configureProperties(): Promise<void> {
    const zebrunner = this._server.zebrunner;
    const vendorName = 'Zebrunner';

    const url = zebrunner.webDriverUrl as string | undefined;
    const username = zebrunner.username as string | undefined;
    const password = zebrunner.accessKey as string | undefined;

    this._checkInputPropertyPresence(vendorName, [
      {name: 'WebDriver URL', val: url},
      {name: 'Username', val: username},
      {name: 'Password', val: password},
    ]);

    const zebrunnerUrl = this._validateUrl(url as string);
    const host = zebrunnerUrl.hostname;
    const path = zebrunnerUrl.pathname;
    const https = zebrunnerUrl.protocol === 'https:';
    const port = zebrunnerUrl.port === '' ? (https ? 443 : 80) : zebrunnerUrl.port;

    this._saveProperties(zebrunner, {
      host,
      path,
      port,
      https,
      username,
      accessKey: password,
    });
  }
}
