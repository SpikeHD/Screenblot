import { Component } from 'preact'

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
}

export default class ImageCropHandler extends Component<IProps, IState> {
  constructor() {
    super()

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
      }
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
      }, () => console.log(this.state))

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
      }, () => console.log(this.state))

      // Flash the selection element background for 0.1 seconds, then remove
      const div = document.getElementById('DragSelection')
      if (div) {
        // Set background color to white and then fade out
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
        div.style.transition = 'background-color 0.1s'
        setTimeout(() => {
          div.remove()
        }, 100)
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
  }

  render() {
    return (
      <img draggable={false} src={this.props.image || ''} />
    )
  }
}