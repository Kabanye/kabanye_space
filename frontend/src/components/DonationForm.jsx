import { useState } from 'react';
import { 
  Phone, 
  User, 
  MessageSquare, 
  Loader, 
  Wallet,
  Heart,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Coffee,
  Star,
  Gem,
  Rocket,
  Crown,
  Shield,
  Zap,
  X,
  Sparkles
} from 'lucide-react';
import { createDonation } from '../services/api';

const DonationForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    amount: '',
    phone_number: '',
    name: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [
    { value: 50, icon: Coffee, label: 'Coffee', gradient: 'from-amber-400 to-orange-500' },
    { value: 100, icon: Star, label: 'Star', gradient: 'from-blue-400 to-cyan-500' },
    { value: 500, icon: Gem, label: 'Gem', gradient: 'from-violet-400 to-purple-500' },
    { value: 1000, icon: Rocket, label: 'Rocket', gradient: 'from-rose-400 to-pink-500' },
    { value: 5000, icon: Crown, label: 'Crown', gradient: 'from-amber-400 to-yellow-500' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || formData.amount < 1) newErrors.amount = 'Minimum KES 1';
    if (formData.amount > 150000) newErrors.amount = 'Maximum KES 150,000';
    
    const phoneRegex = /^(?:\+254|254|0)?[17]\d{8}$/;
    if (!phoneRegex.test(formData.phone_number.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone_number = 'Enter a valid M-Pesa number';
    }
    if (formData.message && formData.message.length > 500) newErrors.message = 'Max 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      let phone = formData.phone_number.replace(/[\s\-\(\)]/g, '');
      if (phone.startsWith('0')) phone = '254' + phone.slice(1);
      else if (phone.startsWith('+')) phone = phone.slice(1);
      
      const response = await createDonation({
        amount: parseFloat(formData.amount),
        phone_number: phone,
        name: formData.name?.trim() || undefined,
        message: formData.message?.trim() || undefined,
      });
      
      onSuccess(response.data);
    } catch (error) {
      onError(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 mb-3 shadow-xl shadow-green-200/50">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Support the Journey</h3>
        <p className="text-gray-500 text-sm mt-0.5">Every contribution makes a difference</p>
      </div>

      {/* Quick Amount Pills */}
      <div>
        <label className="flex items-center text-xs font-semibold text-gray-700 mb-3">
          <Wallet className="w-4 h-4 mr-2 text-green-600" />
          Choose Amount
        </label>
        
        <div className="grid grid-cols-5 gap-2">
          {quickAmounts.map((amount) => {
            const IconComponent = amount.icon;
            const isSelected = selectedAmount === amount.value;
            return (
              <button
                key={amount.value}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, amount: amount.value.toString() }));
                  setSelectedAmount(amount.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                }}
                className={`relative p-3 rounded-xl transition-all duration-200 flex flex-col items-center gap-1 border-2 ${
                  isSelected
                    ? `bg-gradient-to-br ${amount.gradient} text-white border-transparent shadow-lg scale-105 -translate-y-0.5`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                <span className="text-[10px] font-bold">{amount.label}</span>
                <span className={`text-[11px] font-extrabold ${isSelected ? 'text-white/90' : 'text-gray-900'}`}>
                  {amount.value}
                </span>
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Amount */}
      <div>
        <div className="relative">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, amount: e.target.value }));
              setSelectedAmount(null);
              if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
            }}
            placeholder="Enter custom amount"
            className="w-full px-5 py-3.5 bg-white rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">KES</span>
          {formData.amount && (
            <button type="button" onClick={() => { setFormData(prev => ({ ...prev, amount: '' })); setSelectedAmount(null); }} className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {errors.amount && (
          <p className="flex items-center text-red-500 text-xs mt-1.5 ml-1"><AlertCircle className="w-3 h-3 mr-1.5 flex-shrink-0" />{errors.amount}</p>
        )}
      </div>

      {/* Phone & Name - Side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Phone */}
        <div>
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-2 text-green-600" />
            M-Pesa Number
          </label>
          <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-50 transition-all duration-200">
            <span className="pl-4 pr-1 text-sm font-bold text-gray-500">+254</span>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="712 345 678"
              className="w-full px-2 py-3 bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {formData.phone_number && !errors.phone_number && (
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-4 flex-shrink-0" />
            )}
          </div>
          {errors.phone_number && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phone_number}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-green-600" />
            Name <span className="text-gray-400 font-normal ml-1">— Optional</span>
          </label>
          <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-50 transition-all duration-200">
            <User className="w-4 h-4 text-gray-400 ml-4 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-1 py-3 bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
              maxLength="100"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
          Message <span className="text-gray-400 font-normal ml-1">— Optional</span>
        </label>
        <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-50 transition-all duration-200">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Leave a message of support..."
            className="w-full px-5 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
            rows="3"
            maxLength="500"
          />
          <div className="flex justify-between items-center px-5 py-2.5 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-400">
              <span className={formData.message.length > 0 ? 'text-green-600 font-semibold' : ''}>{formData.message.length}</span>
              <span className="mx-0.5">/</span>500
            </span>
            {errors.message && <span className="text-red-500 text-xs">{errors.message}</span>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="relative w-full group mt-2"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500" />
        <div className="relative w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-200 hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {loading ? (
            <span className="relative z-10 flex items-center justify-center text-base">
              <Loader className="w-5 h-5 mr-3 animate-spin" />
              Sending STK Push...
            </span>
          ) : (
            <span className="relative z-10 flex items-center justify-center text-base">
              <Heart className="w-4 h-4 mr-2" />
              Donate via M-Pesa
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </div>
      </button>

      {/* Trust Footer */}
      <div className="flex items-center justify-center gap-5 pt-2 pb-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          Secure M-Pesa
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Zap className="w-3.5 h-3.5 text-green-500" />
          Instant STK Push
        </div>
      </div>
    </form>
  );
};

export default DonationForm;