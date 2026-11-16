import {Input, Space} from 'antd';
import {useTranslation} from 'react-i18next';

import {INPUT} from '../../../constants/antd-types.js';
import {PROVIDER_VALUES} from '../../../constants/session-builder.js';

import styles from './ServerDetails.module.css';

const ServerTabZebrunner = ({server, setServerParam}) => {
  const {t} = useTranslation();

  return (
    <>
      <Space.Compact block>
        <Space.Addon>{t('WebDriver URL')}</Space.Addon>
        <Input
          id="zebrunnerServerHost"
          placeholder={PROVIDER_VALUES.ZEBRUNNER_URL}
          value={server.zebrunner.webDriverUrl}
          onChange={(e) => setServerParam('webDriverUrl', e.target.value)}
        />
      </Space.Compact>
      <div className={styles.serverDetailRow}>
        <div className={styles.serverInputField300px}>
          <Space.Compact block>
            <Space.Addon>{t('Username')}</Space.Addon>
            <Input
              id="zebrunnerUsername"
              placeholder={t('yourUsername')}
              value={server.zebrunner.username}
              onChange={(e) => setServerParam('username', e.target.value)}
            />
          </Space.Compact>
        </div>
        <div className={styles.serverInputField300px}>
          <Space.Compact block>
            <Space.Addon>{t('Password')}</Space.Addon>
            <Input
              id="zebrunnerPassword"
              type={INPUT.PASSWORD}
              placeholder={t('yourPassword')}
              value={server.zebrunner.accessKey}
              onChange={(e) => setServerParam('accessKey', e.target.value)}
            />
          </Space.Compact>
        </div>
      </div>
    </>
  );
};

export default ServerTabZebrunner;
