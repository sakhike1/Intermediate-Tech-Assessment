import React, { useState } from "react";
import { Edit2, Trash2, Mail, Briefcase, MoreVertical, Shield, Coffee, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import local images
import workerImage1 from "../assets/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24658980.png";
import workerImage2 from "../assets/vecteezy_3d-student-boy-avatar-bring-tablete-icon_46634906.png";
import workerImage3 from "../assets/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24785778.png";
import workerImage4 from "../assets/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24658980.png";

// Get a consistent image based on worker's name
const getWorkerImage = (name) => {
  const images = [workerImage1, workerImage2, workerImage3, workerImage4];
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return images[charCodeSum % images.length];
};

export function WorkerCard({ worker, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  
  // Get consistent image based on worker's name
  const workerImage = getWorkerImage(worker.name);
  
  // Gradient for loading state and background effect
  const gradientIndex = worker.name.length % 6;
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-violet-500 to-fuchsia-600"
  ];
  const gradientClass = gradients[gradientIndex];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
      style={{ 
        boxShadow: isHovered 
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 2px rgba(59, 130, 246, 0.1)" 
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="flex items-center p-6">
        {/* Avatar with local image */}
        <motion.div 
          className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg overflow-hidden`}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
        >
          {/* Animated background that shows during loading and on hover */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0.7 }}
            animate={{ 
              opacity: isHovered ? 0.3 : (avatarLoaded ? 0 : 0.7),
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-br"></div>
            <motion.div 
              className="absolute inset-0" 
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }}
            />
          </motion.div>
          
          {/* Worker avatar image from local assets */}
          <motion.img
            src={workerImage}
            alt={worker.name}
            onLoad={() => setAvatarLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: avatarLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        <div className="ml-6 flex-1">
          <motion.h3 
            className="text-xl font-semibold text-gray-800 mb-1 flex items-center"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {worker.name}
            <motion.span 
              className="ml-2 inline-flex px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800"
              initial={{ opacity: 0, scale: 0, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {worker.position}
            </motion.span>
          </motion.h3>
          
          <motion.div 
            className="flex items-center text-gray-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Mail size={16} className="mr-2 text-blue-500" />
            <a 
              href={`mailto:${worker.email}`} 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {worker.email}
            </a>
          </motion.div>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowActions(!showActions)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={20} />
          </motion.button>
          
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden"
                style={{ transformOrigin: "top right" }}
              >
                <motion.button
                  whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                  onClick={() => {
                    onEdit(worker);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center p-3 text-left text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={16} className="mr-2" />
                  <span>Edit</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 5, backgroundColor: "#fee2e2" }}
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center p-3 text-left text-gray-700 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  <span>Delete</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Animated border/status indicator */}
      <div className="relative h-1">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
          style={{ transformOrigin: "left" }}
        />
        
        {/* Animated glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 blur-sm"
          initial={{ scaleX: 0, opacity: 0.5 }}
          animate={{ 
            scaleX: 1, 
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ 
            delay: 0.3,
            opacity: {
              repeat: Infinity,
              duration: 2,
            }
          }}
          style={{ transformOrigin: "left" }}
        />
      </div>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex justify-center">
                <motion.div 
                  className="w-20 h-20 relative"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 0.95, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img 
                    src={workerImage} 
                    alt={worker.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-red-100"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </motion.div>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Delete Worker</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete {worker.name}? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDelete(worker.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}