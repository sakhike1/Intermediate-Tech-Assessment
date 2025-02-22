import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import { Office } from '../types';
import { motion } from 'framer-motion';

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
      className="relative w-full bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
      onClick={() => navigate(`/office/${office.id}`)}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ backgroundColor: office.color }}
      />
      <div className="p-6 pl-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{office.name}</h3>
          <Building2 className="text-gray-500" size={24} />
        </div>
        <p className="text-gray-600 mb-4">{office.location}</p>
        <div className="flex items-center text-gray-500">
          <Users size={20} className="mr-2" />
          <span>{workerCount} / {office.capacity} workers</span>
        </div>
      </div>
    </motion.div>
  );
}