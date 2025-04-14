import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Try to get the post with both original slug and without -log suffix
        const cleanSlug = slug.endsWith('-log') ? slug.slice(0, -4) : slug;
        console.log(`Fetching post: /posts/${cleanSlug}.json`);
        let response = await fetch(`/posts/${cleanSlug}.json`);
        
        // If that fails, try with -log suffix
        if (!response.ok && !slug.endsWith('-log')) {
          console.log(`Trying alternative: /posts/${slug}-log.json`);
          response = await fetch(`/posts/${slug}-log.json`);
        }
        
        if (!response.ok) {
          console.error(`Response not OK: ${response.status} ${response.statusText}`);
          
          // If the post isn't found, try to redirect to the doc version
          if (response.status === 404) {
            // Try to fetch the doc version
            const docResponse = await fetch(`/docs/${cleanSlug}.json`);
            if (docResponse.ok) {
              navigate(`/docs/${cleanSlug}`);
              return;
            }
          }
          
          throw new Error(`Post not found (${response.status})`);
        }
        
        const data = await response.json();
        console.log('Post data:', data);
        setPost(data);
        
        // Fetch related posts based on tags
        if (data.tags && data.tags.length > 0) {
          fetchRelatedPosts(data.tags, data.slug);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchRelatedPosts = async (tags, currentSlug) => {
      try {
        const response = await fetch('/posts.json');
        if (response.ok) {
          const allPosts = await response.json();
          // Find posts with matching tags, excluding current post
          const related = allPosts
            .filter(p => 
              p.slug !== currentSlug && 
              p.tags && 
              p.tags.some(tag => tags.includes(tag))
            )
            .slice(0, 3); // Get top 3 related posts
          
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };
    
    if (slug) {
      window.scrollTo(0, 0);
      fetchPost();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="container py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Error: {error}</h2>
          <p className="mb-6 text-gray-600">We couldn't load the post you were looking for.</p>
          <Link to="/blog" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="mb-6 text-gray-600">The post you're looking for doesn't seem to exist.</p>
          <Link to="/blog" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.date ? 
    new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }) : '';

  // Calculate estimated reading time
  const wordsPerMinute = 200;
  const wordCount = post.content ? post.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero header for the post */}
      <div className="bg-white shadow-sm">
        <div className="container py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-blue-600 hover:underline mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all posts
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
              {formattedDate && (
                <div className="flex items-center mr-6 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time>{formattedDate}</time>
                </div>
              )}
              
              <div className="flex items-center mr-6 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readingTime} min read</span>
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {post.description && (
              <p className="text-lg text-gray-600 border-l-4 border-blue-600 pl-4 py-2">
                {post.description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <article className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={post.content} />
              </div>
            </div>
            
            {/* Footer with CTA */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">Want the complete version?</h3>
                  <p className="text-gray-600">Read the full in-depth article in our docs section.</p>
                </div>
                <Link 
                  to={`/docs/${post.slug?.replace('-log', '') || slug}`} 
                  className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Read full article
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
          
          {/* Related posts section */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Related Topics</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.slug} 
                    to={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5"
                  >
                    <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
