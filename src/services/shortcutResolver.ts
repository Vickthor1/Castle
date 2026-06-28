import fs from "fs";
import path from "path";

/**
 * Resolve arquivos .lnk para o caminho real
 * Usando PowerShell (Windows nativo)
 */
export function resolveShortcut(shortcutPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `
      $WshShell = New-Object -ComObject WScript.Shell;
      $Shortcut = $WshShell.CreateShortcut('${shortcutPath.replace(/'/g, "''")}');
      Write-Output $Shortcut.TargetPath;
    `;

    const { exec } = require("child_process");

    exec(`powershell -command "${command}"`, (err: any, stdout: string) => {
      if (err) {
        reject(err);
        return;
      }

      const result = stdout.trim();

      if (!result) {
        reject(new Error("Não foi possível resolver o atalho."));
        return;
      }

      resolve(result);
    });
  });
}
