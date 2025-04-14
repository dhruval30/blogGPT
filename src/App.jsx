import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BlogLayout from './components/BlogLayout';
import DocsLayout from './components/DocsLayout';
import Footer from './components/Footer';
import Header from './components/Header';
import About from './pages/About';
import BlogPost from './pages/BlogPost';
import DocPage from './pages/DocPage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Blog routes with layout */}
            <Route path="/blog" element={<BlogLayout />}>
              <Route index element={<Home />} />
              <Route path=":slug" element={<BlogPost />} />
            </Route>
            
            {/* Docs routes with layout */}
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<Home />} />
              <Route path=":slug" element={<DocPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;