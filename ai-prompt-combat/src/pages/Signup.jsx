import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Building2, Hash, BookOpen, 
  Calendar, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

// FIREBASE IMPORTS
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

// Pure Robot Image (No Text Overlay)
const robotImage = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2070";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    enrollment: '',
    branch: '',
    semester: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        enrollment: formData.enrollment,
        branch: formData.branch,
        semester: formData.semester,
        createdAt: new Date(),
        isVerified: false
      });

      await signOut(auth);

      toast.success("Account Created! Verify Email.", {
        id: toastId,
        style: { background: '#050505', color: '#D4AF37', border: '1px solid #D4AF37' },
      });
      
      navigate('/login');

    } catch (err) {
      console.error(err);
      let msg = "Registration Failed.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
      if (err.code === 'auth/weak-password') msg = "Password too weak.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // h-screen & overflow-hidden ensures NO SCROLL on laptop
    <div className="h-screen w-full flex bg-[#050505] overflow-hidden">
      
      {/* === LEFT SIDE: COMPACT FORM (40%) === */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center px-8 lg:px-12 relative z-10 bg-[#050505] border-r border-white/5">
        
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-[#D4AF37]" size={20} />
            <span className="text-white font-bold text-base tracking-wider">AI PROMPT COMBAT</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput icon={User} name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
            <FormInput icon={Phone} name="phone" label="WhatsApp" value={formData.phone} onChange={handleChange} required />
          </div>

          {/* Row 2 */}
          <FormInput icon={Mail} type="email" name="email" label="Email Address" value={formData.email} onChange={handleChange} required />

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput icon={Building2} name="college" label="College" value={formData.college} onChange={handleChange} required />
            <FormInput icon={Hash} name="enrollment" label="Enrollment ID" value={formData.enrollment} onChange={handleChange} required />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput icon={BookOpen} name="branch" label="Branch" value={formData.branch} onChange={handleChange} required />
            <FormInput icon={Calendar} name="semester" label="Semester" value={formData.semester} onChange={handleChange} required />
          </div>

          {/* Row 5: Passwords */}
          <div className="grid grid-cols-2 gap-3">
            <PasswordInput 
              name="password" label="Password" value={formData.password} 
              onChange={handleChange} show={showPassword} toggle={() => setShowPassword(!showPassword)} required 
            />
            <PasswordInput 
              name="confirmPassword" label="Confirm" value={formData.confirmPassword} 
              onChange={handleChange} show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} required 
            />
          </div>

          {/* Submit Button (Compact) */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#b8952b] transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Register <ArrowRight size={16} /></>}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              Already joined? <Link to="/login" className="text-[#D4AF37] font-semibold hover:underline">Log in</Link>
            </p>
          </div>

        </form>
      </div>

      {/* === RIGHT SIDE: ROBOT ILLUSTRATION ONLY (60%) === */}
      <div className="hidden lg:block w-[60%] h-full relative bg-black">
        {/* Image fills the area, no text */}
        <img 
          src={robotImage} 
          alt="AI Robot" 
          className="w-full h-full object-cover opacity-90"
        />
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_100px_0_100px_-50px_rgba(5,5,5,1)]"></div>
      </div>

    </div>
  );
};

// --- COMPACT COMPONENTS ---

const FormInput = ({ icon: Icon, type = "text", name, label, value, onChange, required }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-medium text-gray-400 ml-1 flex gap-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors">
        <Icon size={14} />
      </div>
      <input 
        type={type} name={name} value={value} onChange={onChange}
        className="w-full bg-[#111] border border-[#222] rounded-lg py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder-gray-700"
        placeholder={label} required={required}
      />
    </div>
  </div>
);

const PasswordInput = ({ name, label, value, onChange, show, toggle, required }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-medium text-gray-400 ml-1 flex gap-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors">
        <Lock size={14} />
      </div>
      <input 
        type={show ? "text" : "password"} name={name} value={value} onChange={onChange}
        className="w-full bg-[#111] border border-[#222] rounded-lg py-2.5 pl-9 pr-9 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder-gray-700"
        placeholder="••••" required={required}
      />
      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

export default Signup;