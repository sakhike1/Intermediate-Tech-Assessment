import React, { useEffect, useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Office } from '../types';
import { OfficeCard } from '../components/OfficeCard';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

export function Home() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [workerCounts, setWorkerCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    fetchOffices();
    animateBackground();
  }, []);

  async function fetchOffices() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return;
    }

    const { data: offices, error } = await supabase
      .from('offices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offices:', error);
      return;
    }

    setOffices(offices || []);

    offices?.forEach(async (office) => {
      const { count } = await supabase
        .from('workers')
        .select('*', { count: 'exact' })
        .eq('office_id', office.id);

      setWorkerCounts(prev => ({
        ...prev,
        [office.id]: count || 0
      }));
    });
  }

  const animateBackground = async () => {
    while (true) {
      await controls.start({
        backgroundPosition: ['0% 50%', '100% 50%'],
        transition: { duration: 10, repeat: Infinity, repeatType: 'mirror' }
      });
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const bounceAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      className="min-h-screen"
      animate={controls}
      style={{
        background: 'linear-gradient(270deg, #f3e7e9, #e3eeff, #e3fdf5)',
        backgroundSize: '300% 300%'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Office Spaces</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={offices.length === 0 ? bounceAnimation : {}}
            onClick={() => navigate('/office/new')}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        {offices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              animate={floatingAnimation}
              className="mb-8"
            >
              <Building2 size={120} className="text-blue-300" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Offices Yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Start by adding your first office space. Click the plus button to create a new office.
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-blue-50 p-6 rounded-xl border-2 border-blue-100 backdrop-blur-sm bg-opacity-60"
            >
              <p className="text-blue-600 font-medium">
                💡 Tip: You can customize each office with its own color and capacity
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OfficeCard
                  office={office}
                  workerCount={workerCounts[office.id] || 0}
                  className="backdrop-blur-sm bg-opacity-60"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}