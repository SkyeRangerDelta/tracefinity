import next from 'eslint-config-next'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...next,
  {
    rules: {
      // Tracefinity renders dynamic, cache-busted, and canvas-derived image URLs
      // (photos, masks, blob URLs) where next/image's optimizer is not applicable
      // and would break cache-busting / forced remounts. <img> is intentional here.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default config
