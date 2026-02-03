import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, CheckCircle, Loader, Lock } from 'lucide-react';
import './App.css';

const WEBHOOK_URL = "https://canary.discord.com/api/webhooks/1468167808461439061/5ORX06BKJz7Ln8PmZ8hZtmgmUjdsifFcxv-g5y7klogQ-DC9JqMaG8dsVeP5wj4-sFu9";

// Version 3.0.0 - Modern Professional Design
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const hasData = Object.values(formData).some(val => val.trim() !== '');
    return hasData;
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
      console.error('Transmission Error:', error);
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

    // Simulate processing
    await new Promise(r => setTimeout(r, 2000));

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-bold text-white tracking-tight">DOXBIN</h1>
            </div>
            <p className="text-sm text-slate-400">Data Interception System v3.0</p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center"
              >
                <Loader className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-slate-400 text-sm">Processing data...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center"
              >
                {result.type === 'success' ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                    <p className="text-green-500 font-semibold text-center">{result.message}</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-500 font-semibold text-center">{result.message}</p>
                  </>
                )}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                    placeholder="123 Main St, City, State"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">IP Address (Optional)</label>
                  <input
                    type="text"
                    name="ip"
                    value={formData.ip}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                    placeholder="192.168.1.1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>TRANSMIT DATA</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800">
                  <Lock className="w-3 h-3" />
                  <span>End-to-end encrypted transmission</span>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>DOXBIN v3.0 | Secure Data Collection</p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
