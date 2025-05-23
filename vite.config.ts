
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add proper aliases for TipTap ProseMirror dependencies
      '@tiptap/pm/state': 'prosemirror-state',
      '@tiptap/pm/view': 'prosemirror-view',
      '@tiptap/pm/model': 'prosemirror-model',
      '@tiptap/pm/transform': 'prosemirror-transform'
    },
  },
  build: {
    rollupOptions: {
      // We don't need to externalize these anymore since we're using aliases
    }
  },
  optimizeDeps: {
    include: [
      '@tiptap/core',
      '@tiptap/starter-kit',
      'prosemirror-state',
      'prosemirror-view',
      'prosemirror-model',
      'prosemirror-transform'
    ]
  },
  // Ensure the app works with any base path by setting this to '/'
  base: '/',
}));
