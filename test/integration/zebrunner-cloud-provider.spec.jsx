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
});
