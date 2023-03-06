import { VirtualImage } from '../../src/core/LazyImage/VirtualImage'
import { ExtraWindow } from './core/ExtraWindow'
import { componentNames } from './core/ComponentNames'

export const extraWindow = ExtraWindow({
  VirtualImage,
  components: componentNames([
    ['Image', 'Background'],
    ['Default', 'Custom'],
    ['SrcSet', 'NoSrcSet'],
    ['AfterPageLoad', ''],
  ] as const),
})
