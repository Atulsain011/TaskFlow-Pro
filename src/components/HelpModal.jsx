import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, Monitor, Keyboard, Terminal, X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass p-8 rounded-2xl border-t-2 border-l-2 border-neon-green/50 shadow-neonSoft relative custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <BookOpen className="w-10 h-10 text-neon-green" />
              <h2 className="text-3xl font-sans font-bold tracking-wide text-neon-green">
                Operator Manual
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-neon-green/50 transition-colors">
                <h3 className="font-sans font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                  <Terminal size={20} className="text-blue-400" />
                  Task Directives
                </h3>
                <ul className="text-white/70 space-y-2 text-sm">
                  <li>• Click <strong>Add Task</strong> to create a new directive.</li>
                  <li>• Click the <strong>Modify (Edit)</strong> icon to update an existing directive.</li>
                  <li>• Click the <strong>Eradicate (Trash)</strong> icon to delete.</li>
                  <li>• Check the box on the left to mark a task as Executed (Completed).</li>
                  <li>• <strong>Drag and drop</strong> tasks by clicking anywhere on the item.</li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-neon-green/50 transition-colors">
                <h3 className="font-sans font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                  <Monitor size={20} className="text-yellow-400" />
                  Visual Interface (Theme)
                </h3>
                <p className="text-white/70 text-sm mb-2">
                  Toggle the theme using the monitor/sun/moon icon in the top right navigation bar.
                </p>
                <ul className="text-white/70 space-y-1 text-sm list-disc list-inside">
                  <li><strong>Neon:</strong> Extremely dark green with glowing accents.</li>
                  <li><strong>Dark:</strong> Standard pitch black with white text.</li>
                  <li><strong>Light:</strong> Bright interface for daytime operations.</li>
                </ul>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-white/5 hover:border-neon-green/50 transition-colors md:col-span-2">
                <h3 className="font-sans font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                  <Keyboard size={20} className="text-purple-400" />
                  Translation Matrix (Language)
                </h3>
                <p className="text-white/70 text-sm">
                  Click the globe icon in the top right navigation bar to cycle through available languages. 
                  Your preferences (Theme & Language) are saved automatically to your profile and persist across sessions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
