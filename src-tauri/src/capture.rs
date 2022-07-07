use std::{io::Write, fs};
use rand::prelude::*;

use tauri;

use screenshots::Screen;
// use minifb::{Key, Window, WindowOptions};

fn capture_screenshot() {
  // All screens
  let scrns = Screen::all();

  // Take a capture of the first screen
  let screen = scrns.get(0).unwrap();

  // Capture entire screen
  let image = screen.capture().unwrap();

  // Write buffer to file in .cache (random name)
  let mut rng = rand::thread_rng();
  let num: u32 = rng.gen();

  let filename = format!("{}.png", num);
  let path = format!(".cache/{}", filename);
  fs::write(path, image.buffer());
}

#[tauri::command]
pub fn take_screenshot() {
  capture_screenshot();
}