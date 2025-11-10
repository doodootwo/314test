import { useState, createContext, useContext } from 'react';
import { Heart, Search, Plus, User, LogOut, FileText, Users, Bell, Star } from 'lucide-react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password, role) => {
  try {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setUser({
      id: data.user.id,
      email: data.user.email,
      username: data.user.email.split("@")[0],
      role: data.user.role || role,
    });

    return Promise.resolve();
  } catch (err) {
    alert(err.message);
    return Promise.reject(err);
  }
};

  const register = (data) => {
    setUser({ id: 1, email: data.email, role: data.role, username: data.username });
    return Promise.resolve();
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const LoginPage = ({ onSwitch }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('pin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <Heart className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Volunteer Platform</h1>
          <p className="text-gray-300">Connect helpers with those in need</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="pin" className="bg-gray-800">Person in Need</option>
              <option value="csr" className="bg-gray-800">CSR Representative</option>
              <option value="admin" className="bg-gray-800">Admin</option>
              <option value="manager" className="bg-gray-800">Platform Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="text-pink-400 hover:text-pink-300 font-semibold">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

const RegisterPage = ({ onSwitch }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'pin',
    full_name: '',
    company_name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <Heart className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="pin" className="bg-gray-800">Person in Need</option>
              <option value="csr" className="bg-gray-800">CSR Representative</option>
            </select>
          </div>

          {formData.role === 'csr' && (
            <div>
              <label className="block text-white mb-2">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-105"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-pink-400 hover:text-pink-300 font-semibold">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [requests, setRequests] = useState([
    { id: 1, title: 'Need help with groceries', description: 'Looking for someone to help me get groceries this week', urgency: 'medium', location: 'Downtown', status: 'pending', view_count: 5 },
    { id: 2, title: 'Moving assistance needed', description: 'Need help moving furniture to new apartment', urgency: 'high', location: 'Uptown', status: 'pending', view_count: 12 },
    { id: 3, title: 'Tutoring for mathematics', description: 'Looking for math tutor for high school student', urgency: 'low', location: 'Suburbs', status: 'pending', view_count: 8 }
  ]);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', urgency: 'medium', location: '' });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const request = {
      id: requests.length + 1,
      ...newRequest,
      status: 'pending',
      view_count: 0
    };
    setRequests([request, ...requests]);
    setNewRequest({ title: '', description: '', urgency: 'medium', location: '' });
    setShowNewRequest(false);
  };

  const urgencyColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-400" />
              <span className="ml-2 text-2xl font-bold text-white">VolunteerHub</span>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-300" />
                <span className="text-white">{user.username}</span>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">{user.role.toUpperCase()}</span>
              </div>
              <button onClick={logout} className="text-gray-300 hover:text-white">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'browse'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            <Search className="inline h-5 w-5 mr-2" />
            Browse Requests
          </button>
          {user.role === 'pin' && (
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'my-requests'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="inline h-5 w-5 mr-2" />
              My Requests
            </button>
          )}
          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Users className="inline h-5 w-5 mr-2" />
              Admin Panel
            </button>
          )}
        </div>

        {activeTab === 'browse' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Help Requests</h2>
              {user.role === 'pin' && (
                <button
                  onClick={() => setShowNewRequest(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Request
                </button>
              )}
            </div>

            {showNewRequest && (
              <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Create New Request</h3>
                <form onSubmit={handleCreateRequest} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Location"
                      value={newRequest.location}
                      onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                      className="px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                      value={newRequest.urgency}
                      onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                      className="px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low Urgency</option>
                      <option value="medium">Medium Urgency</option>
                      <option value="high">High Urgency</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewRequest(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-6">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{req.title}</h3>
                      <p className="text-gray-300">{req.description}</p>
                    </div>
                    <span className={`${urgencyColors[req.urgency]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {req.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-400">
                      <span>📍 {req.location}</span>
                      <span>👁️ {req.view_count} views</span>
                    </div>
                    {user.role === 'csr' && (
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                        Offer Help
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && user.role === 'admin' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Users</p>
                    <p className="text-4xl font-bold text-white">156</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Active Requests</p>
                    <p className="text-4xl font-bold text-white">23</p>
                  </div>
                  <FileText className="h-12 w-12 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-200 text-sm">Completed</p>
                    <p className="text-4xl font-bold text-white">89</p>
                  </div>
                  <Star className="h-12 w-12 text-pink-200" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <AppContent showRegister={showRegister} setShowRegister={setShowRegister} />
    </AuthProvider>
  );
}

function AppContent({ showRegister, setShowRegister }) {
  const { user } = useAuth();

  if (!user) {
    return showRegister ? (
      <RegisterPage onSwitch={() => setShowRegister(false)} />
    ) : (
      <LoginPage onSwitch={() => setShowRegister(true)} />
    );
  }

  return <Dashboard />;
}