import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Download } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Resource } from '../types/resource';
import { getResources } from '../lib/localStorage';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    try {
      setLoading(true);
      const data = getResources();
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      const updatedResources = resources.map(res => 
        res.id === resource.id ? { ...res, downloads: res.downloads + 1 } : res
      );
      localStorage.setItem('resources', JSON.stringify(updatedResources));
      setResources(updatedResources);

      window.open(resource.url, '_blank');
    } catch (error) {
      toast.error('Failed to download resource');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access resources.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Resources</h1>

        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="AI & ML">AI & ML</option>
            <option value="Robotics & IoT">Robotics & IoT</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center text-gray-600">
            No resources found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <FileText className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Download"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Downloads: {resource.downloads}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;