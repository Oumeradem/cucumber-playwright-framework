import { EnvironmentConfig } from '../../types';

/**
 * QA environment configuration.
 *
 * The example suite targets the public Swag Labs demo application
 * (saucedemo.com). In a real project this would point to the QA environment
 * of the application under test.
 */
export const qaConfig: EnvironmentConfig = {
  name: 'qa',
  baseUrl: 'https://www.saucedemo.com',
};
