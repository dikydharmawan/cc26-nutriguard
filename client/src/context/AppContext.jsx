/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [nutritionData, setNutritionData] = useState(() => {
    const saved = localStorage.getItem('nutritionData');
    return saved ? JSON.parse(saved) : {
      dailyGoal: { calorie: 2200, sugar: 50, sodium: 2000, hydration: 2.5 },
      consumed: { calorie: 0, sugar: 0, sodium: 0, hydration: 0 }
    };
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('scanHistory');
    return saved ? JSON.parse(saved) : [];
  });



  useEffect(() => {
    localStorage.setItem('nutritionData', JSON.stringify(nutritionData));
  }, [nutritionData]);

  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'undefined' && token !== 'null') {
      setIsAuthenticated(true);
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile && savedProfile !== 'undefined' && savedProfile !== 'null') {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed && (parsed.name === 'Diky Dharmawan' || parsed.name === 'Pengguna')) {
            parsed.name = 'Sobat Sehat';
            parsed.avatar = 'https://ui-avatars.com/api/?name=Sobat+Sehat&background=random';
            localStorage.setItem('userProfile', JSON.stringify(parsed));
          }
          setUserProfile(parsed);
        } catch (e) {
          console.error("Error parsing user profile from localStorage", e);
        }
      } else {
        setUserProfile({
          name: 'Sobat Sehat',
          email: 'user@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Sobat+Sehat&background=random',
          age: 25,
          gender: 'Laki-laki',
          weight: 70,
          height: 175
        });
      }
      fetchHistory();
    } else {
      setIsAuthenticated(false);
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    
    const storedName = localStorage.getItem(`userName_${email}`);
    const defaultName = storedName || 'Sobat Sehat';

    // Check if there is already a saved profile for this email, otherwise set default
    const savedProfile = localStorage.getItem('userProfile');
    let profile = savedProfile ? JSON.parse(savedProfile) : null;
    
    // If no profile or profile belongs to a different email, create a new one
    if (!profile || profile.email !== email || profile.name === 'Diky Dharmawan' || profile.name === 'Pengguna') {
      profile = {
        name: defaultName,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=random`,
        age: 25,
        gender: 'Laki-laki',
        weight: 70,
        height: 175
      };
    }
    
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));

    await fetchHistory();
  };

  const register = async (name, email, password) => {
    await api.post('/auth/register', { email, password });
    if (name) {
      localStorage.setItem(`userName_${email}`, name);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
    setUserProfile(null);
    setHistory([]);
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/logs');
      // Assume paginated list or array
      const logs = Array.isArray(res.data) ? res.data : (res.data.data || res.data.logs || []);
      
      // Merge with local storage to prevent reset
      const saved = localStorage.getItem('scanHistory');
      const prevLocal = saved ? JSON.parse(saved) : [];
      const combined = [...logs, ...prevLocal];
      const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
      unique.sort((a, b) => {
        if (typeof a.id === 'number' && typeof b.id === 'number') return b.id - a.id;
        return 0;
      });

      setHistory(unique);
      calculateConsumed(unique);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const calculateConsumed = (logs) => {
    const today = new Date().toDateString();
    let calorie = 0;
    let sugar = 0;
    let sodium = 0;
    
    logs.forEach(log => {
      const logDate = new Date(log.createdAt || log.date).toDateString();
      if (logDate === today) {
        calorie += Number(log.nutrition?.calorie || log.calories) || 0;
        sugar += Number(log.nutrition?.sugar || log.sugar) || 0;
        sodium += Number(log.nutrition?.sodium || log.sodium) || 0;
      }
    });

    setNutritionData(prev => ({
      ...prev,
      consumed: { calorie, sugar, sodium, hydration: prev.consumed.hydration }
    }));
  };

  const updateProfile = (newData) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      return updated;
    });
  };

  const updateNutrition = (newData) => {
    setNutritionData(prev => {
      const updatedConsumed = { ...prev.consumed };
      Object.keys(newData).forEach(key => {
        if (typeof newData[key] === 'number' && typeof updatedConsumed[key] === 'number') {
          updatedConsumed[key] += newData[key];
        } else {
          updatedConsumed[key] = newData[key];
        }
      });
      return {
        ...prev,
        consumed: updatedConsumed
      };
    });
  };

  return (
    <AppContext.Provider value={{
      isAuthLoading,
      isAuthenticated,
      userProfile,
      login,
      register,
      logout,
      updateProfile,
      nutritionData,
      updateNutrition,
      history,
      setHistory,
      fetchHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
