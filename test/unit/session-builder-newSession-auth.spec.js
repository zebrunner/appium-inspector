import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';

const {starter} = vi.hoisted(() => ({starter: {newSession: null}}));

vi.mock('../../app/common/renderer/utils/logger.js', () => ({
  log: {debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn()},
}));
vi.mock('../../app/common/renderer/utils/notification.js', () => ({
  notification: {error: vi.fn(), info: vi.fn(), success: vi.fn(), warning: vi.fn()},
}));
vi.mock('i18next', () => ({
  default: {
    isInitialized: true,
    use: vi.fn().mockReturnThis(),
    init: vi.fn(),
    t: (key) => key,
  },
}));
vi.mock('../../app/common/renderer/polyfills.js', () => ({
  setSetting: vi.fn(() => Promise.resolve()),
  getSetting: vi.fn(() => Promise.resolve(null)),
  openLink: vi.fn(),
  setTheme: vi.fn(),
  updateLanguage: vi.fn(),
  localesPath: '',
  loadSessionFileIfOpened: vi.fn().mockResolvedValue(null),
}));
vi.mock('../../app/common/renderer/lib/appium/session-starter.js', () => ({
  default: {newSession: (...args) => starter.newSession(...args)},
}));

const CAPS = [{type: 'text', name: 'platformName', value: 'Android'}];

let actions;
let builder;

// Runs newSession for the given server and returns the options it would connect with
async function serverOptsFor(serverType, serverSlice) {
  let state = builder(undefined, {type: '@@INIT'});
  state = builder(state, {type: actions.SET_SERVER, server: {[serverType]: serverSlice}, serverType});
  const dispatch = (action) => {
    if (typeof action !== 'function') {
      state = builder(state, action);
    }
  };
  let serverOpts = null;
  starter.newSession = vi.fn((opts) => {
    serverOpts = opts;
    throw new Error('stop after the server options');
  });
  await actions.newSession(CAPS)(dispatch, () => ({builder: state}));
  return serverOpts;
}

describe('SessionBuilder actions', function () {
  describe('#newSession authentication', function () {
    beforeAll(async () => {
      actions = await import('../../app/common/renderer/actions/SessionBuilder.js');
      ({default: builder} = await import('../../app/common/renderer/reducers/SessionBuilder.js'));
    }, 60_000);

    beforeEach(() => {
      starter.newSession = null;
    });

    it('should not add a basic authentication header for other providers', async function () {
      const serverOpts = await serverOptsFor('testingbot', {username: 'tb-user', accessKey: 'tb-key'});
      expect(serverOpts).toMatchObject({hostname: 'hub.testingbot.com', user: 'tb-user', key: 'tb-key'});
      expect(serverOpts.headers?.Authorization).toBeUndefined();
    });

    it('should send the basic authentication header of Zebrunner to its hub', async function () {
      const serverOpts = await serverOptsFor('zebrunner', {
        webDriverUrl: 'https://mcloud.example/mcloud/wd/hub',
        username: 'user',
        accessKey: 'pass',
      });
      expect(serverOpts).toMatchObject({
        hostname: 'mcloud.example',
        protocol: 'https',
        path: '/mcloud/wd/hub',
        headers: {Authorization: `Basic ${btoa('user:pass')}`},
      });
      expect(serverOpts.user).toBeUndefined();
    });

    it('should not connect to a plain http Zebrunner hub', async function () {
      const serverOpts = await serverOptsFor('zebrunner', {
        webDriverUrl: 'http://mcloud.example/mcloud/wd/hub',
        username: 'user',
        accessKey: 'pass',
      });
      expect(serverOpts).toBeNull();
    });
  });
});
