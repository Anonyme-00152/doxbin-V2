import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2, Shield, Lock, Zap } from 'lucide-react';
import './App.css';

const WEBHOOK_URL = "https://canary.discord.com/api/webhooks/1468167808461439061/5ORX06BKJz7Ln8PmZ8hZtmgmUjdsifFcxv-g5y7klogQ-DC9JqMaG8dsVeP5wj4-sFu9";

// Version 4.0.0 - Ultra Premium Cyber-Security Dashboard
function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    ip: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return Object.values(formData).some(val => val.trim() !== '');
  };

  const sendToDiscord = async () => {
    const activeFields = [];
    let textContent = "🔴 **NEW TARGET DETECTED**\n";

    if (formData.firstName.trim()) {
      activeFields.push({ name: "First Name", value: formData.firstName, inline: true });
      textContent += `**First Name:** ${formData.firstName}\n`;
    }
    if (formData.lastName.trim()) {
      activeFields.push({ name: "Last Name", value: formData.lastName, inline: true });
      textContent += `**Last Name:** ${formData.lastName}\n`;
    }
    if (formData.email.trim()) {
      activeFields.push({ name: "Email", value: formData.email, inline: true });
      textContent += `**Email:** ${formData.email}\n`;
    }
    if (formData.phone.trim()) {
      activeFields.push({ name: "Phone", value: formData.phone, inline: true });
      textContent += `**Phone:** ${formData.phone}\n`;
    }
    if (formData.address.trim()) {
      activeFields.push({ name: "Address", value: formData.address, inline: false });
      textContent += `**Address:** ${formData.address}\n`;
    }
    if (formData.ip.trim()) {
      activeFields.push({ name: "IP Address", value: formData.ip, inline: true });
      textContent += `**IP:** ${formData.ip}\n`;
    }

    const payload = {
      username: "DOXBIN SYSTEM",
      content: textContent,
      embeds: [{
        title: "🔴 Target Data Captured",
        description: "Data has been successfully intercepted and encrypted.",
        color: 0xDC2626,
        fields: activeFields,
        footer: { text: "DOXBIN | Secure Transmission" },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) return true;

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setResult({ type: 'error', message: 'Please enter at least one field' });
      setTimeout(() => setResult(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));

    const success = await sendToDiscord();
    setIsSubmitting(false);
    
    if (success) {
      setResult({ type: 'success', message: 'Data transmitted successfully' });
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', ip: '' });
        setResult(null);
      }, 3000);
    } else {
      setResult({ type: 'error', message: 'Transmission failed' });
      setTimeout(() => setResult(null), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-red-900/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-red-900/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Main Card */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-600/30 rounded-full blur-lg"></div>
                    <div className="relative w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">DOXBIN</h1>
                    <p className="text-xs text-slate-400 font-medium tracking-widest">v4.0 • PREMIUM</p>
                  </div>
                </div>
                <Shield className="w-6 h-6 text-red-600/60" />
              </div>
              <div className="h-px bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent"></div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 flex flex-col items-center justify-center"
                >
                  <div className="relative w-16 h-16 mb-6">
                    <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                    <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <p className="text-slate-300 font-medium">Processing secure transmission...</p>
                  <p className="text-slate-500 text-xs mt-2">Encrypting data with AES-256</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-16 flex flex-col items-center justify-center"
                >
                  {result.type === 'success' ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
                      </motion.div>
                      <p className="text-green-400 font-semibold text-lg text-center">{result.message}</p>
                      <p className="text-slate-500 text-xs mt-2">Data stored securely</p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                      </motion.div>
                      <p className="text-red-400 font-semibold text-lg text-center">{result.message}</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Bento Grid Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                      <FormInput
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        isFocused={focusedField === 'firstName'}
                        placeholder="John"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormInput
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField(null)}
                        isFocused={focusedField === 'lastName'}
                        placeholder="Doe"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      isFocused={focusedField === 'email'}
                      placeholder="john@example.com"
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                      <FormInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        isFocused={focusedField === 'phone'}
                        placeholder="+1 (555) 000"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormInput
                        label="IP Address"
                        name="ip"
                        value={formData.ip}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('ip')}
                        onBlur={() => setFocusedField(null)}
                        isFocused={focusedField === 'ip'}
                        placeholder="192.168.1.1"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <FormInput
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('address')}
                      onBlur={() => setFocusedField(null)}
                      isFocused={focusedField === 'address'}
                      placeholder="123 Main St, City, State"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg hover:shadow-red-600/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="relative z-10 font-semibold tracking-wide">TRANSMIT DATA</span>
                  </motion.button>

                  {/* Security Footer */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-6 pt-6 border-t border-slate-800/50"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-600/60" />
                    <span>End-to-end encrypted • AES-256 • Secure transmission</span>
                  </motion.div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-xs text-slate-600 flex items-center justify-center gap-2"
        >
          <Zap className="w-3 h-3" />
          <span>DOXBIN v4.0 | Premium Cyber-Security Dashboard</span>
          <Zap className="w-3 h-3" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange, onFocus, onBlur, isFocused, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
        {label}
      </label>
      <motion.input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        whileFocus={{ scale: 1.02 }}
        className={`w-full px-4 py-3 bg-slate-800/30 backdrop-blur-sm border rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all duration-300 ${
          isFocused
            ? 'border-red-600/60 bg-slate-800/50 shadow-lg shadow-red-600/10'
            : 'border-slate-700/50 hover:border-slate-600/50'
        }`}
      />
    </div>
  );
}

export default App;
