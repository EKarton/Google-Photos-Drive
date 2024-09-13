// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;
  // Replace the following with your own environment variables.
  // Example: NGX_VERSION: string;
  readonly NG_APP_GOOGLE_CLIENT_ID: string;
  readonly NG_APP_GOOGLE_CLIENT_SECRET: string;
  readonly NG_APP_GOOGLE_REDIRECT_URL: string;
}

// Choose how to access the environment variables.
// Remove the unused options.

// 1. Use import.meta.env.YOUR_ENV_VAR in your code. (conventional)
declare interface ImportMeta {
  readonly env: Env;
}
