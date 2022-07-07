import { listen } from '@tauri-apps/api/event'
import { dataDir } from '@tauri-apps/api/path';
import { appWindow } from '@tauri-apps/api/window';
import { Component } from 'preact'
import './ImagePreview.css'

export default class ImagePreview extends Component {
  constructor() {
    super()
    this.state = {
      image: null,
      loading: false,
      error: null,
    }

    listen("begin_screenshot", () => {
      this.setState({
        image: null,
        loading: true,
        error: null,
      })

      // Maximize
      appWindow.setFocus()
    })

    // Watch for screenshot events
    listen('finish_screenshot', async ({ payload }) => {
      const dir = (await dataDir()) + '/.cache/'

      this.setState({
        image: payload,
        loading: false,
        error: null,
      })
    })
  }

  render() {
    return (
      <div className="ImagePreview">

      </div>
    )
  }

}