// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';

const RegisterForm = ({ onToggleForm }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      clearError();
    }
  };

  // Validaciones del formulario
  const validateForm = () => {
    const errors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.firstName)) {
      errors.firstName = 'El nombre solo puede contener letras';
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.lastName)) {
      errors.lastName = 'El apellido solo puede contener letras';
    }

    // Validar email
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar teléfono (opcional)
    if (formData.phone && !/^[0-9]{9}$/.test(formData.phone)) {
      errors.phone = 'El teléfono debe tener 9 dígitos';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      // El redirect se maneja en el componente padre
    } catch (error) {
      // El error se maneja en el contexto
      console.error('Error en registro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              🏋️‍♂️
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Únete a FitFlow
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta y comienza tu journey fitness
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                ⚠️ {error}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Juan"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Pérez"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  validationErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="juan@email.com"
                disabled={isLoading}
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono <span className="text-gray-400">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  validationErrors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="987654321"
                disabled={isLoading}
              />
            </div>
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  validationErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  validationErrors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Crear Cuenta</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onToggleForm}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              disabled={isLoading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <span className={`mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                {formData.password.length >= 8 ? '✓' : '○'}
              </span>
              Mínimo 8 caracteres
            </li>
            <li className="flex items-center">
              <span className={`mr-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                {/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}
              </span>
              Al menos una letra minúscula
            </li>
            <li className="flex items-center">
              <span className={`mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                {/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}
              </span>
              Al menos una letra mayúscula
            </li>
            <li className="flex items-center">
              <span className={`mr-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                {/(?=.*\d)/.test(formData.password) ? '✓' : '○'}
              </span>
              Al menos un número
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;