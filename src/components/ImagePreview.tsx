import { listen } from '@tauri-apps/api/event'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { Component } from 'preact'
import { getCacheDir } from '../util/cache';
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

      // Maximize
      appWindow.setFocus()
    })

    // Watch for screenshot events
    listen('finish_screenshot', async ({ payload }) => {
      const dir = await getCacheDir()

      this.setState({
        image: convertFileSrc(dir + payload as string),
        loading: false,
        error: null,
      })
    })
  }

  render() {
    return (
      <div className="ImagePreview">
        {
          this.state.loading ?
            <div>Loading...</div>
            
            : this.state.image ?
            
            <div id="ImageContainer">
              <img src={this.state.image || ''} />
            </div> : null
        }
      </div>
    )
  }

}