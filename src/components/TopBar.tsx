import { Component } from 'preact';

import Close from '../icons/close.svg';
import './TopBar.css';

export default class Topbar extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="TopBar">
        <div id="AppName">
          ScreenBlot
        </div>

        <div id="ButtonMenu">
          <Close />
        </div>
      </div>
    )
  }
}