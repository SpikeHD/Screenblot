import ImagePreview from './components/ImagePreview';
import TopBar from './components/TopBar';

import './index.css'
import { setSmall } from './util/windowSize';

export class App {
  render() {
    setSmall();

    return (
      <div>
        <TopBar />
        <ImagePreview />
      </div>
    );
  }
}
