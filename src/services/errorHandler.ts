import { dialog } from "electron";
import { AppItem } from "./appRunner";

export function handleAppError(error: Error, app?: AppItem) {
  console.error("[APP RUN ERROR]", error);

  dialog.showMessageBox({
    type: "error",
    title: "Erro ao abrir aplicativo",
    message: `Não foi possível abrir: ${app?.name || "Aplicativo"}`,
    detail: error.message,
    buttons: ["OK", "Alterar Caminho"],
  });
}
