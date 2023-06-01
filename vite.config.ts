import { vite } from '@darkobits/ts';


export default vite.library({
  test: {
    coverage: {
      exclude: [
        '**/index.ts',
        '**/etc/types.ts'
      ]
    }
  }
});
