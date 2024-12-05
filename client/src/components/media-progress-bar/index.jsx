import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressbar({ isMediaUploading, mediaProgress }) {
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        if (isMediaUploading) {
            setShowProgress(true);
        } else if (mediaProgress >= 100) {
            const timer = setTimeout(() => {
                setShowProgress(false); // Hide after some delay
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isMediaUploading, mediaProgress]);

    if (!showProgress) return null;

    return (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-5 mt-5 relative overflow-hidden shadow-inner">
            {/* Main Progress */}
            <motion.div
                className="h-4 rounded-full"
                style={{
                    background: `linear-gradient(90deg, #34d399, #3b82f6)`, // Gradient colors
                    boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)", // Glow effect
                }}
                initial={{ width: 0 }}
                animate={{
                    width: `${mediaProgress}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {/* Completion Effect */}
            {mediaProgress >= 100 && (
                <motion.div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-30"
                    animate={{
                        x: ["0%", "100%"],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            )}
        </div>
    );
}

export default MediaProgressbar;
