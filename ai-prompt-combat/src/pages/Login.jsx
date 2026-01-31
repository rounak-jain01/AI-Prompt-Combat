import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

// FIREBASE IMPORTS
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '../firebase';

// Same Robot Image for Consistency (Visual Continuity)
const robotImage = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2070";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Loading Toast
    const toastId = toast.loading("Verifying Credentials...");

    try {
      // 1. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Check Verification
      if (!user.emailVerified) {
        await signOut(auth); // Logout immediately
        toast.error("Email not verified! Please check your inbox.", { id: toastId });
        setIsLoading(false);
        return;
      }

      // 3. Success
      toast.success("Welcome Back, Commander!", {
        id: toastId,
        style: { background: '#050505', color: '#D4AF37', border: '1px solid #D4AF37' },
      });

      // 4. Navigate to Lobby
      navigate('/lobby');

    } catch (err) {
      console.error(err);
      let msg = "Login Failed.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid Email or Password.";
      if (err.code === 'auth/user-not-found') msg = "User not found. Register first.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect Password.";
      
      toast.error(msg, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    // h-screen ensures NO SCROLL on laptop
    <div className="h-screen w-full flex bg-[#050505] overflow-hidden">
      
      {/* === LEFT SIDE: SIMPLE FORM (40%) === */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-8 lg:px-16 relative z-10 bg-[#050505] border-r border-white/5">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-[#D4AF37]" size={22} />
            <span className="text-white font-bold text-lg tracking-wider">AI PROMPT COMBAT</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Enter your credentials to access the terminal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors">
                <Mail size={16} />
              </div>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-[#111] border border-[#222] rounded-lg py-3 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder-gray-700"
                placeholder="Enter your email" required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-medium text-gray-400">Password</label>
              <a href="#" className="text-xs text-[#D4AF37] hover:underline">Forgot Password?</a>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors">
                <Lock size={16} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                className="w-full bg-[#111] border border-[#222] rounded-lg py-3 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder-gray-700"
                placeholder="••••••••" required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b8952b] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>Access Dashboard <LogIn size={20} /></>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center mt-2">
            <p className="text-gray-500 text-sm">
              New here? <Link to="/register" className="text-[#D4AF37] font-semibold hover:underline">Create an account</Link>
            </p>
          </div>

        </form>
      </div>

      {/* === RIGHT SIDE: ROBOT (60%) === */}
      <div className="hidden lg:block w-[60%] h-full relative bg-black">
        {/* Same image used in Signup for continuity */}
        <img 
          src={robotImage} 
          alt="AI Robot" 
          className="w-full h-full object-cover opacity-90 scale-x-[-1]" // Flipped to face form
        />
        {/* Inner shadow for blending */}
        <div className="absolute inset-0 shadow-[inset_100px_0_100px_-50px_rgba(5,5,5,1)]"></div>
        
        {/* Minimal Text Overlay */}
        <div className="absolute bottom-12 right-12 text-right">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-[#D4AF37] font-mono mb-2">
            System Status: Active
          </div>
          <p className="text-gray-400 text-sm max-w-xs ml-auto">
            "Your prompt is your weapon. Login to sharpen it."
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;