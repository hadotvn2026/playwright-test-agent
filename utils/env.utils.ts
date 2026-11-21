/** Reads a required environment variable (from .dev.env locally or GitHub secrets on CI). */
export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set. Add it to .dev.env locally or to GitHub repository secrets for CI.`);
    }
    return value;
}
