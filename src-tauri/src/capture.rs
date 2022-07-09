use std::{fs};
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

    // Wait a fraction of a second to allow minimization to complete
    std::thread::sleep(std::time::Duration::from_millis(600));

    let filename = capture_screenshot(path);
    window.emit("finish_screenshot", filename).unwrap();
  });
}

#[tauri::command]
pub fn save_crop(path: String, image_name: String, x: i32, y: i32, width: i32, height: i32) {
  let mut path_buf = std::path::PathBuf::from(&path);

  // Create path if it doesn't exist
  if fs::metadata(&path_buf).is_err() {
    fs::create_dir_all(&path_buf).unwrap();
  }

  // Push filename to path buffer
  path_buf.push(&image_name);

  println!("{}", path_buf.to_str().unwrap());
  println!("Filename: {}", path_buf.file_name().unwrap().to_str().unwrap());

  // Get image from cache
  let image = fs::read(&path_buf).unwrap();
  let mut loaded_image = match image::load_from_memory(&image) {
    Ok(image) => image,
    Err(e) => {
      println!("{}", e);
      return;
    }
  };

  // Crop image
  let cropped_image = loaded_image.crop(x as u32, y as u32, width as u32, height as u32);
  let cropped_buffer = cropped_image.as_bytes();

  // Write buffer to file in .cache (just add crop_ to filename)
  let new_filename = format!("crop_{}", path_buf.file_name().unwrap().to_str().unwrap());
  
  path_buf.set_file_name(&new_filename);

  println!("Writing new image to : {}", path_buf.to_str().unwrap());

  image::save_buffer(path_buf, cropped_buffer, width as u32, height as u32, image::ColorType::Rgba8).unwrap();
}