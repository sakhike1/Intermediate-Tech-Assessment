import {Worker} from "../types";
import {Mail, Briefcase} from "lucide-react";
import {motion} from "framer-motion";

interface WorkerCardProps {
    worker: Worker;
    onEdit: (worker: Worker) => void;
    onDelete: (id: string) => void;
}

export function WorkerCard({worker, onEdit, onDelete}: WorkerCardProps) {
    return (
        <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            className="bg-gradient-to-r from-white via-cyan-100 to-neutral-100 rounded-lg shadow-md p-4 flex items-center space-x-4"
        >
            <img
                src={worker.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.email}`}
                alt={worker.name}
                className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{worker.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                    <Briefcase size={16} className="mr-2" />
                    <span>{worker.position}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                    <Mail size={16} className="mr-2" />
                    <span>{worker.email}</span>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(worker)}
                    className="p-2 text-black hover:bg-blue-50 rounded-full transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(worker.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                    Delete
                </button>
            </div>
        </motion.div>
    );
}
