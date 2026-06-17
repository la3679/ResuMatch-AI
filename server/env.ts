import 'dotenv/config';

/** Validated, typed server configuration loaded from the environment. */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
};

export const isProduction = env.nodeEnv === 'production';

/** Whether AI features are available (a Gemini key is configured). */
export const isAiConfigured = env.geminiApiKey.length > 0;

if (!isAiConfigured) {
  console.warn(
    '[env] GEMINI_API_KEY is not set. AI endpoints will return a configuration error until it is provided.',
  );
}
