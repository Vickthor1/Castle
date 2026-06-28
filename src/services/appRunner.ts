import { exec } from "child_process";
import fs from "fs";
import { resolveShortcut } from "./shortcutResolver";
import { handleAppError } from "./errorHandler";

export type AppItem = {
  name: string;
  path: string;
  type: "exe" | "lnk" | "folder";
};

const pathCache = new Map<string, string>();
const MAX_RETRIES = 2; // Total attempts = 1 (initial) + 2 (retries) = 3

export async function runApp(app: AppItem): Promise<void> {
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts <= MAX_RETRIES) {
    try {
      if (!app?.path) {
        throw new Error("Caminho do aplicativo não definido.");
      }

      let finalPath = app.path;

      // Check cache first to avoid redundant fs.existsSync calls
      if (!pathCache.has(app.path)) {
        const exists = fs.existsSync(app.path);
        if (!exists) {
          throw new Error(`Aplicativo não encontrado: ${app.path}`);
        }
        pathCache.set(app.path, app.path); // Cache valid path
      }

      // Resolver atalho (.lnk)
      if (app.type === "lnk" || app.path.endsWith(".lnk")) {
        finalPath = await resolveShortcut(app.path);
      }

      // Executável direto
      if (finalPath.endsWith(".exe")) {
        // exec is async, but its error handling is via callback.
        // To integrate with retry, we need to promisify or similar.
        // For simplicity, we'll assume a sync-like behavior for retry here
        // or ensure handleAppError is called correctly if it fails.
        await new Promise<void>((resolve, reject) => {
          exec(`"${finalPath}"`, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        return; // Success, exit the loop
      }

      // Pasta (abre no explorer)
      if (app.type === "folder") {
        exec(`explorer "${finalPath}"`);
        return; // Success, exit the loop
      }

      throw new Error("Tipo de aplicativo não suportado.");
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempts + 1} failed for ${app.name}: ${lastError.message}`);
      attempts++;
      if (attempts > MAX_RETRIES) {
        handleAppError(lastError, app);
        return; // All retries exhausted
      }
      // Wait a bit before retrying (optional, but good practice for retries)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
