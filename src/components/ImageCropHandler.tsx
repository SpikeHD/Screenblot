import { Component } from 'preact'

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
    }

    document.body.onmousemove = (e) => {
      if (!this.state.dragging) return;

      // Draw a red rectangle around the selection using this.state.selection.start and the current mouse pos
    }
  }

  render() {
    return (
      <img draggable={false} src={this.props.image || ''} />
    )
  }
}