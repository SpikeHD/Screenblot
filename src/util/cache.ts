import { dataDir } from "@tauri-apps/api/path"

export async function getCacheDir() {
  return (await dataDir()) + 'ScreenBlot/.cache/'
}