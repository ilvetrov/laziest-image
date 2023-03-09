<p>
  <img src="https://raw.githubusercontent.com/ilvetrov/laziest-image/ease-of-use/logo.svg" width="260" height="149" />
</p>

# Laziest image

The image loader to give you full control over image load.

:heart: ...and reduce all annoying work, of course.

### Benefits
- [:fire: **`srcSet` and `sizes` for background.**](#srcset-and-sizes)
- The image behind the screen *horizontally* now only loads when it's visible.
- No [layout shift](https://web.dev/cls/), just add width and height.
- Flag `priority` for [the LCP element](https://web.dev/lcp/).
- Auto placeholder for all loading images. No gray borders!
- :x::snowflake: No scroll freezes on background loading.
- Load events: `onLoad`, `onFirstLoad`, `onSrcChange`.
- SSR support.
- [Full customization of any load rule for you](#properties), thanks to declarative nature under the hood.
- :zap: **3.7 kB gzipped. No dependencies.**

### Technical sweets
- Uses native lazy loading when possible. And no, if not.
- IntersectionObserver instead of scroll listener.
- Renders a new src from background `srcSet` on resize only if the image is visible.
- By default: `loading="lazy"`, `decoding="async"` and `content-visibility="auto"`.

## Install

NPM:

```bash
npm i laziest-image
```

Yarn:

```bash
yarn add laziest-image
```

## Getting started

### `LazyImage` instead of `img`

It uses native lazy loading if the browser supports it. If not, custom lazy loading will be used.

```tsx
import { LazyImage } from 'laziest-image'

export function MyComponent() {
  return (
    <LazyImage
      src="/cats.jpg"
      width="1000"
      height="500"
    />
  )
}
```

To force custom loading, just add the flag:

```tsx
import { LazyImage } from 'laziest-image'

export function MyComponent() {
  return (
    <LazyImage
      src="/cats.jpg"
      width="1000"
      height="500"
      customLoading // <-- enables custom loading
    />
  )
}
```

### `LazyBackground`

Backgrounds are loaded with custom loading by default.

```tsx
import { LazyBackground } from 'laziest-image'

export function MyComponent() {
  return (
    <LazyBackground src="/cats.jpg">
      Your content
    </LazyBackground>
  )
}
```

#### `srcSet` and `sizes`

Just use it like inside `<img>`.

*I'm serious, just use it. This will work natively and be controlled by the browser under the hood. The library simply updates `backgroundImage` when the browser changes current src due to srcSet and sizes.*

```tsx
import { LazyBackground } from 'laziest-image'

export function MyComponent() {
  return (
    <LazyBackground
      src="/cats.jpg"
      srcSet="/cats-300.jpg 300w, /cats-1000.jpg 1000w"
      sizes="(max-width: 800px) 300px, 1000px"
    >
      Your content
    </LazyBackground>
  )
}
```

## Properties

You can use it to change the loading behavior.

- `customLoading`. Enable the custom loading.
  - Default: `false` for `LazyImage`. `true` for `LazyBackground`.

- `afterPageLoad`. Don't start loading until the entire page has loaded.
  - Example: if it's `true` and `customLoading` is also true, then the whole `customLoading` mechanism will only run after the page is loaded.

- `withoutBlank`. Disable the transparent blank image when it's not already loaded and browser can show gray borders of the empty `src`.
  - Default: `true` for `LazyBackground`.

- `onLoad`. Provide a callback function that will be called each time the image URL is loaded.
  - Example. The image has a `srcSet`. The function called. You then resize the browser window to the next breakpoint of `sizes`. The image changes url and the function called again.

- `onFirstLoad`. Provide a callback function that will only be called the first time the image URL is loaded.

- `onSrcChange`. Provide a callback function that will be called each time the image URL is loaded, except for the first load.

- `width` and `height`. Specify them to prevent layout shift.

- `priority`. Set it to the LCP image to load the image immediately.

...and all `<img>` tag properties for `<LazyImage>` and all `<div>` properties for `<LazyBackground>`.

### The Custom Loading properties:

- `yOffset`. Y-axis offset to start loading. `%` or `px` only. `%` is the percentage of the current viewport.
  - Example: `yOffset="0px"` to start loading only when the image has just "touched" the top or bottom of the screen.
  - Default: `200%`.

- `xOffset`. X-axis offset to start loading. Same as `yOffset` but horizontally.
  - Default: `50%`.

- `withoutWatchingSrcChange`. If `false`, the custom loaded image will change its `src` when the image URL changed due to `srcSet` and `sizes`.
  - Default: `true` for `LazyImage`, because the browser has native mechanism for changing src.

- `disabledPreload`. If disabled, the image will not be preloaded before being set to `src` (or `backgroundImage`) and `withoutWatchingSrcChange` will be `true`.
  - Default: `true` for `LazyImage`.

## Hook `useLazyImage`

This hook is used by the components under the hood. You can use it directly.

The components are like presets of properties.

*All [properties](#properties) are `false` by default for the `useLazyImage` hook.*

### Hook `useSrc`

This is a great hook to help you subscribe and unsubscribe src updates from the `useLazyImage` hook.

```tsx
const { src, loaded } = useSrc(useLazyImage(ref, props))

// Until the image is loaded,
// "loaded" will be false and
// "src" will be an empty string or with a blank (empty) image,
// depending on your properties.
```