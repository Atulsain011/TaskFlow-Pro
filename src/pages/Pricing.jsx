import PricingSection from '../components/PricingSection';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-20 px-4"
    >
      <PricingSection />
    </motion.div>
  );
};

export default Pricing;
