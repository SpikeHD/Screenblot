use std::io::Write;

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

  // Convert the buffer to a decoded PNG
  let image_decode = png::Decoder::new(std::io::BufReader::new(image.buffer().as_ref() as &[u8]));
  let mut reader = image_decode.read_info().unwrap();

  // Create a buffer based on the decoded PNG
  let mut buf = vec![0; reader.output_buffer_size()];

  // Read the next frame
  reader.next_frame(&mut buf).unwrap();

  let width = image.width() as usize;
  let height = image.height() as usize;

  let u32_buffer: Vec<u32> = buf
    .chunks(4)
    .map(|v| ((v[0] as u32) << 16) | ((v[1] as u32) << 8) | v[2] as u32)
    .collect();

  // Create a window
  let mut window = Window::new(
    "Capture",
    width,
    height,
    WindowOptions::default()
  ).unwrap();

  while window.is_open() && !window.is_key_down(Key::Escape) {
    // Write the image to the window
    window.update_with_buffer(&u32_buffer, width, height).unwrap();
  }
}

#[tauri::command]
pub fn take_screenshot() {
  capture_screenshot();
}