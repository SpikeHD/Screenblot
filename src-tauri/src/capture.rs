use tauri;

use screenshots::Screen;
use minifb::{Key, Window, WindowOptions};

fn capture_screenshot() {
  // All screens
  let scrns = Screen::all();

  // Take a capture of the first screen
  let screen = scrns.get(0).unwrap();

  // Capture entire screen
  let image = screen.capture().unwrap();
  let image_buf = image.buffer();

  let width = image.width() as usize;
  let height = image.height() as usize;

  let mut buf: Vec<u32> = vec![0; width * height];

  // Create a window
  let mut window = Window::new(
    "Capture",
    width,
    height,
    WindowOptions::default()
  ).unwrap();

  while window.is_open() && !window.is_key_down(Key::Escape) {
    // Convert image_buf (3 elements per pixel) to buf (1 element per pixel)
    for i in 0..image_buf.len() {
      buf[i] = image_buf[i * 3] << 16 | image_buf[i * 3 + 1] << 8 | image_buf[i * 3 + 2] | 255;
    }

    // Write the image to the window
    window.update_with_buffer(&pixels, width, height).unwrap();
  }
}

#[tauri::command]
pub fn take_screenshot() {
  capture_screenshot();
}