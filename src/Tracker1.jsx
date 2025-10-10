import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

function Tracker1() {
  const [habit, setHabit] = useState("");
  const [habitList, setHabitList] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Time and date effects
  useEffect(() => {
    const timeInterval = setInterval(() => setTime(new Date()), 1000);
    const dateInterval = setInterval(() => setDate(new Date()), 86400000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(dateInterval);
    };
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedHabits = localStorage.getItem("habitList");
      const storedTheme = localStorage.getItem("darkMode");
      
      if (storedHabits) setHabitList(JSON.parse(storedHabits));
      if (storedTheme) setDarkMode(JSON.parse(storedTheme));
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem("habitList", JSON.stringify(habitList));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [habitList, darkMode, isLoading]);

  const addHabit = () => {
    if (!habit.trim()) {
      alert('Please enter a habit');
      return;
    }
    
    setHabitList([...habitList, {
      id: Date.now(),
      text: habit,
      completed: false,
      dateCompleted: null,
      streak: 0
    }]);
    
    setHabit("");
  };

  const deleteHabit = (id) => {
    setHabitList(habitList.filter(habit => id !== habit.id));
  };

  const toggleComplete = (id) => {
    const today = new Date().toLocaleDateString("en-GB");
    const updatedList = habitList.map(habit => {
      if (habit.id === id) {
        const wasCompleted = habit.completed;
        return {
          ...habit,
          completed: !habit.completed,
          dateCompleted: !habit.completed ? today : null,
          streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    
    setHabitList(updatedList);
  };

  const clearAllHabits = () => {
    if (window.confirm("Are you sure you want to clear all habits?")) {
      setHabitList([]);
    }
  };

  const completedCount = habitList.filter(h => h.completed).length;
  const totalCount = habitList.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Habit Tracker
            </h1>
            <p className="text-sm opacity-80">
              {date.toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • 
              <span className="ml-1">{time.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center justify-start w-12 h-6 rounded-full p-1 transition-all duration-300 ${darkMode ? "bg-purple-600" : "bg-gray-200"}`}
            aria-label="Toggle dark mode"
          >
            <div 
              className={`w-4 h-4 rounded-full shadow-md flex items-center justify-center  cursor-pointer transition-transform duration-300 ${darkMode ? "bg-gray-100 translate-x-6" : "bg-yellow-400 translate-x-0"}`}
            >
              {darkMode ? <FiMoon size={10} /> : <FiSun size={10} />}
            </div>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Habit Input and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Habit Form */}
            <div className={`p-6 rounded-xl shadow-lg transition-all ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter a new habit..."
                  className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  value={habit}
                  onChange={(e) => setHabit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                />
                <button
                  onClick={addHabit}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex justify-center items-center gap-2 transition-colors"
                >
                  <div className='flex gap-2 justify-center items-center  cursor-pointer'><FiPlus /> Add</div>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {habitList.length > 0 && (
              <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Daily Progress</h3>
                  <span className="text-sm font-medium">{completedCount}/{totalCount} ({completionPercentage}%)</span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Habit List */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Your Habits</h3>
              </div>
              
              {habitList.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <FiPlus className="text-blue-600 dark:text-blue-300 text-2xl" />
                  </div>
                  <h4 className="text-lg font-medium mb-1">No habits yet</h4>
                  <p className="text-gray-500 dark:text-gray-400">Add your first habit to get started!</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {habitList.map((habit) => (
                    <li
                      key={habit.id}
                      className={`p-4 ${habit.completed ? (darkMode ? "bg-gray-700/50" : "bg-green-50") : ""}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleComplete(habit.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border cursor-pointer flex items-center justify-center transition-colors ${habit.completed ? "bg-green-500 border-green-500 text-white" : darkMode ? "border-gray-500 hover:border-blue-500" : "border-gray-300 hover:border-blue-500"}`}
                            aria-label={habit.completed ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {habit.completed && <FiCheck size={14} />}
                          </button>
                          
                          <span 
                            onClick={() => toggleComplete(habit.id)}
                            className={`flex-1 truncate cursor-pointer ${habit.completed ? (darkMode ? "text-gray-400 line-through" : "text-gray-500 line-through") : ""}`}
                          >
                            {habit.text}
                          </span>
                          
                          {habit.streak > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800"}`}>
                              🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {habit.completed && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {habit.dateCompleted}
                            </span>
                          )}
              
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-1 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                            aria-label="Delete habit"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              
              {habitList.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={clearAllHabits}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FiTrash2 /> Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with Stats */}
          <div className="space-y-6">
            {/* Completion Stats */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"} text-center`}>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedCount}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-purple-50"} text-center`}>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalCount - completedCount}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Habits */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-lg font-semibold mb-4">Completed Today</h3>
              
              {completedCount > 0 ? (
                <ul className="space-y-3">
                  {habitList.filter(h => h.completed).map(habit => (
                    <li key={habit.id} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <FiCheck size={12} />
                      </div>
                      <span className="flex-1">{habit.text}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{habit.dateCompleted}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                    <FiX className="text-gray-400 text-xl" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No habits completed yet</p>
                </div>
              )}
            </div>

            {/* Pending Habits */}
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-lg font-semibold mb-4">Pending Habits</h3>
              
              {(totalCount - completedCount) > 0 ? (
                <ul className="space-y-3">
                  {habitList.filter(h => !h.completed).map(habit => (
                    <li key={habit.id} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${darkMode ? "border-gray-500" : "border-gray-300"}`}></div>
                      <span>{habit.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                    <FiCheck className="text-green-500 dark:text-green-400 text-xl" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">All caught up!</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Great job completing all your habits</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracker1;