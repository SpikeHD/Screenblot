import { Component } from 'preact';

import Camera from '../icons/camera.svg';

import './TopBar.css';

export default class Topbar extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="TopBar">
        <div id="CaptureButton">
          <Camera />
        </div>
      </div>
    )
  }
}