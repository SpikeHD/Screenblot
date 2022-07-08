import { window } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

export async function setSmall() {
  appWindow.setSize(new window.LogicalSize(300, 150));
}