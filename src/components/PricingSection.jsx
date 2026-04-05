import { motion } from 'framer-motion';
import { Check, X, ShieldCheck, Zap, Server, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: "Free",
    id: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for students and casual users getting started.",
    features: [
      "Basic task management",
      "Limited projects (3 max)",
      "Basic UI theme",
    ],
    missingFeatures: [
      "AI Smart Suggest",
      "Task reminders & notifications",
      "Task analytics & tracking",
      "Advanced UI themes"
    ],
    buttonText: "Current Plan",
    isPopular: false,
    colorClasses: "border-white/10 text-white/50"
  },
  {
    name: "Pro",
    id: "pro",
    monthlyPrice: 99,
    yearlyPrice: 950,
    description: "Ideal for professionals needing advanced tools & themes.",
    features: [
      "Everything in Free",
      "AI Smart Suggest (Subtasks)",
      "Unlimited tasks & projects",
      "Task reminders & browser notifications",
      "Multiple UI themes (Neon, Dark, Custom)",
      "Priority tasks",
      "Task analytics & tracking"
    ],
    missingFeatures: [
      "Team collaboration",
      "Priority Support"
    ],
    buttonText: "Upgrade to Pro",
    isPopular: true,
    colorClasses: "border-neon-green text-neon-green shadow-neon"
  },
  {
    name: "Business",
    id: "business",
    monthlyPrice: 299,
    yearlyPrice: 2870,
    description: "For teams and startups scaling their operations.",
    features: [
      "Everything in Pro",
      "Team collaboration (multi-user)",
      "Admin controls & permissions",
      "Priority Support",
      "Custom UI tailoring"
    ],
    missingFeatures: [],
    buttonText: "Contact Sales",
    isPopular: false,
    colorClasses: "border-purple-500/50 hover:border-purple-500 text-purple-400"
  }
];

const PricingCard = ({ plan, isYearly, currentPlan, onUpgrade }) => {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const period = isYearly ? "/yr" : "/mo";
  const isCurrent = currentPlan === plan.id;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative glass-neon rounded-3xl p-8 flex flex-col border bg-black/40 transition-all ${plan.colorClasses} ${plan.isPopular ? 'scale-105 bg-black/60 z-10' : 'opacity-80 hover:opacity-100'}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-green text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-neon">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-6">{plan.description}</p>
      
      <div className="flex items-end gap-1 mb-8">
        <span className="text-4xl font-bold text-white">₹{price}</span>
        {price > 0 && <span className="text-white/30 text-sm pb-1">{period}</span>}
      </div>

      <button 
        onClick={() => onUpgrade(plan.id)}
        disabled={isCurrent}
        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 mb-8 
        ${plan.isPopular 
          ? 'btn-neon shadow-neon' 
          : isCurrent ? 'bg-white/10 text-white/40 cursor-default' : 'border border-white/10 hover:bg-white/5 text-white'}`}
      >
        {isCurrent ? "Active Plan" : plan.buttonText}
      </button>

      <div className="flex-grow flex flex-col gap-4">
        {plan.features.map((feature, i) => (
          <div key={`f-${i}`} className="flex items-start gap-3">
            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.isPopular ? 'text-neon-green' : 'text-white/60'}`} />
            <span className="text-xs text-white/80">{feature}</span>
          </div>
        ))}
        {plan.missingFeatures.map((feature, i) => (
          <div key={`mf-${i}`} className="flex items-start gap-3 opacity-30">
            <X className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="text-xs text-white/50">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const PricingSection = ({ currentPlan, onUpgrade }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="w-full py-20 px-4">
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-neon-green mb-4"
        >
          <Zap size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Plans & Pricing</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Choose Your <span className="text-neon-green">Productivity</span> Level
        </h2>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-xs font-bold transition-colors ${!isYearly ? 'text-white' : 'text-white/30'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6 bg-white/5 rounded-full relative p-1 border border-white/10"
          >
            <motion.div 
              className="w-4 h-4 bg-neon-green rounded-full shadow-neon"
              animate={{ x: isYearly ? 24 : 0 }}
            />
          </button>
          <span className={`text-xs font-bold transition-colors flex items-center gap-2 ${isYearly ? 'text-white' : 'text-white/30'}`}>
            Yearly
            <span className="bg-neon-green/20 text-neon-green text-[8px] px-2 py-0.5 rounded-full border border-neon-green/30">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map(plan => (
          <PricingCard key={plan.id} plan={plan} isYearly={isYearly} currentPlan={currentPlan} onUpgrade={onUpgrade} />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
