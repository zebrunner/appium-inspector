import {describe, expect, it, vi} from 'vitest';

import {ZebrunnerVendor} from '../../app/common/renderer/lib/vendor/zebrunner.js';

// Stub the i18n wrapper so the vendor can be imported without the electron/polyfills chain
vi.mock('../../app/common/renderer/i18next.js', () => ({default: {t: (key) => key}}));

function apply(zebrunner) {
  return new ZebrunnerVendor({zebrunner: {username: 'user', accessKey: 'pass', ...zebrunner}}, {}).apply();
}

describe('ZebrunnerVendor', function () {
  it('should send the basic authentication header to the https hub only', async function () {
    expect(await apply({webDriverUrl: 'https://mcloud.example/mcloud/wd/hub'})).toEqual({
      host: 'mcloud.example',
      path: '/mcloud/wd/hub',
      port: 443,
      https: true,
      username: undefined,
      accessKey: undefined,
      headers: {Authorization: `Basic ${btoa('user:pass')}`},
    });
  });

  it('should keep an explicit port', async function () {
    expect(await apply({webDriverUrl: 'https://mcloud.example:8443/mcloud/wd/hub'})).toMatchObject({port: '8443'});
  });

  it('should encode a non-Latin-1 password as UTF-8', async function () {
    const {headers} = await apply({webDriverUrl: 'https://mcloud.example/mcloud/wd/hub', accessKey: 'пароль€'});
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(headers.Authorization.slice('Basic '.length)), (c) => c.charCodeAt(0)),
    );
    expect(decoded).toBe('user:пароль€');
  });

  it('should refuse a plain http hub that is not on this machine', async function () {
    await expect(apply({webDriverUrl: 'http://mcloud.example/mcloud/wd/hub'})).rejects.toThrow(
      'zebrunnerHttpsRequired',
    );
    await expect(apply({webDriverUrl: 'http://192.168.1.10:8082/mcloud/wd/hub'})).rejects.toThrow(
      'zebrunnerHttpsRequired',
    );
  });

  it('should allow plain http to a hub on the loopback interface', async function () {
    for (const host of ['localhost', '127.0.0.1', '[::1]']) {
      expect(await apply({webDriverUrl: `http://${host}:8082/mcloud/wd/hub`})).toMatchObject({
        host,
        port: '8082',
        https: false,
      });
    }
  });

  it('should require the URL, the username and the password', async function () {
    await expect(apply({webDriverUrl: 'https://mcloud.example/mcloud/wd/hub', accessKey: ''})).rejects.toThrow(
      'missingVendorProperties',
    );
  });
});
