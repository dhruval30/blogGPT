// src/components/BlogCard.jsx
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  const { slug, title, date, description, tags } = post;

  // Safely format date or show fallback
  let formattedDate = 'Unknown date';
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      formattedDate = format(parsedDate, 'MMM d, yyyy');
    }
  }

  return (
    <article className="border-b border-gray-200 py-6 flex flex-col md:flex-row md:items-start">
      <div className="md:w-1/4">
        <time className="text-sm text-gray-500">{formattedDate}</time>
        <div className="mt-1 space-x-1">
          {tags && tags.map(tag => (
            <span
              key={tag}
              className="inline-block text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="md:w-3/4 mt-3 md:mt-0">
        <h2 className="text-xl font-semibold">
          <Link to={`/docs/${slug}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h2>
        <p className="mt-2 text-gray-600">
          {description}
        </p>
        <Link
          to={`/docs/${slug}`}
          className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
