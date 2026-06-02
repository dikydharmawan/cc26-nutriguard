/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

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
    consumed: { calorie: 0, sugar: 0, sodium: 0, hydration: 0 }
  });

  const [history, setHistory] = useState([]);

  const updateProfile = (newData) => {
    setUserProfile(prev => ({ ...prev, ...newData }));
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
