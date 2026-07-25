import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import matter from 'gray-matter'

const markdownFrontmatter = (): Plugin => ({
  name: 'markdown-frontmatter',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.md')) return null
    const { data, content } = matter(code)
    const payload = { data, content }
    return {
      code: `export default ${JSON.stringify(payload)}`,
      map: null,
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [markdownFrontmatter(), react()],
})
