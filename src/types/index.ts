export type EnvironmentName = 'dev' | 'qa' | 'stage' | 'prod';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export type ScreenshotMode = 'on' | 'off' | 'only-on-failure';

export type VideoMode = 'on' | 'off' | 'retain-on-failure';

export type TraceMode = 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';

/** Per-environment configuration (see src/config/environments). */
export interface EnvironmentConfig {
  readonly name: EnvironmentName;
  readonly baseUrl: string;
  readonly apiBaseUrl?: string;
}

/** Central runtime configuration consumed by the whole framework. */
export interface AppConfig {
  readonly env: EnvironmentName;
  readonly baseUrl: string;
  readonly apiBaseUrl: string;
  readonly browser: BrowserName;
  readonly headless: boolean;
  readonly timeout: number;
  readonly retries: number;
  readonly workers: number;
  readonly screenshot: ScreenshotMode;
  readonly video: VideoMode;
  readonly trace: TraceMode;
  readonly username: string;
  readonly password: string;
}

export interface UserCredentials {
  readonly username: string;
  readonly password: string;
}

export interface ScenarioMetadata {
  readonly name: string;
  readonly tags: readonly string[];
}
