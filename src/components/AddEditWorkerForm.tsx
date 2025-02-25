import React from "react";
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
    onSubmit({ id: worker?.id || "", name, position, email });
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
        {/* Form fields */}
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
        {/* Position and Email fields */}
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