import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-hot-toast';

const videos = [
  "https://videos.pexels.com/video-files/5453774/5453774-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/7033922/7033922-uhd_2560_1440_25fps.mp4"
];

interface LoginFormProps {}

export function LoginForm({}: LoginFormProps) {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Start fading out current video and fading in next video
      if (videoRefs[0].current && videoRefs[1].current) {
        if (currentVideo === 0) {
          videoRefs[0].current.style.opacity = '0';
          videoRefs[1].current.style.opacity = '1';
          videoRefs[1].current.play();
        } else {
          videoRefs[1].current.style.opacity = '0';
          videoRefs[0].current.style.opacity = '1';
          videoRefs[0].current.play();
        }
      }

      // After transition completes, update video index
      setTimeout(() => {
        setCurrentVideo(prev => prev === 0 ? 1 : 0);
        setIsTransitioning(false);
      }, 1000);
    }, 8000);

    return () => clearInterval(interval);
  }, [currentVideo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, username);
      toast.success('Successfully logged in!');
      navigate('/symptoms');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Video 1 */}
      <video 
        ref={videoRefs[0]}
        key="video-1"
        autoPlay 
        muted 
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: currentVideo === 0 ? 1 : 0 }}
      >
        <source src={videos[0]} type="video/mp4" />
      </video>

      {/* Video 2 */}
      <video 
        ref={videoRefs[1]}
        key="video-2"
        autoPlay 
        muted 
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: currentVideo === 1 ? 1 : 0 }}
      >
        <source src={videos[1]} type="video/mp4" />
      </video>

      {/* Dark Overlay for Contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Login Form */}
      <div className="relative z-20 w-full max-w-sm sm:max-w-md space-y-8 rounded-xl bg-white p-6 sm:p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Sign in to TeleCure
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your healthcare dashboard
          </p>
        </div>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full py-2">
            Sign in
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}