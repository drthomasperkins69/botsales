'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Camera,
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
  Check,
  Info,
  Loader2,
  ImagePlus,
  DollarSign,
  Bot,
} from 'lucide-react';
import { useAuthStore, useListingsStore } from '@/store';
import { ROBOT_CATEGORIES, ROBOT_BRANDS, ROBOT_CONDITIONS, RobotCategory, RobotCondition } from '@/types';

type Step = 1 | 2 | 3 | 4;

export default function SellPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addListing } = useListingsStore();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    category: '' as RobotCategory | '',
    brand: '',
    model: '',
    year: '',
    condition: '' as RobotCondition | '',

    // Step 2: Details
    title: '',
    description: '',
    features: [''],
    accessories: [''],

    // Step 3: Specifications
    dimensions: '',
    weight: '',
    batteryLife: '',
    connectivity: [] as string[],

    // Step 4: Price & Location
    price: '',
    negotiable: false,
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    postcode: user?.location?.postcode || '',
  });

  const [images, setImages] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/sell');
    }
  }, [isAuthenticated, router]);

  // Pre-fill location from user
  useEffect(() => {
    if (user?.location) {
      setFormData((prev) => ({
        ...prev,
        city: prev.city || user.location.city,
        state: prev.state || user.location.state,
        postcode: prev.postcode || user.location.postcode,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field: 'features' | 'accessories', index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: 'features' | 'accessories') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'features' | 'accessories', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleConnectivity = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      connectivity: prev.connectivity.includes(option)
        ? prev.connectivity.filter((c) => c !== option)
        : [...prev.connectivity, option],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // For demo, we'll use placeholder URLs
    const newImages = Array.from(files).map(
      () => `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=800&h=600&fit=crop`
    );
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.brand) newErrors.brand = 'Please select or enter a brand';
      if (!formData.model) newErrors.model = 'Please enter the model';
      if (!formData.condition) newErrors.condition = 'Please select the condition';
    }

    if (step === 2) {
      if (!formData.title) newErrors.title = 'Please enter a title';
      if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters';
      if (!formData.description) newErrors.description = 'Please enter a description';
      if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
      if (images.length === 0) newErrors.images = 'Please add at least one image';
    }

    if (step === 4) {
      if (!formData.price) newErrors.price = 'Please enter a price';
      if (Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
      if (!formData.city) newErrors.city = 'Please enter your city';
      if (!formData.state) newErrors.state = 'Please select your state';
      if (!formData.postcode) newErrors.postcode = 'Please enter your postcode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    if (!user) return;

    setLoading(true);

    try {
      const listingId = addListing({
        sellerId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category as RobotCategory,
        brand: formData.brand,
        model: formData.model,
        year: formData.year ? Number(formData.year) : undefined,
        condition: formData.condition as RobotCondition,
        price: Number(formData.price),
        negotiable: formData.negotiable,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop'],
        specifications: {
          dimensions: formData.dimensions || undefined,
          weight: formData.weight || undefined,
          batteryLife: formData.batteryLife || undefined,
          connectivity: formData.connectivity.length > 0 ? formData.connectivity : undefined,
          features: formData.features.filter((f) => f.trim()) || undefined,
          includedAccessories: formData.accessories.filter((a) => a.trim()) || undefined,
        },
        location: {
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
        },
        status: 'active',
      });

      router.push(`/listing/${listingId}?created=true`);
    } catch (error) {
      console.error('Error creating listing:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const connectivityOptions = ['WiFi', 'Bluetooth', 'USB', 'Alexa', 'Google Assistant', 'HomeKit', '4G/LTE', 'Zigbee', 'Z-Wave'];

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Specs' },
    { number: 4, title: 'Price' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sell Your Robot</h1>
          <p className="text-gray-600 mt-2">Create a listing in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span
                    className={`mt-2 text-sm hidden sm:block ${
                      currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {errors.submit && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROBOT_CATEGORIES.slice(0, 9).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        formData.category === cat.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select brand</option>
                    {ROBOT_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Roomba j7+"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year (Optional)</label>
                  <input
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="e.g. 2024"
                    min="2000"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.condition ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select condition</option>
                    {ROBOT_CONDITIONS.map((cond) => (
                      <option key={cond.id} value={cond.id}>
                        {cond.name}
                      </option>
                    ))}
                  </select>
                  {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Listing Details</h2>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos * <span className="text-gray-500 font-normal">(Up to 10)</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. iRobot Roomba j7+ Self-Emptying Robot Vacuum"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your robot, its condition, why you're selling, and what's included..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      placeholder="e.g. Self-emptying dustbin"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add feature
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Specifications */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Info className="w-4 h-4" />
                These details help buyers find your robot
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                  <input
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 33 x 33 x 9 cm"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 3.4 kg"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Battery Life</label>
                  <input
                    name="batteryLife"
                    value={formData.batteryLife}
                    onChange={handleChange}
                    placeholder="e.g. 90 minutes"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Connectivity</label>
                <div className="flex flex-wrap gap-2">
                  {connectivityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleConnectivity(option)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        formData.connectivity.includes(option)
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Included Accessories</label>
                {formData.accessories.map((accessory, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      value={accessory}
                      onChange={(e) => handleArrayChange('accessories', index, e.target.value)}
                      placeholder="e.g. Charging dock"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.accessories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('accessories', index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('accessories')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add accessory
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Price & Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Price & Location</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asking Price (AUD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}

                <label className="flex items-center gap-2 mt-3">
                  <input
                    name="negotiable"
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Price is negotiable</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                  <div>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">State</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="QLD">QLD</option>
                      <option value="WA">WA</option>
                      <option value="SA">SA</option>
                      <option value="TAS">TAS</option>
                      <option value="ACT">ACT</option>
                      <option value="NT">NT</option>
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>
                  <div>
                    <input
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="Postcode"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.postcode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.postcode && <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Listing Preview</h3>
                <div className="flex gap-4">
                  {images[0] ? (
                    <img src={images[0]} alt="" className="w-24 h-24 rounded-lg object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{formData.title || 'Your listing title'}</h4>
                    <p className="text-sm text-gray-500">
                      {formData.brand} {formData.model}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      ${formData.price || '0'}
                      {formData.negotiable && <span className="text-sm font-normal text-green-600 ml-2">Negotiable</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
                Cancel
              </Link>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Listing
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
