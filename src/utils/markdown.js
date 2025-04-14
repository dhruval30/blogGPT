// src/utils/markdown.js
import matter from 'gray-matter';

export function parseMarkdown(markdown) {
  try {
    const { data, content } = matter(markdown);
    return {
      ...data,
      content
    };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return null;
  }
}
export async function getAllPosts() {
  // In a production app, this would be generated at build time
  // or fetched from an API endpoint that reads your content directory
  const postFiles = import.meta.glob('/content/blog/*.md');
  const posts = [];

  for (const path in postFiles) {
    const file = await postFiles[path]();
    const slug = path.split('/').pop().replace('.md', '');
    const post = parseMarkdown(file.default);
    
    if (post) {
      posts.push({
        ...post,
        slug,
      });
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getAllDocs() {
  // Similar to getAllPosts but for documentation
  const docFiles = import.meta.glob('/content/docs/*.md');
  const docs = [];

  for (const path in docFiles) {
    const file = await docFiles[path]();
    const slug = path.split('/').pop().replace('.md', '');
    const doc = parseMarkdown(file.default);
    
    if (doc) {
      docs.push({
        ...doc,
        slug,
      });
    }
  }

  return docs.sort((a, b) => {
    // Sort by sidebar_position if available
    if (a.sidebar_position && b.sidebar_position) {
      return a.sidebar_position - b.sidebar_position;
    }
    // Fall back to alphabetical
    return a.title.localeCompare(b.title);
  });
}