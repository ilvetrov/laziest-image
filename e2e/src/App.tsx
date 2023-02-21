import { useCallback, useMemo } from 'react'
import LazyBackground from '../../src/components/LazyBackground'
import LazyImage from '../../src/components/LazyImage'
import './App.css'
import DataText from './utils/DataText'
import { createImages } from './utils/createImages'
import WithState from './utils/WithState'

function App() {
  return (
    <div className="App">
      <h2>With sizes</h2>
      {createImages('with-sizes').map((image, index) => (
        <LazyImage
          key={image.id}
          src={image.src}
          width={image.width}
          height={image.height}
        ></LazyImage>
      ))}

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

      <h2>Default</h2>
      {createImages('default').map((image, index) => (
        <LazyImage key={image.id} src={image.src}></LazyImage>
      ))}

      <h2>Background</h2>
      {createImages('background').map((image, index) => (
        <LazyBackground
          key={image.id}
          src={image.src}
          id={`background-${index}`}
          className="background"
        ></LazyBackground>
      ))}

      <h2>DataText</h2>
      <DataText>
        {(show) =>
          createImages('data-text', 1).map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              width={image.width}
              height={image.height}
            ></LazyImage>
          ))
        }
      </DataText>

      <h2>DataText Background</h2>
      <DataText>
        {(show) =>
          createImages('data-text-background', 1).map((image) => (
            <LazyBackground
              key={image.id}
              src={image.src}
              id="data-text-background"
              className="background"
            ></LazyBackground>
          ))
        }
      </DataText>

      <h2>Default with events</h2>
      <DataText>
        {(appendText) =>
          createImages('default-with-events', 1).map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              onLoad={useCallback((src: string) => appendText(`load: ${src}`), [])}
              onFirstLoad={useCallback((src: string) => appendText(`firstLoad: ${src}`), [])}
              onSrcChange={useCallback((src: string) => appendText(`srcChange: ${src}`), [])}
            ></LazyImage>
          ))
        }
      </DataText>

      <h2>Default with srcSet</h2>
      <DataText>
        {(appendText) =>
          createImages('default-with-src-set', 1).map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              srcSet={`${image.src}?w=200 200w, ${image.src}?w=500 500w, ${image.src} 1000w`}
              sizes="(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw"
              onLoad={useCallback((src: string) => appendText(`load: ${src}`), [])}
              onFirstLoad={useCallback((src: string) => appendText(`firstLoad: ${src}`), [])}
              onSrcChange={useCallback((src: string) => appendText(`srcChange: ${src}`), [])}
            ></LazyImage>
          ))
        }
      </DataText>

      <h2>Background with srcSet</h2>
      <DataText>
        {(appendText) =>
          createImages('background-with-src-set', 1).map((image) => (
            <LazyBackground
              key={image.id}
              src={image.src}
              srcSet={`${image.src}?w=200 200w, ${image.src}?w=500 500w, ${image.src} 1000w`}
              sizes="(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw"
              onLoad={useCallback((src: string) => appendText(`load: ${src}`), [])}
              onFirstLoad={useCallback((src: string) => appendText(`firstLoad: ${src}`), [])}
              onSrcChange={useCallback((src: string) => appendText(`srcChange: ${src}`), [])}
              id="background-with-src-set"
              className="background"
            ></LazyBackground>
          ))
        }
      </DataText>

      <h2>Manual changes Background</h2>
      <DataText>
        {(appendText) => (
          <WithState state={0}>
            {(current, setCurrent) => (
              <>
                {createImages(`manual-changes-background-${current}`, 1).map((image, index) => (
                  <LazyBackground
                    key={index}
                    src={image.src}
                    srcSet={`${image.src}?w=200 200w, ${image.src}?w=500 500w, ${image.src} 1000w`}
                    sizes="(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw"
                    onLoad={useCallback((src: string) => appendText(`load: ${src}`), [])}
                    onFirstLoad={useCallback((src: string) => appendText(`firstLoad: ${src}`), [])}
                    onSrcChange={useCallback((src: string) => appendText(`srcChange: ${src}`), [])}
                    id="manual-changes-background"
                    className="background"
                  ></LazyBackground>
                ))}
                <button
                  id="manual-changes-background-increaser"
                  onClick={() => setCurrent((oldCurrent) => oldCurrent + 1)}
                >
                  Increase. Current: {current}
                </button>
              </>
            )}
          </WithState>
        )}
      </DataText>

      <h2>Manual changes Default with Custom</h2>
      <DataText>
        {(appendText) => (
          <WithState state={0}>
            {(current, setCurrent) => (
              <>
                {createImages(`manual-changes-default-custom-${current}`, 1).map((image, index) => (
                  <LazyImage
                    key={index}
                    src={image.src}
                    onLoad={useCallback((src: string) => appendText(`load: ${src}`), [])}
                    onFirstLoad={useCallback((src: string) => appendText(`firstLoad: ${src}`), [])}
                    onSrcChange={useCallback((src: string) => appendText(`srcChange: ${src}`), [])}
                    width={image.width}
                    height={image.height}
                  ></LazyImage>
                ))}
                <button
                  id="manual-changes-increaser"
                  onClick={() => setCurrent((oldCurrent) => oldCurrent + 1)}
                >
                  Increase. Current: {current}
                </button>
              </>
            )}
          </WithState>
        )}
      </DataText>

      <h2>Manual changes Default</h2>
      <DataText>
        {(appendText) => (
          <WithState state={0}>
            {(current, setCurrent) => (
              <>
                {createImages(`manual-changes-default-${current}`, 1).map((image, index) => (
                  <LazyImage
                    key={index}
                    src={image.src}
                    onLoad={useCallback((src: string) => appendText(`load: ${src}`), [])}
                    onFirstLoad={useCallback((src: string) => appendText(`firstLoad: ${src}`), [])}
                    onSrcChange={useCallback((src: string) => appendText(`srcChange: ${src}`), [])}
                    width={image.width}
                    height={image.height}
                  ></LazyImage>
                ))}
                <button
                  id="manual-changes-increaser"
                  onClick={() => setCurrent((oldCurrent) => oldCurrent + 1)}
                >
                  Increase. Current: {current}
                </button>
              </>
            )}
          </WithState>
        )}
      </DataText>
    </div>
  )
}

export default App
