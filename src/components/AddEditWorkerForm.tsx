import { useState } from "react";
import { motion } from "framer-motion";
import { Worker } from "../types";

interface AddEditWorkerFormProps {
  worker?: Worker;
  onSubmit: (worker: Worker) => void;
  onCancel: () => void;
}

export function AddEditWorkerForm({ worker, onSubmit, onCancel }: AddEditWorkerFormProps) {
  const [name, setName] = useState(worker?.name || "");
  const [position, setPosition] = useState(worker?.position || "");
  const [email, setEmail] = useState(worker?.email || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a Worker object with all required properties
    const updatedWorker: Worker = {
      id: worker?.id || "", // Use existing ID or an empty string for new workers
      name,
      position,
      email,
      avatar_url: worker?.avatar_url || "", // Use existing avatar_url or an empty string
      office_id: worker?.office_id || "", // Use existing office_id or an empty string
      created_at: worker?.created_at || new Date().toISOString(), // Use existing created_at or the current date
    };

    onSubmit(updatedWorker);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-teal-50 via-teal-50 to-cyan-900 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6">{worker ? "Edit Worker" : "Add New Worker"}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
            required
          />
        </div>

        {/* Position Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-3 text-gray-800 hover:text-gray-800 bg-gray-300 rounded-full"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-black rounded-full shadow-lg"
          >
            {worker ? "Save Changes" : "Add Worker"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}