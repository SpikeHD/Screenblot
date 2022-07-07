import ImagePreview from './components/ImagePreview';
import TopBar from './components/TopBar';

import './index.css'

export class App {
  render() {
    return (
      <div>
        <TopBar />
        <ImagePreview />
      </div>
    );
  }
}
