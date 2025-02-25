import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ChevronDown, ChevronUp } from "lucide-react"; // Removed unused Building2 icon
import { Office } from "../types"; // Ensure Office type is correctly defined
import { motion } from "framer-motion";
import officeImage from "../assets/office.png"; // Ensure the image exists at this path

interface OfficeCardProps {
  office: Office;
  workerCount: number;
  className?: string;
}

export function OfficeCard({ office, workerCount, className }: OfficeCardProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative w-full bg-gradient-to-r from-white via-cyan-100 to-neutral-100 rounded-lg shadow-lg overflow-hidden ${className}`}
      onClick={() => navigate(`/office/${office.id}`)} // Card is clickable for navigation
    >
      {/* Color Indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ backgroundColor: office.color }}
      />

      {/* Content */}
      <div className="p-6 pl-8">
        {/* Image Section */}
        <div className="w-full mb-4 overflow-hidden rounded-lg">
          <img
            src={officeImage}
            alt="Office"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Office Name Section */}
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
          {office.name}
        </h3>

        {/* Location and Worker Count Section */}
        <p className="text-gray-600 mb-4 text-center">{office.location}</p>
        <div className="flex items-center justify-center text-gray-500">
          <Users size={20} className="mr-2" />
          <span>
            {workerCount} / {office.capacity} workers
          </span>
        </div>

        {/* Dropdown Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card navigation when clicking the dropdown button
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span className="ml-2">More Details</span>
          </button>
        </div>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div
            onClick={(e) => e.stopPropagation()} // Prevent card navigation when interacting with dropdown content
            className="mt-4 space-y-2 text-sm text-gray-800 bg-gradient-to-r from-blue-300 via-slate-50 to-blue-400  p-4 border rounded-lg shadow-lg"
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
      </div>
    </motion.div>
  );
}