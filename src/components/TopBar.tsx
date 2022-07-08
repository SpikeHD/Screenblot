import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { Component } from 'preact';

import Camera from '../icons/camera.svg';
import { getCacheDir } from '../util/cache';
import ImagePreview from './ImagePreview';

import './TopBar.css';

export default class Topbar extends Component {
  constructor() {
    super()
  }

  async handleBeginCapture() {
    await appWindow.minimize();

    invoke('take_screenshot', {
      path: await getCacheDir(),
    });
  }

  render() {
    return (
      <div className="TopBar">
        <div id="CaptureButton" onClick={this.handleBeginCapture}>
          <Camera />
        </div>
      </div>
    )
  }
}