// src/components/BlogLayout.jsx

import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function BlogLayout() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts.json');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Group posts by month/year for better organization
  const groupedPosts = posts.reduce((acc, post) => {
    if (!post.date) return acc;

    const date = new Date(post.date);
    const monthYear = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(post);
    return acc;
  }, {});

  // Sort months in reverse chronological order
  const sortedMonths = Object.keys(groupedPosts).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  return (
    <div className="container py-10">
      <div className="flex flex-col lg:flex-row">
        <aside className="lg:w-1/4 lg:pr-8 mb-8 lg:mb-0">
          <div className="sticky top-8">
            <h3 className="text-lg font-medium mb-4">blogGPT Blog</h3>

            {loading ? (
              <p className="text-gray-500">Loading posts...</p>
            ) : (
              <nav className="space-y-6">
                {sortedMonths.map(monthYear => (
                  <div key={monthYear}>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{monthYear}</h4>
                    <ul className="space-y-2">
                      {groupedPosts[monthYear].map(post => (
                        <li key={post.slug}>
                          <Link
                            to={`/blog/${post.slug}`}
                            className={`block text-sm hover:text-blue-600 truncate ${
                              location.pathname === `/blog/${post.slug}`
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-700'
                            }`}
                          >
                            {post.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            )}
          </div>
        </aside>

        <main className="lg:w-3/4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
