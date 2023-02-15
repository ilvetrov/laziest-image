import { useMemo } from 'react'
import LazyBackground from '../../src/components/LazyBackground'
import LazyImage from '../../src/componentsFP/LazyImage'
import useOnce from '../../src/hooks/useOnce'
import './App.css'
import Controlled from './utils/Controlled'
import { createImages } from './utils/createImages'

function App() {
  return (
    <div className="App">
      <h2>After page load</h2>
      {createImages('after-page-load').map((image, index) => (
        <LazyImage
          key={image.id}
          src={image.src}
          srcSet={`${image.src}?w=200 200w, ${image.src}?w=500 500w, ${image.src} 1000w`}
          sizes="(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw"
          width={image.width}
          height={image.height}
          afterPageLoad
        ></LazyImage>
      ))}

      <h2>With sizes</h2>
      {createImages('with-sizes').map((image, index) => (
        <LazyImage
          key={image.id}
          src={image.src}
          width={image.width}
          height={image.height}
        ></LazyImage>
      ))}

      <h2>Default</h2>
      {createImages('default').map((image, index) => (
        <LazyImage key={image.id} src={image.src}></LazyImage>
      ))}

      <h2>Background</h2>
      {createImages('background').map((image, index) => (
        <LazyBackground
          id={`background-${index}`}
          key={image.id}
          src={image.src}
          className="background"
        ></LazyBackground>
      ))}

      <h2>Controlled</h2>
      <Controlled id="controlled" defaultShow={false}>
        {(show) =>
          createImages('controlled', 1).map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              width={image.width}
              height={image.height}
            ></LazyImage>
          ))
        }
      </Controlled>

      <h2>Controlled Background</h2>
      <Controlled id="controlled-background" defaultShow={false}>
        {(show) =>
          createImages('controlled-background', 1).map((image) => (
            <LazyBackground
              id="controlled-background"
              key={image.id}
              src={image.src}
              className="background"
            ></LazyBackground>
          ))
        }
      </Controlled>

      <h2>Default with events</h2>
      <Controlled id="default-with-events">
        {(show, setText) =>
          createImages('default-with-events', 1).map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              onLoad={(src) => setText(`load: ${src}`)}
              onFirstLoad={(src) => setText(`firstLoad: ${src}`)}
              onSrcChange={(src) => setText(`srcChange: ${src}`)}
            ></LazyImage>
          ))
        }
      </Controlled>

      <h2>Default with srcSet</h2>
      <Controlled id="default-with-src-set">
        {(show, setText) =>
          createImages('default-with-src-set', 1).map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              srcSet={`${image.src}?w=200 200w, ${image.src}?w=500 500w, ${image.src} 1000w`}
              sizes="(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw"
              onLoad={(src) => setText(`load: ${src}`)}
              onFirstLoad={(src) => setText(`firstLoad: ${src}`)}
              onSrcChange={(src) => setText(`srcChange: ${src}`)}
            ></LazyImage>
          ))
        }
      </Controlled>

      <h2>Background with srcSet</h2>
      <Controlled id="background-with-src-set">
        {(show, setText) =>
          createImages('background-with-src-set', 1).map((image) => (
            <LazyBackground
              id="background-with-src-set"
              key={image.id}
              src={image.src}
              srcSet={`${image.src}?w=200 200w, ${image.src}?w=500 500w, ${image.src} 1000w`}
              sizes="(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw"
              onLoad={(src) => setText(`load: ${src}`)}
              onFirstLoad={(src) => setText(`firstLoad: ${src}`)}
              onSrcChange={(src) => setText(`srcChange: ${src}`)}
              className="background"
            ></LazyBackground>
          ))
        }
      </Controlled>
    </div>
  )
}

export default App
