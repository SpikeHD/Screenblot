use std::{io::Write, fs};
use rand::prelude::*;

use tauri;

use screenshots::Screen;
// use minifb::{Key, Window, WindowOptions};

fn capture_screenshot(path: String) -> String {
  let mut path_buf = std::path::PathBuf::from(&path);

  // All screens
  let scrns = Screen::all();

  // Take a capture of the first screen
  let screen = scrns.get(0).unwrap();

  // Capture entire screen
  let image = screen.capture().unwrap();

  // Write buffer to file in .cache (random name)
  let mut rng = rand::thread_rng();
  let num: u32 = rng.gen();

  // Create path if it doesn't exist
  if fs::metadata(&path_buf).is_err() {
    fs::create_dir_all(&path_buf).unwrap();
  }

  let filename = format!("{}.png", num);
  
  // Push filename to path buffer
  path_buf.push(&filename);

  fs::write(&path_buf, image.buffer());

  return filename;
}

#[tauri::command]
pub fn take_screenshot(window: tauri::Window, path: String) {
  // Run in new thread to avoid blocking, emit screenshot event when done
  std::thread::spawn(move || {
    window.emit("begin_screenshot", "").unwrap();
    let filename = capture_screenshot(path);
    window.emit("finish_screenshot", filename).unwrap();
  });
}