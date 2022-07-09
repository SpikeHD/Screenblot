import { window } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window';
import { Component } from 'preact'
import { getCacheDir } from '../util/cache';
import ImageCropHandler from './ImageCropHandler';
import './ImagePreview.css'

interface IState {
  image: string | null
  loading: boolean
  error: null
}

export default class ImagePreview extends Component<{}, IState> {
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
    })

    // Watch for screenshot events
    listen('finish_screenshot', async ({ payload }) => {
      const dir = await getCacheDir()

      this.setState({
        image: dir + payload,
        loading: false,
        error: null,
      })

      // Bring into foreground
      await appWindow.unminimize();
      await appWindow.setFocus();

      await this.setWindowAndImageSize();
    })
  }

  async setWindowAndImageSize() {
    const winSize = (await window.currentMonitor())?.size

    if (winSize) {
      // Reduce the size we are about to set the window
      const x = winSize.width / 1.2
      const y = winSize.height / 1.2

      // Set the window size
      await appWindow.setSize(new window.LogicalSize(x, y)).catch(e => console.log(e));

      // Center window
      await appWindow.center().catch(e => console.log(e));
    }
  }

  render() {
    return (
      <div className="ImagePreview">
        {
          this.state.loading ?
            <div>Loading...</div>
            : this.state.image ?
              <ImageCropHandler image={this.state.image} /> : null
        }
      </div>
    )
  }

}