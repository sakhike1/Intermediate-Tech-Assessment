import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {supabase} from "../lib/supabase";
import {Building2, ChevronLeft, Circle} from "lucide-react";

export function NewOffice() {
    const navigate = useNavigate();
    const [office, setOffice] = useState({
        name: "",
        location: "",
        capacity: 0,
        color: "#3B82F6",
        phone: "",
        email: "",
    });

    const [emailError, setEmailError] = useState("");

    // Animation state for floating elements
    const [position, setPosition] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => (prev + 1) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setOffice({...office, email});

        if (email && !validateEmail(email)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();

        // Validate email before submission
        if (office.email && !validateEmail(office.email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        const {
            data: {user},
        } = await supabase.auth.getUser();
        if (!user) {
            console.error("User not authenticated");
            return;
        }
        const {error} = await supabase.from("offices").insert([
            {
                ...office,
                user_id: user.id,
            },
        ]);
        if (error) {
            console.error("Error creating office:", error);
            return;
        }
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <Circle
                        key={i}
                        className="absolute text-white/5"
                        style={{
                            left: `${Math.sin(((position + i * 20) * Math.PI) / 180) * 50 + 50}%`,
                            top: `${Math.cos(((position + i * 20) * Math.PI) / 180) * 50 + 50}%`,
                            transform: `scale(${(Math.sin((position * Math.PI) / 180) + 2) / 2})`,
                            opacity: 0.1 + (i % 3) * 0.1,
                        }}
                        size={20 + (i % 3) * 20}
                    />
                ))}
            </div>

            <div className="w-full max-w-2xl relative">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center text-white/90 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Offices
                </button>

                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create New Office</h1>
                        <p className="mt-2 text-white/70">Add a new office location to your workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Office Name</label>
                                <input
                                    type="text"
                                    value={office.name}
                                    onChange={(e) => setOffice({...office, name: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50"
                                    placeholder="Enter office name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={office.location}
                                    onChange={(e) => setOffice({...office, location: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50"
                                    placeholder="Enter office location"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={office.phone}
                                    onChange={(e) => setOffice({...office, phone: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={office.email}
                                    onChange={handleEmailChange}
                                    className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                                        emailError ? "border-red-400" : "border-white/20"
                                    } focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50`}
                                    placeholder="Enter email address"
                                />
                                {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Capacity</label>
                                <input
                                    type="number"
                                    value={office.capacity}
                                    onChange={(e) => setOffice({...office, capacity: parseInt(e.target.value)})}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50"
                                    placeholder="Enter capacity"
                                    required
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Brand Color</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="color"
                                        value={office.color}
                                        onChange={(e) => setOffice({...office, color: e.target.value})}
                                        className="w-12 h-12 p-1 rounded-lg cursor-pointer bg-white/10"
                                    />
                                    <span className="text-sm text-white/70">Select brand color</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-white/20 backdrop-blur-sm text-white py-2 px-6 rounded-xl hover:bg-white/30 transform transition-all duration-200 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent"
                            >
                                Create Office
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
