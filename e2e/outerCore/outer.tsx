import { VirtualImage } from '../../src/core/LazyImage/VirtualImage'
import { ExtraWindow } from './core/ExtraWindow'
import { componentNames } from './core/ComponentNames'
import LazyImage from '../../src/components/LazyImage'
import LazyBackground from '../../src/components/LazyBackground'

function sizesGet(src: string): { srcSet: string; sizes: string } {
  return {
    srcSet: `${src}?w=200 200w, ${src}?w=500 500w, ${src} 1000w`,
    sizes: '(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw',
  }
}

const components = [
  [
    { name: 'Image', rule: () => LazyImage },
    { name: 'Background', rule: () => LazyBackground },
  ],
  [
    { name: 'Default', rule: (args: any) => args },
    { name: 'Custom', rule: (args: any) => ({ ...args, customLoading: true }) },
  ],
  [
    { name: 'SrcSet', rule: (args: { src: string }) => ({ ...args, ...sizesGet(args.src) }) },
    { name: 'NoSrcSet', rule: (args: any) => args },
  ],
  [
    { name: 'AfterPageLoad', rule: (args: any) => ({ ...args, afterPageLoad: true }) },
    { name: 'NoAfterPageLoad', rule: (args: any) => args },
  ],
] as const

const types = [
  ['Image', 'Background'],
  ['Default', 'Custom'],
  ['SrcSet', 'NoSrcSet'],
  ['AfterPageLoad', ''],
] as const

export const extraWindow = ExtraWindow({
  VirtualImage,
  components: componentNames(types),
})
