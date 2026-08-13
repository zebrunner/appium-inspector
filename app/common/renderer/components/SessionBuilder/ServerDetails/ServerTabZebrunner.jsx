import {Col, Input, Row, Space} from 'antd';
import {useTranslation} from 'react-i18next';

import {INPUT} from '../../../constants/antd-types.js';
import {PROVIDER_VALUES} from '../../../constants/session-builder.js';

const ServerTabZebrunner = ({server, setServerParam}) => {
  const {t} = useTranslation();

  return (
    <Row gutter={8}>
      <Col span={24}>
        <Space.Compact block>
          <Space.Addon>{t('WebDriver URL')}</Space.Addon>
          <Input
            id="zebrunnerServerHost"
            placeholder={PROVIDER_VALUES.ZEBRUNNER_URL}
            value={server.zebrunner.webDriverUrl}
            onChange={(e) => setServerParam('webDriverUrl', e.target.value)}
          />
        </Space.Compact>
      </Col>
      <Col span={12}>
        <Space.Compact block>
          <Space.Addon>{t('Username')}</Space.Addon>
          <Input
            id="zebrunnerUsername"
            placeholder={t('yourUsername')}
            value={server.zebrunner.username}
            onChange={(e) => setServerParam('username', e.target.value)}
          />
        </Space.Compact>
      </Col>
      <Col span={12}>
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
      </Col>
    </Row>
  );
};

export default ServerTabZebrunner;
