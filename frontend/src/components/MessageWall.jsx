import { useEffect, useState } from 'react';
import { getPublicMessages } from '../services/api';
import { Heart, User } from 'lucide-react';

const MessageWall = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getPublicMessages();
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Mock data for development
      setMessages([
        { name: 'Vincent', message: 'Keep building amazing things! 🚀', created_at: '2026-01-01T10:00:00' },
        { name: 'Anonymous', message: 'Your work inspires me daily. Keep pushing!', created_at: '2026-01-01T09:30:00' },
        { name: 'Mary', message: 'Grateful for your contributions to the community.', created_at: '2026-01-01T09:00:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
        <Heart className="w-6 h-6 mr-2 text-green-600" />
        Messages from Supporters
      </h3>
      
      {messages.length === 0 ? (
        <div className="card text-center text-gray-500 py-8">
          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No messages yet. Be the first to leave a message of support!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg, index) => (
            <div key={index} className="card hover:border-green-200 transition-all">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                      {msg.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-600">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageWall;