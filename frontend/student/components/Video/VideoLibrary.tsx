import React, { useState } from 'react';
import { Play, Clock, User, Search, BookOpen } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface Video {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
  views: number;
  uploadDate: string;
  videoUrl: string;
}

const videoLibrary: Video[] = [
  {
    id: '1',
    title: 'Intro to OWASP Top 10',
    description: 'Understand the OWASP Top 10 vulnerabilities and how to mitigate them.',
    instructor: 'Security Academy',
    duration: '12:34',
    thumbnail: 'https://img.youtube.com/vi/1/maxresdefault.jpg',
    category: 'OWASP Top 10',
    difficulty: 'beginner',
    views: 45230,
    uploadDate: '2023-06-05',
    videoUrl: 'https://www.youtube.com/watch?v=example1'
  },
  {
    id: '2',
    title: 'Cryptography Basics',
    description: 'A practical guide to modern cryptography concepts and primitives.',
    instructor: 'CryptoLab',
    duration: '28:10',
    thumbnail: 'https://img.youtube.com/vi/2/maxresdefault.jpg',
    category: 'Cryptography',
    difficulty: 'intermediate',
    views: 98765,
    uploadDate: '2023-02-14',
    videoUrl: 'https://www.youtube.com/watch?v=example2'
  },
  {
    id: '3',
    title: 'Practical Penetration Testing',
    description: 'Hands-on exercises and tools for real-world penetration testing.',
    instructor: 'PentestPro',
    duration: '45:12',
    thumbnail: 'https://img.youtube.com/vi/3/maxresdefault.jpg',
    category: 'Penetration Testing',
    difficulty: 'advanced',
    views: 210000,
    uploadDate: '2022-11-02',
    videoUrl: 'https://www.youtube.com/watch?v=example3'
  }
];

export const VideoLibrary: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = ['all', 'OWASP Top 10', 'Cryptography', 'Penetration Testing', 'Tools', 'Web Security'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredVideos = videoLibrary.filter(video => {
    const s = searchTerm.trim().toLowerCase();
    const matchesSearch = s === '' || video.title.toLowerCase().includes(s) || video.description.toLowerCase().includes(s);
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (selectedVideo) {
    return (
      <div className="p-6 bg-slate-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center space-x-2 text-amber-300 hover:text-amber-400 transition-colors mb-6"
          >
            <span>← Back to Video Library</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <VideoPlayer
                videoUrl={selectedVideo.videoUrl}
                title={selectedVideo.title}
                onProgress={() => {}}
                onComplete={() => {}}
              />

              <div className="mt-6">
                <h1 className="text-2xl font-bold text-slate-100 mb-2">{selectedVideo.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{selectedVideo.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{selectedVideo.views.toLocaleString()} views</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedVideo.difficulty)}`}>
                    {selectedVideo.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-300">{selectedVideo.description}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-100 mb-4">Related Videos</h3>
              <div className="space-y-4">
                {videoLibrary
                  .filter(v => v.id !== selectedVideo.id && v.category === selectedVideo.category)
                  .slice(0, 3)
                  .map(video => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-video bg-slate-800 rounded-lg mb-2 overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium text-slate-100 text-sm group-hover:text-amber-300 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-400">{video.instructor} • {video.duration}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Video Library</h1>
          <p className="text-slate-300">Comprehensive video tutorials covering all aspects of cybersecurity</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-700 bg-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 bg-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-slate-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-video bg-slate-700">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-amber-50 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-slate-100 px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                    {video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                  </span>
                </div>

                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{video.description}</p>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{video.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-100 mb-2">No videos found</h3>
            <p className="text-slate-300">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibrary;