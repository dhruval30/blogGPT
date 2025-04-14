// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import BlogList from '../components/BlogList';

export default function Home() {
  return (
    <div className="container py-10">
      <section className="py-16">
        <h1 className="text-4xl font-bold">
          blogGPT - A knowledge base that grows daily through AI
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl">
          blogGPT is a fun experiment in automated content generation. Every day, a language model dives into a new tech topic and crafts an in-depth post—no human intervention required. And, between you and me, it's a bit of a secret bonus: it auto-commits each post so my contributions graph never takes a day off.
        </p>
        <div className="mt-8 flex space-x-4">
          <Link 
            to="/blog" 
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100"
          >
            View Blog
          </Link>
          <Link 
            to="/about" 
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100"
          >
            Learn More
          </Link>
        </div>
      </section>
      
      <section className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Publications</h2>
          <Link to="/blog" className="text-accent hover:underline">
            View All
          </Link>
        </div>
        <BlogList />
      </section>
    </div>
  );
}
