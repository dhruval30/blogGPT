// src/pages/DocPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function DocPage() {
  const { slug } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedDocs, setRelatedDocs] = useState([]);

  useEffect(() => {
    // Fetch all docs for the sidebar
    const fetchAllDocs = async () => {
      try {
        const response = await fetch('/posts.json');
        if (response.ok) {
          const data = await response.json();
          setRelatedDocs(data.slice(0, 5)); // Take just a few for sidebar
        }
      } catch (err) {
        console.error('Failed to fetch related docs:', err);
      }
    };

    fetchAllDocs();
  }, []);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        // Remove -log suffix if it's there
        const cleanSlug = slug.endsWith('-log') ? slug.slice(0, -4) : slug;
        console.log(`Fetching document: /docs/${cleanSlug}.json`);
        const response = await fetch(`/docs/${cleanSlug}.json`);
        
        if (!response.ok) {
          console.error(`Response not OK: ${response.status} ${response.statusText}`);
          throw new Error(`Document not found (${response.status})`);
        }
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Invalid content type: ${contentType}`);
          throw new Error('Invalid document format');
        }
        
        try {
          const data = await response.json();
          console.log('Document data:', data);
          setDoc(data);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          throw new Error('Failed to parse document data');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchDoc();
    }
  }, [slug]);

  if (loading) {
    return <div className="container py-10 text-center">Loading document...</div>;
  }

  if (error) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-xl mb-4">Error: {error}</h2>
        <Link to="/docs" className="text-blue-600 hover:underline">
          Back to documentation
        </Link>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-xl mb-4">Document not found</h2>
        <Link to="/docs" className="text-blue-600 hover:underline">
          Back to documentation
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-1/4 md:pr-8 mb-8 md:mb-0">
          <div className="sticky top-8">
            <h3 className="text-lg font-medium mb-4">More Articles</h3>
            <nav className="space-y-2">
              <Link 
                to="/docs" 
                className="block text-gray-600 hover:text-blue-600"
              >
                All Articles
              </Link>
              {relatedDocs.map(doc => (
                <Link 
                  key={doc.slug}
                  to={`/docs/${doc.slug}`}
                  className="block text-gray-600 hover:text-blue-600 truncate"
                >
                  {doc.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        
        <main className="md:w-3/4">
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">{doc.title}</h1>
              {doc.description && (
                <p className="mt-2 text-gray-600">{doc.description}</p>
              )}
              {doc.date && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(doc.date).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </p>
              )}
              {doc.tags && (
                <div className="mt-4 space-x-2">
                  {doc.tags.map(tag => (
                    <span key={tag} className="inline-block text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            <MarkdownRenderer content={doc.content} />
          </article>
        </main>
      </div>
    </div>
  );
}
