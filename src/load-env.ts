import fs from "fs";
import path from "path";

/**
 * Load environment variables from .env file
 */
export function loadEnv(): void {
  const envPath = path.join(process.cwd(), ".env");

  try {
    const content = fs.readFileSync(envPath, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) continue;

      // Match KEY=VALUE pattern
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Only set if not already defined in environment
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
