#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;

mod capture;

fn main() {
  init_dirs();

  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      capture::take_screenshot
    ])
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default(&context.package_info().name)
    } else {
      tauri::Menu::default()
    })
    .run(context)
    .expect("error while running tauri application");
}

fn init_dirs() {
  // Create a folder named .cache
  let mut cache_dir = fs::create_dir_all(".cache").unwrap();
}