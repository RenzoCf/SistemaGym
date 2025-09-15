// src/components/ClientDashboard.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, CreditCard, MapPin, Clock, TrendingUp, Dumbbell, Users, ChevronRight } from 'lucide-react';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = esta semana, -1 = semana pasada, etc.

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Datos simulados - después vendrán del backend
  const userSede = "FitFlow Centro";
  const availableSedes = [
    { id: 1, name: "FitFlow Centro", address: "Av. Arequipa 1234", isUserSede: true, distance: "Tu sede principal" },
    { id: 2, name: "FitFlow Norte", address: "Av. Universitaria 567", isUserSede: false, distance: "15 min en auto" },
    { id: 3, name: "FitFlow Sur", address: "Av. Aviación 890", isUserSede: false, distance: "25 min en auto" }
  ];

  const upcomingClasses = [
    { id: 1, name: "HIIT Intensivo", instructor: "Carlos Ruiz", time: "18:00 - 19:00", date: "Hoy", sede: "Centro", spots: "3/15", type: "reservable" },
    { id: 2, name: "Yoga Flow", instructor: "María García", time: "19:30 - 20:30", date: "Hoy", sede: "Centro", spots: "8/12", type: "reservable" },
    { id: 3, name: "CrossFit", instructor: "Andrea López", time: "07:00 - 08:00", date: "Mañana", sede: "Centro", spots: "2/10", type: "reservable" },
    { id: 4, name: "Spinning", instructor: "Roberto Silva", time: "18:30 - 19:30", date: "Mañana", sede: "Norte", spots: "5/20", type: "reservable" }
  ];

  const generateWeekSchedule = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7AM a 7PM
    
    const weekDays = days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        day,
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString()
      };
    });

    // Datos simulados de asistencia
    const attendanceData = {
      'Lun-7': 'gym', 'Lun-8': 'gym', 'Lun-9': 'gym',
      'Mar-18': 'class-hiit', 'Mar-19': 'class-hiit',
      'Mié-7': 'gym', 'Mié-8': 'gym',
      'Vie-19': 'class-yoga', 'Vie-20': 'class-yoga',
      'Sáb-10': 'gym', 'Sáb-11': 'gym', 'Sáb-12': 'gym'
    };

    return { weekDays, hours, attendanceData };
  };

  const { weekDays, hours, attendanceData } = generateWeekSchedule(selectedWeek);

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'gym': return 'bg-blue-500 text-white text-xs px-1 py-0.5 rounded';
      case 'class-hiit': return 'bg-red-500 text-white text-xs px-1 py-0.5 rounded';
      case 'class-yoga': return 'bg-green-500 text-white text-xs px-1 py-0.5 rounded';
      case 'class-spinning': return 'bg-purple-500 text-white text-xs px-1 py-0.5 rounded';
      default: return '';
    }
  };

  const getActivityText = (activity) => {
    switch (activity) {
      case 'gym': return 'Gym';
      case 'class-hiit': return 'HIIT';
      case 'class-yoga': return 'Yoga';
      case 'class-spinning': return 'Spin';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                🏋️‍♂️
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitFlow</h1>
                <p className="text-sm text-gray-500">Mi sede: {userSede}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Tu progreso fitness y actividades programadas
          </p>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Asistencias esta semana</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clases este mes</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Horas de gym</p>
                <p className="text-2xl font-bold text-gray-900">24h</p>
              </div>
              <Dumbbell className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Racha actual</p>
                <p className="text-2xl font-bold text-gray-900">12 días</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Horario Semanal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Mi Horario de Asistencia</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedWeek(selectedWeek - 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ←
                  </button>
                  <span className="text-sm font-medium">
                    {selectedWeek === 0 ? 'Esta semana' : `${Math.abs(selectedWeek)} semana${Math.abs(selectedWeek) > 1 ? 's' : ''} ${selectedWeek < 0 ? 'atrás' : 'adelante'}`}
                  </span>
                  <button 
                    onClick={() => setSelectedWeek(selectedWeek + 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    disabled={selectedWeek >= 0}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Grid del horario */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-1 min-w-full">
                  {/* Header con días */}
                  <div className="p-2 text-center font-medium text-gray-600 text-sm">Hora</div>
                  {weekDays.map((day) => (
                    <div key={day.day} className={`p-2 text-center text-sm font-medium ${day.isToday ? 'bg-blue-100 text-blue-800 rounded-lg' : 'text-gray-600'}`}>
                      <div>{day.day}</div>
                      <div className="text-xs">{day.date}</div>
                    </div>
                  ))}

                  {/* Filas por hora */}
                  {hours.map((hour) => (
                    <>
                      <div key={hour} className="p-2 text-center text-sm text-gray-500 font-medium">
                        {hour}:00
                      </div>
                      {weekDays.map((day) => {
                        const key = `${day.day}-${hour}`;
                        const activity = attendanceData[key];
                        return (
                          <div key={`${day.day}-${hour}`} className="p-1 text-center min-h-[40px] border border-gray-100">
                            {activity && (
                              <span className={getActivityColor(activity)}>
                                {getActivityText(activity)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>

              {/* Leyenda */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">Gym</span>
                  <span className="text-gray-600">Entrenamiento libre</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">HIIT</span>
                  <span className="text-gray-600">Clase HIIT</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">Yoga</span>
                  <span className="text-gray-600">Clase Yoga</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Clases para Reservar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clases Disponibles</h3>
              <div className="space-y-3">
                {upcomingClasses.slice(0, 3).map((clase) => (
                  <div key={clase.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{clase.name}</h4>
                        <p className="text-sm text-gray-600">{clase.instructor}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {clase.spots}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{clase.date} • {clase.time}</p>
                    <p className="text-xs text-blue-600">{clase.sede}</p>
                    <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors">
                      Reservar
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center">
                Ver todas las clases <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Sedes Disponibles */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuestras Sedes</h3>
              <div className="space-y-3">
                {availableSedes.map((sede) => (
                  <div key={sede.id} className={`p-3 rounded-lg border ${sede.isUserSede ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center">
                          {sede.name}
                          {sede.isUserSede && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Mi sede</span>}
                        </h4>
                        <p className="text-sm text-gray-600">{sede.address}</p>
                        <p className="text-xs text-gray-500">{sede.distance}</p>
                      </div>
                      <MapPin className={`h-5 w-5 ${sede.isUserSede ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceso Rápido al Gym */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceso Rápido</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <div className="bg-blue-600 text-white p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    📱
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Código QR de Acceso</h4>
                  <div className="bg-white p-3 rounded-lg border-2 border-dashed border-gray-300 mb-3">
                    <div className="text-2xl">⬛⬜⬛⬜⬛</div>
                    <div className="text-2xl">⬜⬛⬜⬛⬜</div>
                  </div>
                  <p className="text-xs text-gray-600">Muestra este código en recepción</p>
                </div>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Check-in Manual
                </button>
              </div>
            </div>

            {/* Progreso Semanal */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mi Progreso</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Meta semanal</span>
                    <span className="font-medium">5/4 días</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">¡Meta superada! 🎉</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Horas este mes</span>
                    <span className="font-medium">24/30h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notificaciones/Recordatorios */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recordatorios</h3>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="bg-yellow-500 text-white p-1 rounded-full mr-3 mt-0.5">
                    ⏰
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Clase de Yoga</p>
                    <p className="text-xs text-gray-600">Hoy 7:30 PM - Sede Centro</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="bg-green-500 text-white p-1 rounded-full mr-3 mt-0.5">
                    💳
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Renovación próxima</p>
                    <p className="text-xs text-gray-600">Tu membresía vence en 23 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;