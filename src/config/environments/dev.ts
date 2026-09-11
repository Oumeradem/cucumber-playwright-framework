import { EnvironmentConfig } from '../../types';

/**
 * Dev environment configuration.
 *
 * The example suite targets the public Swag Labs demo application
 * (saucedemo.com) - a stable test app with published demo credentials.
 */
export const devConfig: EnvironmentConfig = {
  name: 'dev',
  baseUrl: 'https://www.saucedemo.com',
};
