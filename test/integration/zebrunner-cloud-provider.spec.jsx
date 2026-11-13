import {readFileSync} from 'node:fs';

import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';

vi.mock('react-i18next', () => ({useTranslation: () => ({t: (key) => key})}));
vi.mock('../../app/common/renderer/hooks/use-theme.jsx', () => ({useTheme: () => ({isDarkTheme: false})}));

const loadCloudProviders = async () =>
  (await import('../../app/common/renderer/components/SessionBuilder/ServerDetails/CloudProviders.jsx')).default;

describe('Zebrunner cloud provider', function () {
  it('should be the only cloud provider offered', async function () {
    expect(Object.keys(await loadCloudProviders())).toEqual(['zebrunner']);
  });

  it('should render the WebDriver URL, username and password fields', async function () {
    const CloudProviders = await loadCloudProviders();
    const html = renderToStaticMarkup(
      CloudProviders.zebrunner.tab({server: {zebrunner: {}}, setServerParam: () => {}}),
    );
    expect(html).toContain('id="zebrunnerServerHost"');
    expect(html).toContain('id="zebrunnerUsername"');
    expect(html).toMatch(/id="zebrunnerPassword"[^>]*type="password"|type="password"[^>]*id="zebrunnerPassword"/);
  });

  it('should suggest the MCloud hub path', async function () {
    const CloudProviders = await loadCloudProviders();
    const html = renderToStaticMarkup(
      CloudProviders.zebrunner.tab({server: {zebrunner: {}}, setServerParam: () => {}}),
    );
    expect(html).toContain('placeholder="https://your-mcloud-host/mcloud/wd/hub"');
    expect(html).toContain('sessionZebrunnerWebDriverURLDescription');
  });

  it('should have English texts for all its labels', function () {
    const translation = JSON.parse(
      readFileSync(new URL('../../app/common/public/locales/en/translation.json', import.meta.url), 'utf8'),
    );
    expect(Object.keys(translation)).toEqual(
      expect.arrayContaining(['WebDriver URL', 'Username', 'Password', 'yourUsername', 'yourPassword']),
    );
    expect(translation.sessionZebrunnerWebDriverURLDescription).toContain('/mcloud/wd/hub');
  });
});
