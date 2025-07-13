import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Copy, Check, Lightbulb, Target, MessageSquare, Settings, TrendingUp, BarChart3, Users, Edit3, Plus, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// Icon mapping for dynamic icons
const iconMap = {
  Target,
  MessageSquare,
  Settings,
  TrendingUp,
  BarChart3,
  Users
};

const SmartPromptWriter = () => {
  const [businessProfile, setBusinessProfile] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    mainProduct: '',
    keyChallenge: '',
    businessSize: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState('');
  const [showUseCases, setShowUseCases] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [showBestPractices, setShowBestPractices] = useState(false);

  const bestPractices = [
    {
      title: "Be Specific with Context",
      tip: "The more details you provide about your business, the better the AI can tailor its response to your needs."
    },
    {
      title: "Include Your Goals",
      tip: "Always specify what you want to achieve - whether it's increasing sales, improving efficiency, or building brand awareness."
    },
    {
      title: "Ask for Examples",
      tip: "Request specific examples, templates, or step-by-step instructions rather than general advice."
    },
    {
      title: "Specify Format Preferences",
      tip: "Tell the AI how you want the response formatted - bullet points, paragraphs, templates, etc."
    },
    {
      title: "Request Multiple Options",
      tip: "Ask for 2-3 different approaches or variations to give you more choices and inspiration."
    },
    {
      title: "Include Success Metrics",
      tip: "Ask how to measure success and what KPIs to track for your specific initiative."
    }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to empty array or show error message
    } finally {
      setLoading(false);
    }
  };

  const interpolateTemplate = (template, profile) => {
    return template
      .replace(/\{businessName\}/g, profile.businessName || '[Your Business Name]')
      .replace(/\{industry\}/g, profile.industry || '[Your Industry]')
      .replace(/\{targetAudience\}/g, profile.targetAudience || '[Your Target Audience]')
      .replace(/\{mainProduct\}/g, profile.mainProduct || '[Your Main Product/Service]')
      .replace(/\{keyChallenge\}/g, profile.keyChallenge || '[Your Key Challenge]')
      .replace(/\{businessSize\}/g, profile.businessSize || '[Your Business Size]');
  };

  const handleGeneratePrompt = (categoryId, useCaseIndex = null) => {
    if (!businessProfile.businessName || !businessProfile.industry) {
      alert('Please fill in at least your business name and industry before generating a prompt.');
      return;
    }
    
    setSelectedCategory(categoryId);
    
    if (useCaseIndex !== null) {
      const category = categories.find(c => c.id === categoryId);
      const useCase = category?.use_cases[useCaseIndex];
      if (useCase) {
        const interpolatedTemplate = interpolateTemplate(useCase.template, businessProfile);
        setGeneratedPrompt(interpolatedTemplate);
        setSelectedUseCase(useCase.name);
        setShowUseCases(false);
      }
    } else {
      setShowUseCases(true);
      setGeneratedPrompt('');
      setSelectedUseCase('');
    }
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (field, value) => {
    setBusinessProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Target;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Prompt Writer</h1>
          <p className="text-gray-600">Generate AI prompts tailored to your small business needs</p>
          <div className="mt-4">
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Business Profile Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
                value={businessProfile.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Restaurant, Retail, Consulting"
                value={businessProfile.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Small business owners, Young professionals"
                value={businessProfile.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Product/Service</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Web design, Italian food, Business coaching"
                value={businessProfile.mainProduct}
                onChange={(e) => handleInputChange('mainProduct', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Challenge</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Getting more customers, Improving efficiency"
                value={businessProfile.keyChallenge}
                onChange={(e) => handleInputChange('keyChallenge', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Size</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={businessProfile.businessSize}
                onChange={(e) => handleInputChange('businessSize', e.target.value)}
              >
                <option value="">Select size</option>
                <option value="Solo entrepreneur">Solo entrepreneur</option>
                <option value="2-5 employees">2-5 employees</option>
                <option value="6-20 employees">6-20 employees</option>
                <option value="21-50 employees">21-50 employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Best Practices Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowBestPractices(!showBestPractices)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Lightbulb className="w-5 h-5" />
            {showBestPractices ? 'Hide' : 'Show'} Best Practices for Writing Prompts
          </button>
        </div>

        {/* Best Practices Section */}
        {showBestPractices && (
          <div className="mb-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Best Practices for Effective Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestPractices.map((practice, index) => (
                <div key={index} className="bg-white p-4 rounded-md border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">{practice.title}</h4>
                  <p className="text-sm text-gray-700">{practice.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Prompt Category</h2>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No categories available. Please add categories in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleGeneratePrompt(category.id)}
                    className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-md ${category.color} text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{category.example}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Use Cases Dropdown */}
        {showUseCases && selectedCategory && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Choose a specific use case for {categories.find(c => c.id === selectedCategory)?.name}:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.find(c => c.id === selectedCategory)?.use_cases.map((useCase, index) => (
                <button
                  key={index}
                  onClick={() => handleGeneratePrompt(selectedCategory, index)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{useCase.name}</h3>
                  <p className="text-sm text-gray-600">{useCase.example}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generated Prompt Section */}
        {generatedPrompt && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Generated Prompt: {selectedUseCase}
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 border-l-4 border-blue-500">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-800">
                <strong>How to use:</strong> Copy this prompt and paste it into your preferred AI tool (ChatGPT, Claude, etc.). 
                You can modify any part of it to better fit your specific needs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingUseCase, setEditingUseCase] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddUseCase, setShowAddUseCase] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'Target',
    color: 'bg-blue-500',
    example: ''
  });

  const [useCaseForm, setUseCaseForm] = useState({
    name: '',
    template: '',
    example: ''
  });

  const iconOptions = ['Target', 'MessageSquare', 'Settings', 'TrendingUp', 'BarChart3', 'Users'];
  const colorOptions = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/admin/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/categories`, categoryForm);
      fetchCategories();
      setShowAddCategory(false);
      setCategoryForm({ name: '', icon: 'Target', color: 'bg-blue-500', example: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/admin/categories/${editingCategory.id}`, editingCategory);
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all its use cases.')) {
      try {
        await axios.delete(`${API}/admin/categories/${categoryId}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const handleAddUseCase = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/categories/${showAddUseCase}/use-cases`, useCaseForm);
      fetchCategories();
      setShowAddUseCase(null);
      setUseCaseForm({ name: '', template: '', example: '' });
    } catch (error) {
      console.error('Error adding use case:', error);
      alert('Error adding use case. Please try again.');
    }
  };

  const handleEditUseCase = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/admin/use-cases/${editingUseCase.id}`, editingUseCase);
      fetchCategories();
      setEditingUseCase(null);
    } catch (error) {
      console.error('Error updating use case:', error);
      alert('Error updating use case. Please try again.');
    }
  };

  const handleDeleteUseCase = async (useCaseId) => {
    if (window.confirm('Are you sure you want to delete this use case?')) {
      try {
        await axios.delete(`${API}/admin/use-cases/${useCaseId}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting use case:', error);
        alert('Error deleting use case. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage categories and use cases</p>
          <div className="mt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              ← Back to App
            </Link>
          </div>
        </div>

        {/* Add Category Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Example Description</label>
                <textarea
                  value={categoryForm.example}
                  onChange={(e) => setCategoryForm({...categoryForm, example: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${category.color} text-white`}>
                    {React.createElement(iconMap[category.icon] || Target, { className: "w-5 h-5" })}
                  </div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowAddUseCase(category.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Use Case
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{category.example}</p>
              
              {/* Use Cases */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Use Cases:</h4>
                {category.use_cases.map((useCase) => (
                  <div key={useCase.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{useCase.name}</h5>
                        <p className="text-sm text-gray-600">{useCase.example}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingUseCase(useCase)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUseCase(useCase.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Use Case Form */}
              {showAddUseCase === category.id && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-4">Add Use Case to {category.name}</h4>
                  <form onSubmit={handleAddUseCase} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Use Case Name</label>
                      <input
                        type="text"
                        value={useCaseForm.name}
                        onChange={(e) => setUseCaseForm({...useCaseForm, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                      <textarea
                        value={useCaseForm.template}
                        onChange={(e) => setUseCaseForm({...useCaseForm, template: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="8"
                        placeholder="Use placeholders like {businessName}, {industry}, {targetAudience}, {mainProduct}, {keyChallenge}, {businessSize}"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Example Description</label>
                      <textarea
                        value={useCaseForm.example}
                        onChange={(e) => setUseCaseForm({...useCaseForm, example: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Use Case
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUseCase(null)}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
              <form onSubmit={handleEditCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <select
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {colorOptions.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Example Description</label>
                  <textarea
                    value={editingCategory.example}
                    onChange={(e) => setEditingCategory({...editingCategory, example: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Use Case Modal */}
        {editingUseCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">Edit Use Case</h3>
              <form onSubmit={handleEditUseCase} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Use Case Name</label>
                  <input
                    type="text"
                    value={editingUseCase.name}
                    onChange={(e) => setEditingUseCase({...editingUseCase, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <textarea
                    value={editingUseCase.template}
                    onChange={(e) => setEditingUseCase({...editingUseCase, template: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="8"
                    placeholder="Use placeholders like {businessName}, {industry}, {targetAudience}, {mainProduct}, {keyChallenge}, {businessSize}"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Example Description</label>
                  <textarea
                    value={editingUseCase.example}
                    onChange={(e) => setEditingUseCase({...editingUseCase, example: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUseCase(null)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartPromptWriter />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;