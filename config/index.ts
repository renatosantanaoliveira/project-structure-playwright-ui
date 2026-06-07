import { qaConfig } from './qa.config';
import { devConfig } from './dev.config';

type EnvConfig = Readonly<{ envName: string; baseUrl: string }>;

const env = (process.env.NODE_ENV ?? 'qa').toLowerCase();

const configMap: Record<string, EnvConfig> = {
  qa: qaConfig,
  dev: devConfig,
};

export const envConfig: EnvConfig = configMap[env] ?? qaConfig;

export default envConfig;
