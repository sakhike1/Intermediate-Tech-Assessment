import { useState, useEffect, useRef } from "react";
import { Building2, ChevronLeft, Circle, Sparkles, Zap } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Define the Office type
interface Office {
  name: string;
  location: string;
  capacity: number;
  color: string;
  phone: string;
  email: string;
}

// Define the Particle type
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export function NewOffice() {
  const navigate = useNavigate();

  const [office, setOffice] = useState<Office>({
    name: "",
    location: "",
    capacity: 0,
    color: "#3B82F6",
    phone: "",
    email: "",
  });

  const [emailError, setEmailError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Animation states
  const [position, setPosition] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Handle mouse movement for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % 360);
    }, 50);

    // Initialize particles
    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 60 + 220, // Blue to purple range
      }))
    );

    return () => clearInterval(interval);
  }, []);

  // Canvas animation for particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines between particles that are close to each other
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.fillStyle = `hsla(${p1.hue}, 80%, 60%, ${p1.opacity})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();

        // Update particle position
        p1.x += p1.speedX;
        p1.y += p1.speedY;

        // Boundary check
        if (p1.x < 0 || p1.x > canvas.width) p1.speedX *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.speedY *= -1;

        // Mouse interaction - particles move away from cursor
        const dx = p1.x - mousePosition.x;
        const dy = p1.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 1000;
          p1.x += Math.cos(angle) * force;
          p1.y += Math.sin(angle) * force;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles, mousePosition]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setOffice({ ...office, email });

    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate email before submission
    if (office.email && !validateEmail(office.email)) {
      setEmailError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const { error } = await supabase.from("offices").insert([
        {
          ...office,
          user_id: user.id,
        },
      ]);
      if (error) {
        console.error("Error creating office:", error);
        return;
      }
      // Navigate to home page after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Canvas for particle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      {/* Animated glowing orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${Math.sin(((position + i * 30) * Math.PI) / 180) * 60 + 50}%`,
              top: `${Math.cos(((position + i * 30) * Math.PI) / 180) * 60 + 50}%`,
              width: `${30 + (i % 5) * 20}px`,
              height: `${30 + (i % 5) * 20}px`,
              background: `radial-gradient(circle, hsla(${220 + i * 10}, 80%, 60%, 0.2), hsla(${220 + i * 10}, 80%, 60%, 0))`,
              transform: `scale(${(Math.sin((position * Math.PI) / 180) + 3) / 2})`,
              opacity: 0.3 + (i % 5) * 0.1,
              transition: "all 0.5s ease",
            }}
          />
        ))}
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <Circle
            key={i}
            className="absolute text-white/5"
            style={{
              left: `${Math.sin(((position + i * 36) * Math.PI) / 180) * 50 + 50}%`,
              top: `${Math.cos(((position + i * 36) * Math.PI) / 180) * 50 + 50}%`,
              transform: `scale(${(Math.sin(((position + i * 10) * Math.PI) / 180) + 2) / 2})`,
              opacity: 0.1 + (i % 3) * 0.1,
            }}
            size={20 + (i % 5) * 15}
          />
        ))}

        {/* Floating icons */}
        <Sparkles
          className="absolute text-blue-300/20"
          style={{
            left: `${Math.sin(((position + 120) * Math.PI) / 180) * 40 + 20}%`,
            top: `${Math.cos(((position + 80) * Math.PI) / 180) * 40 + 30}%`,
            transform: "scale(2) rotate(15deg)",
          }}
        />

        <Zap
          className="absolute text-purple-300/20"
          style={{
            right: `${Math.sin(((position + 200) * Math.PI) / 180) * 40 + 20}%`,
            bottom: `${Math.cos(((position + 160) * Math.PI) / 180) * 40 + 30}%`,
            transform: "scale(2) rotate(-15deg)",
          }}
        />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center text-white/90 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="relative">
            Back to Offices
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300"></span>
          </span>
        </button>

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

          {/* Animated border glow */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(${position}deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))`,
              backgroundSize: "200% 200%",
              filter: "blur(8px)",
              opacity: 0.5,
              zIndex: -1,
            }}
          ></div>

          <div className="text-center mb-8 relative">
            <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-sm mb-4 relative group">
              <Building2 className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm group-hover:blur-md transition-all duration-300"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">Create New Office</h1>
            <p className="mt-2 text-white/70">Add a new office location to your workspace</p>

            {/* Decorative line */}
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50 mx-auto mt-4 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">Office Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={office.name}
                    onChange={(e) => setOffice({ ...office, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50 group-hover:bg-white/15"
                    placeholder="Enter office name"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={office.location}
                    onChange={(e) => setOffice({ ...office, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50 group-hover:bg-white/15"
                    placeholder="Enter office location"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={office.phone}
                    onChange={(e) => setOffice({ ...office, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50 group-hover:bg-white/15"
                    placeholder="Enter phone number"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={office.email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                      emailError ? "border-red-400" : "border-white/20"
                    } focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50 group-hover:bg-white/15`}
                    placeholder="Enter email address"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">Capacity</label>
                <div className="relative">
                  <input
                    type="number"
                    value={office.capacity}
                    onChange={(e) => setOffice({ ...office, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder-white/50 group-hover:bg-white/15"
                    placeholder="Enter capacity"
                    required
                    min="1"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white/90 mb-2">Brand Color</label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="color"
                      value={office.color}
                      onChange={(e) => setOffice({ ...office, color: e.target.value })}
                      className="w-12 h-12 p-1 rounded-lg cursor-pointer bg-white/10 border border-white/20"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white/70">Select brand color</span>
                    <span className="text-xs text-white/50">{office.color}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transform transition-all duration-300 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                {/* Button background animation */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: `linear-gradient(${position * 2}deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))`,
                    backgroundSize: "200% 200%",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                ></div>

                {/* Shine effect */}
                <div
                  className="absolute inset-0 w-[200%] h-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  }}
                ></div>

                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Create Office</>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}