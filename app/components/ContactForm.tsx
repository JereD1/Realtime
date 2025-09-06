'use client';
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    console.log('Form submitted:', formData);
    
    // Add your form submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl">
        <p className="text-gray-400 text-sm mb-4 tracking-wide uppercase">
          Contact
        </p>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          We'd love to hear from you!
        </h1>
        
        <p className="text-gray-300 text-lg leading-relaxed">
          Whether you have a project in mind, want to collaborate, 
          or just have a question, feel free to reach out. We are 
          ready to help
        </p>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-lg space-y-6">
        {/* Name Input */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
            className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200"
          />
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200"
          />
        </div>

        {/* Message Textarea */}
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Write your message"
            rows={6}
            required
            className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold px-12 py-4 rounded-full text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isSubmitting ? 'SENDING...' : 'SEND'}
          </button>
        </div>
      </div>

      {/* Background Pattern Effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(120, 120, 120, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 70% 80%, rgba(120, 120, 120, 0.1) 0%, transparent 50%)`
        }}>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;