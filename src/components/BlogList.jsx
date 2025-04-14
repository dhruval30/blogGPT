// src/components/BlogList.jsx
import { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts.json');
        const data = await response.json();

        // Sort posts by date (newest first)
        const sortedPosts = data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );

        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-gray-600">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="py-10 text-center text-gray-600">No posts found.</div>;
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
      <div className="py-6 text-center">
        <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
          View More
        </button>
      </div>
    </div>
  );
}
