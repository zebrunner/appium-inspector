import i18n from '../../i18next.js';
import {BaseVendor} from './base.js';

const LOOPBACK_HOSTNAME = /^(localhost|127(\.\d{1,3}){3}|\[::1\])$/i;

function toBase64Utf8(value: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
}

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
    if (!https && !LOOPBACK_HOSTNAME.test(host)) {
      throw new Error(i18n.t('zebrunnerHttpsRequired', {url: zebrunnerUrl.origin}));
    }
    const port = zebrunnerUrl.port === '' ? (https ? 443 : 80) : zebrunnerUrl.port;

    // The nginx of MCloud checks the basic authentication on every request, while webdriver sends
    // user/key on the new session request only, so the header goes with every request to this host.
    this._saveProperties(zebrunner, {
      host,
      path,
      port,
      https,
      headers: {Authorization: `Basic ${toBase64Utf8(`${username}:${password}`)}`},
    });
  }
}
