import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import { Component } from 'preact';

import Camera from '../icons/camera.svg';

import './TopBar.css';

export default class Topbar extends Component {
  constructor() {
    super()
  }

  handleBeginCapture() {
    appWindow.minimize();

    //invoke('beginCapture');
    invoke('take_screenshot');
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