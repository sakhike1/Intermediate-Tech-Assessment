import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Office, Worker } from "../types";
import { WorkerCard } from "../components/WorkerCard";
import { Search, UserPlus, ArrowLeft, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import officeImage from "../assets/office.jpg";

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function OfficeView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [office, setOffice] = useState<Office | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showEditWorker, setShowEditWorker] = useState<Worker | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: "",
    position: "",
    email: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOfficeData();
    }
  }, [id]);

  async function fetchOfficeData() {
    setLoading(true);
    try {
      await Promise.all([fetchOffice(), fetchWorkers()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOffice() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("offices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      console.error("Error fetching office:", error);
      navigate("/");
      return;
    }

    setOffice(data);
  }

  async function fetchWorkers() {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("office_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching workers:", error);
      return;
    }

    setWorkers(data || []);
  }

  async function handleAddWorker(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { error } = await supabase.from("workers").insert([
      {
        ...newWorker,
        office_id: id,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding worker:", error);
      return;
    }

    setShowAddWorker(false);
    setNewWorker({ name: "", position: "", email: "" });
    fetchWorkers();
  }

  async function handleEditWorker(worker: Worker) {
    const { error } = await supabase
      .from("workers")
      .update({
        name: worker.name,
        position: worker.position,
        email: worker.email,
      })
      .eq("id", worker.id);

    if (error) {
      console.error("Error updating worker:", error);
      return;
    }

    setShowEditWorker(null);
    fetchWorkers();
  }

  async function handleDeleteWorker(workerId: string) {
    const { error } = await supabase.from("workers").delete().eq("id", workerId);

    if (error) {
      console.error("Error deleting worker:", error);
      return;
    }

    fetchWorkers();
  }

  async function handleDeleteOffice() {
    if (!office) return;

    const { error } = await supabase.from("offices").delete().eq("id", office.id);

    if (error) {
      console.error("Error deleting office:", error);
      return;
    }

    navigate("/");
  }

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-600">Loading office data...</p>
        </motion.div>
      </div>
    );
  }

  if (!office) return null;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-200 rounded-full opacity-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-200 rounded-full opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all hover:shadow-md"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Offices
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border backdrop-blur-sm rounded-full shadow-sm transition-all hover:shadow-md"
          >
            <Trash2 size={20} className="mr-2" />
            Delete Office
          </motion.button>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-white via-cyan-100 to-neutral-100 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-full h-64 mb-6 overflow-hidden rounded-lg">
            <img
              src={officeImage}
              alt="Office"
              className="w-full h-full object-fill rounded-lg shadow-lg"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-700 mb-3">{office.name}</h1>
          <p className="text-lg text-gray-600">{office.location}</p>

          {/* Dropdown Button */}
          <div className="flex justify-center  mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card navigation when clicking the dropdown button
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center text-gray-600  hover:text-gray-900 transition-colors"
            >
              {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <span className="ml-2">More Details</span>
            </button>
          </div>

          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div
              onClick={(e) => e.stopPropagation()} // Prevent card navigation when interacting with dropdown content
              className="mt-4 space-y-2 text-sm text-gray-700 bg-gradient-to-l from-violet-400 via-emerald-100 to-green-200  p-4 border rounded-lg shadow-lg"
            >
              {office.email && (
                <p>
                  <strong>Email:</strong> {office.email}
                </p>
              )}
              {office.phone && (
                <p>
                  <strong>Phone:</strong> {office.phone}
                </p>
              )}
              <p>
                <strong>Location:</strong> {office.location}
              </p>
              <p>
                <strong>Capacity:</strong> {office.capacity}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative flex-1 max-w-lg">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <motion.input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              whileFocus={{
                scale: 1.02,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#2563eb", // Blue background on hover
              color: "#ffffff", // White text on hover
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Enhanced shadow on hover
            }}
            whileTap={{
              scale: 0.95,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow on tap
            }}
            onClick={() => setShowAddWorker(true)}
            className="ml-4 text-gray-600 px-6 py-3 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all bg-white border border-gray-200 hover:border-transparent"
          >
            <UserPlus size={20} className="mr-2" />
            Add Worker
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
              >
                <h3 className="text-2xl font-semibold mb-4">Delete Office</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this office? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteOffice}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {(showAddWorker || showEditWorker) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-teal-50 via-teal-50 to-cyan-900 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6">
                {showEditWorker ? "Edit Worker" : "Add New Worker"}
              </h2>
              <form
                onSubmit={
                  showEditWorker
                    ? (e) => {
                        e.preventDefault();
                        handleEditWorker(showEditWorker);
                      }
                    : handleAddWorker
                }
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={showEditWorker ? showEditWorker.name : newWorker.name}
                    onChange={(e) =>
                      showEditWorker
                        ? setShowEditWorker({ ...showEditWorker, name: e.target.value })
                        : setNewWorker({ ...newWorker, name: e.target.value })
                    }
                    className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={showEditWorker ? showEditWorker.position : newWorker.position}
                    onChange={(e) =>
                      showEditWorker
                        ? setShowEditWorker({ ...showEditWorker, position: e.target.value })
                        : setNewWorker({ ...newWorker, position: e.target.value })
                    }
                    className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    value={showEditWorker ? showEditWorker.email : newWorker.email}
                    onChange={(e) =>
                      showEditWorker
                        ? setShowEditWorker({ ...showEditWorker, email: e.target.value })
                        : setNewWorker({ ...newWorker, email: e.target.value })
                    }
                    className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent "
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowAddWorker(false);
                      setShowEditWorker(null);
                    }}
                    className="px-6 py-3 text-gray-800 hover:text-gray-800 bg-gray-300 rounded-full"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3  text-black   rounded-full shadow-lg"
                  >
                    {showEditWorker ? "Save Changes" : "Add Worker"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={listContainer} initial="hidden" animate="show" className="grid gap-6">
          <AnimatePresence mode="wait">
            {filteredWorkers.map((worker, index) => (
              <motion.div
                key={worker.id}
                variants={listItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="transform-gpu"
              >
                <WorkerCard
                  worker={worker}
                  onEdit={() => setShowEditWorker(worker)}
                  onDelete={handleDeleteWorker}
                />
              </motion.div>
            ))}

            {filteredWorkers.length === 0 && searchTerm === "" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-teal-50 via-teal-50 to-cyan-900 backdrop-blur-sm rounded-xl p-12 text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
                </motion.div>
                <p className="text-gray-500 text-lg">
                  No workers added yet. Add your first worker to get started.
                </p>
              </motion.div>
            )}

            {filteredWorkers.length === 0 && searchTerm !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Search size={48} className="mx-auto text-gray-400 mb-4" />
                </motion.div>
                <p className="text-gray-500 text-lg">No workers found matching your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quick Action Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddWorker(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all md:hidden"
      >
        <UserPlus size={24} />
      </motion.button>
    </motion.div>
  );
}