import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import { Office } from '../types';
import { motion } from 'framer-motion';
import officeImage from '../assets/office.png';

interface OfficeCardProps {
  office: Office;
  workerCount: number;
}

export function OfficeCard({ office, workerCount }: OfficeCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative w-full bg-gradient-to-r from-white via-cyan-100 to-neutral-100 rounded-lg shadow-lg overflow-hidden cursor-pointer"
      onClick={() => navigate(`/office/${office.id}`)}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ backgroundColor: office.color }}
      />
      <div className="p-6 pl-8">
        {/* Image Section */}
        <div className="w-full mb-4 overflow-hidden rounded-lg">
          <img 
            src={officeImage} 
            alt="Office" 
            className="w-full h-48 object-cover" // Ensure the image takes full width and has a fixed height
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
          <span>{workerCount} / {office.capacity} workers</span>
        </div>
      </div>
    </motion.div>
  );
}