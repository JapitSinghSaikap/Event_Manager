import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeClosedIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function Login() {
    const server = "http://localhost:5000"; 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const registerUser = async () => {
        if (!name || !email || !password) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${server}/organisers/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password})
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Account created!");
                setIsLogin(true);
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (err) {
            toast.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async () => {
        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${server}/organisers/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem("token", data.token); 
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success("Login successful");
                navigate("/");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (err) {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div className="w-full max-w-[35rem]">
                <div className="bg-black backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-800">
                    <motion.div className="text-center mb-8" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                        <div className="text-3xl font-bold text-white">TechMeet</div>
                        <p className="text-gray-400 mt-2">{isLogin ? "Welcome back!" : "Create your account"}</p>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                            {!isLogin && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white"
                                        placeholder="Enter your username"
                                    />
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white"
                                        placeholder="Enter your password"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeIcon className="text-gray-300" /> : <EyeClosedIcon className="text-gray-300" />}
                                    </div>
                                </div>
                            </div>

                            {!loading ? (
                                <motion.button
                                    onClick={isLogin ? loginUser : registerUser}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-lg bg-purple-500 cursor-pointer text-white"
                                >
                                    {isLogin ? "Sign In" : "Sign Up"}
                                </motion.button>
                            ) : (
                                <div className="flex justify-center items-center w-full py-3 rounded-lg bg-purple-700 cursor-pointer text-white">
                                    {isLogin ? "Logging in" : "Registering"} <Loader2 className="animate-spin p-1" />
                                </div>
                            )}
                        </form>

                        <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-purple-400 hover:text-purple-300 text-sm cursor-pointer"
                            >
                                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
