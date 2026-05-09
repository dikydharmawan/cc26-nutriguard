import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    name: 'Diky Dharmawan',
    email: 'diky@example.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    age: 25,
    gender: 'Laki-laki',
    weight: 70,
    height: 175
  });

  const [nutritionData, setNutritionData] = useState({
    dailyGoal: { calorie: 2200, sugar: 50, sodium: 2000, hydration: 2.5 },
    consumed: { calorie: 1420, sugar: 12, sodium: 1850, hydration: 1.8 }
  });

  const [history, setHistory] = useState([
    { id: 1, name: 'Susu UHT Full Cream', date: 'Hari ini, 08:30', cal: '150 kcal', status: 'Aman', color: '#3b7454' },
    { id: 2, name: 'Roti Gandum Utuh', date: 'Hari ini, 07:15', cal: '120 kcal', status: 'Aman', color: '#3b7454' },
    { id: 3, name: 'Keripik Kentang Balado', date: 'Kemarin, 19:45', cal: '320 kcal', status: 'Tinggi Natrium', color: '#9b4b45' },
    { id: 4, name: 'Minuman Boba Brown Sugar', date: 'Kemarin, 14:20', cal: '450 kcal', status: 'Tinggi Gula', color: '#9b4b45' },
    { id: 5, name: 'Yogurt Plain', date: '2 Hari lalu, 09:00', cal: '80 kcal', status: 'Aman', color: '#3b7454' }
  ]);

  const updateProfile = (newData) => {
    setUserProfile(prev => ({ ...prev, ...newData }));
  };

  const updateNutrition = (newData) => {
    setNutritionData(prev => ({
      ...prev,
      consumed: { ...prev.consumed, ...newData }
    }));
  };

  return (
    <AppContext.Provider value={{
      userProfile,
      updateProfile,
      nutritionData,
      updateNutrition,
      history,
      setHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
