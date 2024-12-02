import { defineConfig } from 'vite';
import { viteDistCopy } from './plugins/vite-plugin-dist-copy';

export default defineConfig({
    plugins: [
        viteDistCopy({
            verbose: true,
        }),
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
        },
    },
});
