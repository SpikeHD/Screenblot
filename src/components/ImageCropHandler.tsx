import { invoke, window } from '@tauri-apps/api'
import { cacheDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { Component } from 'preact'
import { getCacheDir } from '../util/cache';
import { registerCtrlZ } from '../util/keycombos';

import './ImageCropHandler.css'

interface IProps {
  image: string
}

interface IState {
  dragging: boolean
  selection: {
    start: {
      x: number,
      y: number
    },
    end: {
      x: number,
      y: number
    }
  }
  cropLoading: boolean
  image: string
  imageHistory: {
    image: string,
    size: window.LogicalSize
  }[]
}

export default class ImageCropHandler extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      dragging: false,
      selection: {
        start: {
          x: 0,
          y: 0,
        },
        end: {
          x: 0,
          y: 0,
        },
      },
      cropLoading: false,
      image: props.image,
      imageHistory: [],
    }

    // Create some drag-selection event handlers
    document.body.onmousedown = (e) => {
      // @ts-expect-error This is a regular JS event
      if (e && e.target.tagName.toLowerCase() !== 'img') return

      // @ts-expect-error This is a regular JS event
      const rect = e.target.getBoundingClientRect()

      this.setState({
        dragging: true,
        selection: {
          start: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
          end: {
            x: 0,
            y: 0,
          },
        },
      })

      // Create a div element that will be resized based on mouse position
      const div = document.createElement('div')
      div.style.position = 'absolute'
      div.style.top = '0'
      div.style.left = '0'
      div.style.width = '0'
      div.style.height = '0'
      
      div.id = 'DragSelection'

      document.body.appendChild(div)
    }

    document.body.onmouseup = (e) => {
      // @ts-expect-error This is a regular JS event
      if (e && e.target.tagName.toLowerCase() !== 'img') return

      // @ts-expect-error This is a regular JS event
      const rect = e.target.getBoundingClientRect()

      this.setState({
        dragging: false,
        selection: {
          start: this.state.selection.start,
          end: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
        },
      })

      // Flash the selection element background for 0.1 seconds, then remove
      const div = document.getElementById('DragSelection')
      if (div) {
        // Set background color to white and then fade out
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
        div.style.transition = 'background-color 0.1s'
        setTimeout(() => {
          div.remove()
        }, 100)

        // Save the cropped image
        this.saveImageInSelection()
      }
    }

    document.body.onmousemove = (e) => {
      if (!this.state.dragging) return;

      // Move and resize DragSelection based on start and current mouse position
      const div = document.getElementById('DragSelection')
      if (div) {
        // @ts-expect-error This is a regular JS event
        const rect = e.target.getBoundingClientRect()
  
        // Draw rect based on start and current mouse pos, taking rect into account
        div.style.left = `${this.state.selection.start.x + rect.left - 4}px`
        div.style.top = `${this.state.selection.start.y + rect.top - 4}px`
        div.style.width = `${e.clientX - rect.left - this.state.selection.start.x}px`
        div.style.height = `${e.clientY - rect.top - this.state.selection.start.y}px`
      }
    }

    // Create undo handler
    registerCtrlZ(document, async () => {
      if (this.state.imageHistory.length > 0) {
        const oldImg = this.state.imageHistory.pop()
        const newCurImg = this.state.imageHistory[this.state.imageHistory.length - 1]

        this.setState({
          image: (await getCacheDir()) + newCurImg.image,
          imageHistory: this.state.imageHistory,
        })

        if (oldImg) appWindow.setSize(oldImg.size)
      }
    })
  }

  async componentDidMount() {
    this.setState({
      imageHistory: [
        {
          image: ImageCropHandler.getImageFilename(this.props.image),
          size: await appWindow.innerSize()
        }
      ]
    })
  }

  static getImageFilename(path: string) {
    const image = path.replace(/\\/g, '/').split('/').pop() || ''
    return image
  }

  componentWillUnmount() {
    // Remove all event handlers
    document.body.onmousedown = null
    document.body.onmouseup = null
    document.body.onmousemove = null
  }

  async saveImageInSelection() {
    const { start, end } = this.state.selection
    const { image } = this.state

    // Get img element calculated size and actual size to get ratio
    const img = document.querySelector('.ImagePreview img') as HTMLImageElement
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight
    const imgActualWidth = img.width
    const imgActualHeight = img.height

    // Get selection size and actual size to get ratio
    const selection = document.getElementById('DragSelection') as HTMLDivElement

    // Calculate the ratio of the selection to the image
    const ratio = {
      x: imgWidth / imgActualWidth,
      y: imgHeight / imgActualHeight
    }

    // Calculate the selection size in pixels
    const selectionWidth = selection.offsetWidth * ratio.x
    const selectionHeight = selection.offsetHeight * ratio.y

    // Calculate the selection start and end in pixels
    const selectionStartX = start.x * ratio.x
    const selectionStartY = start.y * ratio.y

    // Set img to loading
    this.setState({
      cropLoading: true,
    })

    const newImg = await invoke('save_crop', {
      path: await cacheDir(),
      imageName: image, 
      x: Math.round(selectionStartX),
      y: Math.round(selectionStartY),
      width: Math.round(selectionWidth),
      height: Math.round(selectionHeight),
    })

    this.setState({
      cropLoading: false,
      image: newImg as string !== '' ? (await getCacheDir()) + newImg as string : this.state.image,
      imageHistory: [...this.state.imageHistory, {
        image: newImg as string,
        size: await appWindow.innerSize()
      }],
    })

    // Adjust window size to fit the image
    appWindow.setSize(
      new window.LogicalSize(selectionWidth * 1.2, selectionHeight * 1.2),
    )
  }

  render() {
    return (
      <img className={this.state.cropLoading ? 'loading' : ''} draggable={false} src={convertFileSrc(this.state.image) || ''} />
    )
  }
}