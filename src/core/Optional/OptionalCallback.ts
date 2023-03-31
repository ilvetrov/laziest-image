export function OptionalCallback(callback: (() => void) | void | undefined | null): () => void {
  if (callback) {
    return callback
  }

  return emptyCallback
}

function emptyCallback() {}
