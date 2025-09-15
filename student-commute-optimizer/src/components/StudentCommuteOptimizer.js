import React, { useState, useEffect } from 'react';
import { MapPin, Users, MessageCircle, Clock, Car, Search, Plus, X, Send, User, Shield } from 'lucide-react';

// Mock data for demonstration
const mockStudents = [
  {
    id: 1,
    username: "CampusCruiser23",
    avatar: "🎓",
    homeLocation: { lat: 40.7128, lng: -74.0060, address: "Lower Manhattan" },
    destination: { lat: 40.7282, lng: -73.9942, address: "NYU Washington Square" },
    departureTime: "08:00",
    verified: true,
    rating: 4.8,
    preferences: ["No smoking", "Music okay"]
  },
  {
    id: 2,
    username: "StudyBuddy_NYC",
    avatar: "📚",
    homeLocation: { lat: 40.7505, lng: -73.9934, address: "Midtown West" },
    destination: { lat: 40.7282, lng: -73.9942, address: "NYU Washington Square" },
    departureTime: "08:15",
    verified: true,
    rating: 4.9,
    preferences: ["Quiet ride", "Early departure"]
  },
  {
    id: 3,
    username: "EcoCommuter",
    avatar: "🌱",
    homeLocation: { lat: 40.7061, lng: -74.0087, address: "Financial District" },
    destination: { lat: 40.7505, lng: -73.9934, address: "Columbia University" },
    departureTime: "07:45",
    verified: true,
    rating: 4.7,
    preferences: ["Environment-friendly", "Cost sharing"]
  },
  {
    id: 4,
    username: "MorningRider42",
    avatar: "☕",
    homeLocation: { lat: 40.7829, lng: -73.9654, address: "Upper East Side" },
    destination: { lat: 40.7282, lng: -73.9942, address: "NYU Washington Square" },
    departureTime: "08:30",
    verified: false,
    rating: 4.5,
    preferences: ["Coffee stops okay", "Flexible timing"]
  }
];

const StudentCommuteOptimizer = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [homeLocation, setHomeLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("08:00");
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('map');

  // Generate unique username
  const generateUsername = () => {
    const adjectives = ['Smart', 'Quick', 'Eco', 'Campus', 'Study', 'Morning', 'Night', 'Tech'];
    const nouns = ['Rider', 'Commuter', 'Student', 'Buddy', 'Cruiser', 'Scholar', 'Learner'];
    const numbers = Math.floor(Math.random() * 999) + 1;
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`;
  };

  // Route matching algorithm
  const findMatchingRoutes = (userRoute) => {
    return students.filter(student => {
      if (!userRoute) return false;
      
      // Simple proximity-based matching (in a real app, you'd use proper route calculation)
      const homeDistance = Math.sqrt(
        Math.pow(student.homeLocation.lat - 40.7128, 2) + 
        Math.pow(student.homeLocation.lng - (-74.0060), 2)
      );
      const destDistance = Math.sqrt(
        Math.pow(student.destination.lat - 40.7282, 2) + 
        Math.pow(student.destination.lng - (-73.9942), 2)
      );
      
      return homeDistance < 0.05 || destDistance < 0.05; // Within ~5km radius
    });
  };

  const handleSubmitRoute = () => {
    if (!homeLocation || !destination) return;
    
    const newUser = {
      id: Date.now(),
      username: generateUsername(),
      avatar: "👤",
      homeLocation: { lat: 40.7128, lng: -74.0060, address: homeLocation },
      destination: { lat: 40.7282, lng: -73.9942, address: destination },
      departureTime,
      verified: false,
      rating: 0,
      preferences: []
    };
    
    setCurrentUser(newUser);
    const matches = findMatchingRoutes(newUser);
    setMatchedStudents(matches);
    setActiveTab('matches');
  };

  const startChat = (student) => {
    setSelectedStudent(student);
    setChatOpen(true);
    if (!messages[student.id]) {
      setMessages(prev => ({
        ...prev,
        [student.id]: []
      }));
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedStudent) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedStudent.id]: [...(prev[selectedStudent.id] || []), message]
    }));
    
    setNewMessage("");
    
    // Simulate response
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        text: "Hi! I'd be happy to share the ride. What time works best for you?",
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedStudent.id]: [...(prev[selectedStudent.id] || []), response]
      }));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Commute Optimizer</h1>
                <p className="text-gray-600">Smart carpooling for students</p>
              </div>
            </div>
            {currentUser && (
              <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-xl">
                <span className="text-2xl">{currentUser.avatar}</span>
                <div>
                  <p className="font-semibold text-blue-900">{currentUser.username}</p>
                  <p className="text-sm text-blue-600">Anonymous ID</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl p-1 shadow-md">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-5 h-5 inline-block mr-2" />
            Route Setup
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'matches'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Matches ({matchedStudents.length})
          </button>
        </div>

        {/* Route Setup Tab */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Visualization */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Route Map</h3>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 h-80 rounded-xl flex items-center justify-center border-4 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Shows your route and nearby students
                  </p>
                  {currentUser && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Your Home: {currentUser.homeLocation.address}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-red-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Destination: {currentUser.destination.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Route Input Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Set Your Route</h3>
              
              {!currentUser ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Location
                    </label>
                    <input
                      type="text"
                      value={homeLocation}
                      onChange={(e) => setHomeLocation(e.target.value)}
                      placeholder="Enter your home address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter your school/college"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={handleSubmitRoute}
                    disabled={!homeLocation || !destination}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Find Matches</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Route Active</h4>
                        <p className="text-sm text-green-600">Finding matches along your path</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">From:</span>
                        <span className="font-medium">{currentUser.homeLocation.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium">{currentUser.destination.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-medium">{currentUser.departureTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setMatchedStudents([]);
                      setActiveTab('map');
                    }}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    Reset Route
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {matchedStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Matches Yet</h3>
                <p className="text-gray-500 mb-6">
                  {currentUser ? 
                    "We're looking for students with similar routes. Check back soon!" :
                    "Set up your route first to find matching students."
                  }
                </p>
                {!currentUser && (
                  <button
                    onClick={() => setActiveTab('map')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                  >
                    Set Up Route
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedStudents.map((student) => (
                  <div key={student.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">{student.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-gray-800">{student.username}</h4>
                          {student.verified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <span>★</span>
                          <span>{student.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">From: {student.homeLocation.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">To: {student.destination.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Departs at {student.departureTime}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Preferences:</h5>
                      <div className="flex flex-wrap gap-1">
                        {student.preferences.map((pref, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => startChat(student)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Start Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-96 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedStudent.avatar}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{selectedStudent.username}</h4>
                  <p className="text-sm text-gray-500">Anonymous Chat</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages[selectedStudent.id]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {messages[selectedStudent.id]?.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Start the conversation!</p>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCommuteOptimizer;