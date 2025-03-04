import { vite } from '@darkobits/ts';


export default vite.node({
  test: {
    coverage: {
      exclude: [
        '**/index.ts',
        '**/etc/types.ts'
      ]
    }
  }
});
