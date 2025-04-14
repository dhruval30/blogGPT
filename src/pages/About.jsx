import { useState } from 'react';

export default function About() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="container py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About blogGPT</h1>
          <p className="text-xl text-gray-600">
            Automated brilliance, daily computer science insights
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'how'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('how')}
            >
              How It Works
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'why'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('why')}
            >
              Why Automated
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'tech'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('tech')}
            >
              Tech Stack
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'about' && (
              <div className="space-y-6">
                <p className="text-lg">
                  blogGPT is an experimental blog that combines automated content generation with a passion for computer science education. Every day, a new computer science topic is explored in depth, created using cutting-edge language models to ensure consistent knowledge sharing.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-xl mb-3">Knowledge Growth</h3>
                    <p>Creating a repository of computer science explanations that are fun, informative, and approachable</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-xl mb-3">Continuous Contribution</h3>
                    <p>Automating the process of content creation to ensure regular updates and maintain contribution consistency</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'how' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <p className="text-lg mb-6">Every day, an automated script executes the following process:</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                    <div className="ml-4">
                      <h3 className="font-medium text-lg">Topic Selection</h3>
                      <p className="text-gray-600">Selects a random computer science topic from a curated list</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                    <div className="ml-4">
                      <h3 className="font-medium text-lg">Content Generation</h3>
                      <p className="text-gray-600">Uses llama-3.3-70b-versatile to generate an in-depth explanation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                    <div className="ml-4">
                      <h3 className="font-medium text-lg">Formatting</h3>
                      <p className="text-gray-600">Formats the content with code examples, metaphors, and visual explanations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                    <div className="ml-4">
                      <h3 className="font-medium text-lg">Publication</h3>
                      <p className="text-gray-600">Publishes the new post to this site</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">5</div>
                    <div className="ml-4">
                      <h3 className="font-medium text-lg">Version Control</h3>
                      <p className="text-gray-600">Creates a commit to track the contribution</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'why' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Why Automated Content?</h2>
                <div className="prose prose-lg">
                  <p>
                    While human-written content has unique qualities, this experiment explores how AI-generated educational content can provide consistent, high-quality explanations of technical topics without the constraints of human scheduling and motivation.
                  </p>
                  <p>
                    All content is reviewed for accuracy and educational value, ensuring that despite its automated creation, it maintains high standards of quality and usefulness.
                  </p>
                  <div className="bg-blue-50 p-6 rounded-lg mt-6">
                    <h3 className="font-bold text-xl mb-2">Benefits of Automation</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Consistent publishing schedule without burnout</li>
                      <li>Wide range of topics covered systematically</li>
                      <li>Standardized format for easier learning</li>
                      <li>Continuously expanding repository of knowledge</li>
                      <li>Experiment in educational AI applications</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Our Tech Stack</h2>
                <p className="text-lg mb-6">
                  blogGPT is built on a modern technology stack designed for reliability and automation:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-3">Content Generation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Llama-3.3-70b-versatile via Groq</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Custom prompt engineering</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Content verification pipeline</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-3">Frontend</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>React with React Router</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>TailwindCSS for styling</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Markdown rendering for content</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-3">Deployment</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Automated Git workflows</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Continuous deployment</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Scheduled content generation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-3">Content Management</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>JSON-based content storage</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Automated tagging system</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Version-controlled content</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
