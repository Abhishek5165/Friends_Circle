import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, UserPlus, UserMinus, LogOut, Bell} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL=import.meta.env.MODE === "development" ? 
"http://localhost:5000/api" : "/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface FriendRequest {
  _id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
    fetchRecommendations();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/friends/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/friends/recommendations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/friends/request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(searchResults.filter(user => user._id !== userId));
      toast.success('Friend request sent successfully!');
    } catch (error) {
      toast.error('Failed to send friend request.');
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/friends/accept/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Friend request accepted successfully!');
      await fetchFriendRequests();
      await fetchFriends();
    } catch (error) {
      toast.error('Failed to accept friend request.');
    }
  };

  const rejectFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/friends/reject/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Friend request rejected successfully!');
      await fetchFriendRequests();
    } catch (error) {
      toast.error('Error rejecting friend request:');
    }
  };

  const removeFriend = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/friends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Friend removed successfully!');
      await fetchFriends();
    } catch (error) {
    toast.error('Error removing friend:');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black-600">❤️ Friends Circle ❤️</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('requests')}
                className="relative p-2 text-gray-600 hover:text-black-600"
              >
                <Bell size={24} />
                {friendRequests.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-black-600"
              >
                <LogOut size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar - Search and Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black-600 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-4">
                {searchResults.map(result => (
                  <div key={result._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{result.name}</p>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(result._id)}
                      className="p-2 text-black-600 hover:bg-black-100 rounded-full"
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content - Friends List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'friends'
                        ? 'border-b-2 border-black-600 text-black-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Friends
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'requests'
                        ? 'border-b-2 border-black-600 text-black-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Friend Requests
                  </button>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'recommendations'
                        ? 'border-b-2 border-black-600 text-black-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Recommendations
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'friends' && (
                  <div className="space-y-4">
                    {friends.length === 0 ? (
                      <p className="text-center text-gray-500">No friends yet. Start adding some!</p>
                    ) : (
                      friends.map(friend => (
                        <div key={friend._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{friend.name}</p>
                          </div>
                          <button
                            onClick={() => removeFriend(friend._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <UserMinus size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'requests' && (
                  <div className="space-y-4">
                    {friendRequests.length === 0 ? (
                      <p className="text-center text-gray-500">No pending friend requests</p>
                    ) : (
                      friendRequests.map(request => (
                        <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{request.name}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => acceptFriendRequest(request._id)}
                              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectFriendRequest(request._id)}
                              className="px-4 py-2 bg-red-700 text-white
                               rounded-lg hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div className="space-y-4">
                    {recommendations.length === 0 ? (
                      <p className="text-center text-gray-500">No recommendations available</p>
                    ) : (
                      recommendations.map(recommendation => (
                        <div key={recommendation._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{recommendation.name}</p>
                          </div>
                          <button
                            onClick={() => sendFriendRequest(recommendation._id)}
                            className="p-2 text-black-600 hover:bg-black-100 rounded-full"
                          >
                            <UserPlus size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
