// src/components/Header.jsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="py-6">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          blogGPT
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
        </nav>
      </div>
    </header>
  );
}
