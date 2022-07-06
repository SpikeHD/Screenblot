import { Component } from 'preact';

import Camera from '../icons/camera.svg';

import './TopBar.css';

export default class Topbar extends Component {
  constructor() {
    super()
  }

  handleBeginCapture() {
    console.log('begin capture');
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