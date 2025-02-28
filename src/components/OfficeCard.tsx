import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  Users as Capacity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import officeImage from "../assets/office.png";

// Define the Office type
interface Office {
  id: string;
  name: string;
  location: string;
  email?: string;
  phone?: string;
  capacity: number;
  color: string;
}

// Define the props for the OfficeCard component
interface OfficeCardProps {
  office: Office;
  workerCount: number;
  className?: string;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
}

const OfficeCard = memo(function OfficeCard({ 
  office, 
  workerCount, 
  className = "",
  isOpen = false,
  onToggle = () => {}
}: OfficeCardProps) {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  // Make sure toggle only affects the current card
  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(office.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Ensure we're not clicking on the dropdown area or its children
    if (!(e.target as HTMLElement).closest('.dropdown-area')) {
      navigate(`/office/${office.id}`);
    }
  };

  // Prevent any click in the dropdown content from propagating
  const handleDropdownContentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-white to-white rounded-lg shadow-lg ${className}`}
      onClick={handleCardClick}
      data-office-id={office.id} // Add data attribute for debugging
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

        {/* Dropdown Area */}
        <div 
          className="dropdown-area overflow-hidden mt-4" 
          onClick={handleDropdownContentClick}
        >
          {/* Dropdown Button */}
          <motion.button
            onClick={handleDropdownToggle}
            className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 transition-colors dropdown-area py-2 rounded-md"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            whileHover={{ 
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              transition: { duration: 0.2 }
            }}
            data-office-id={office.id}
          >
            <motion.div 
              className="flex items-center"
              animate={{ 
                color: isHovering ? "#3B82F6" : isOpen ? "#3B82F6" : "#4B5563"
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ 
                  rotate: isOpen ? 180 : 0,
                  y: isOpen ? -2 : 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <ChevronDown size={20} />
              </motion.div>
              <span className="ml-2 font-medium">More Details</span>
            </motion.div>
          </motion.button>

          {/* Dropdown Content with AnimatePresence for proper exit animations */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  height: "auto", 
                  y: 0,
                  transition: { 
                    height: { 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30 
                    },
                    opacity: { duration: 0.2, delay: 0.1 },
                    y: { 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 25 
                    }
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  y: -10,
                  transition: { 
                    height: { duration: 0.2 },
                    opacity: { duration: 0.2 },
                    y: { duration: 0.2 }
                  }
                }}
                className="mt-4 space-y-2 text-sm text-gray-800 overflow-hidden dropdown-area"
                onClick={handleDropdownContentClick}
              >
                <motion.div 
                  className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 rounded-lg border border-blue-100 shadow-lg relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { 
                      delay: 0.1,
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-200 rounded-full opacity-20" />
                  <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20" />
                  
                  <div className="relative z-10 space-y-3">
                    {/* Email */}
                    {office.email && (
                      <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: 0.2 }
                        }}
                      >
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <Mail size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Email</span>
                          <p className="font-medium">{office.email}</p>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Phone */}
                    {office.phone && (
                      <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: 0.3 }
                        }}
                      >
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <Phone size={16} className="text-green-600" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Phone</span>
                          <p className="font-medium">{office.phone}</p>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Location */}
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.4 }
                      }}
                    >
                      <div className="p-2 bg-red-100 rounded-full mr-3">
                        <MapPin size={16} className="text-red-600" />
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Location</span>
                        <p className="font-medium">{office.location}</p>
                      </div>
                    </motion.div>
                    
                    {/* Capacity */}
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.5 }
                      }}
                    >
                      <div className="p-2 bg-purple-100 rounded-full mr-3">
                        <Capacity size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Capacity</span>
                        <p className="font-medium">{office.capacity}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export { OfficeCard };