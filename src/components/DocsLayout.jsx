import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DocsLayout() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/docs.json');
        if (response.ok) {
          const data = await response.json();
          setDocs(data);
        } else {
          console.error('Failed to fetch docs');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-col lg:flex-row">
        <aside className="lg:w-1/4 lg:pr-8 mb-8 lg:mb-0">
          <div className="sticky top-8">
            <h3 className="text-lg font-medium mb-4">Documentation</h3>
            
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <nav className="space-y-2">
                {docs.map(doc => (
                  <Link 
                    key={doc.id}
                    to={`/docs/${doc.id}`}
                    className={`block text-sm hover:text-blue-600 ${
                      location.pathname === `/docs/${doc.id}` 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {doc.title}
                  </Link>
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
