import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, Users, Gauge, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { OfficeCard } from "../components/OfficeCard";
import youngAvatar from "../assets/young.png";

export function Home() {
  const [offices, setOffices] = useState([]);
  const [workerCounts, setWorkerCounts] = useState({});
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openCardId, setOpenCardId] = useState(null);
  const navigate = useNavigate();

  // Use useCallback to memoize the toggle handler
  const handleCardToggle = useCallback((officeId) => {
    setOpenCardId(prevId => prevId === officeId ? null : officeId);
  }, []);

  useEffect(() => {
    fetchOffices();
  }, []);

  async function fetchOffices() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: offices, error } = await supabase
        .from("offices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching offices:", error);
        setLoading(false);
        return;
      }

      setOffices(offices || []);

      // Calculate total capacity
      let totalCap = 0;
      if (offices && offices.length > 0) {
        totalCap = offices.reduce((sum, office) => sum + (office.capacity || 0), 0);
        
        // Fetch worker counts in parallel
        const workerPromises = offices.map(async (office) => {
          const { count } = await supabase
            .from("workers")
            .select("*", { count: "exact" })
            .eq("office_id", office.id);
            
          return { officeId: office.id, count: count || 0 };
        });
        
        const workerResults = await Promise.all(workerPromises);
        const counts = workerResults.reduce((acc, { officeId, count }) => {
          acc[officeId] = count;
          return acc;
        }, {});
        
        setWorkerCounts(counts);
      }
      
      setTotalCapacity(totalCap);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }

  const getTotalWorkers = () => {
    return Object.values(workerCounts).reduce((sum, count) => sum + count, 0);
  };

  const getOccupancyRate = () => {
    const total = getTotalWorkers();
    return totalCapacity ? Math.round((total / totalCapacity) * 100) : 0;
  };

  const renderOfficeGrid = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      );
    } 
    
    if (offices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative mb-8">
            <Building2 size={120} className="text-blue-400 animate-float" />
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse" />
          </div>
          <div className="max-w-lg bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-xl">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome to Your Office Dashboard
              </h2>
              <p className="text-gray-600">
                Start managing your office spaces efficiently. Add your first office to begin
                tracking capacity and worker distribution.
              </p>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-700 font-medium flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Pro Tip: Customize each office with unique colors and monitor real-time
                  occupancy rates
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Render office cards with explicit checks for isOpen
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offices.map((office, index) => {
          // Explicitly check if this card should be open
          const isThisCardOpen = openCardId === office.id;
          
          return (
            <div
              key={office.id}
              className="transform transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: 0,
                animation: `fadeSlideUp 0.5s ease-out ${index * 0.1}s forwards`,
              }}
            >
              <OfficeCard
                office={office}
                workerCount={workerCounts[office.id] || 0}
                className="h-full bg-white/70 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300"
                isOpen={isThisCardOpen}
                onToggle={handleCardToggle}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Rest of the component remains the same */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-10 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-10 animate-pulse delay-1000" />
        </div>

        <div className="relative mb-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-gray-800">Office Spaces</h1>
              <p className="text-gray-500">Manage your workspace efficiently</p>
            </div>
            <button
              onClick={() => navigate("/office/new")}
              className="group bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <Plus
                size={24}
                className="relative z-10 transition-transform group-hover:rotate-90 duration-300"
              />
              <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          </div>

          {offices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Office count card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Building2 className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Offices</p>
                    <p className="text-2xl font-bold text-gray-900">{offices.length}</p>
                  </div>
                </div>
              </div>

              {/* Worker count card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="text-green-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Workers</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{getTotalWorkers()}</p>
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(3, getTotalWorkers()))].map((_, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full border-2 border-white overflow-hidden relative"
                          >
                            <img
                              src={youngAvatar}
                              alt="Worker avatar"
                              className="h-6 w-6 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-0">
                              <User className="h-4 w-4" />
                            </div>
                          </div>
                        ))}
                        {getTotalWorkers() > 3 && (
                          <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                            +{getTotalWorkers() - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Occupancy rate card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Gauge className="text-purple-600 h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900">{getOccupancyRate()}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-full transition-all duration-500 ease-out"
                          style={{ width: `${getOccupancyRate()}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Render the office grid */}
        {renderOfficeGrid()}
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;