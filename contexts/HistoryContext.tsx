import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HistoryContextType {
  history: string[];
  addToHistory: (bazarId: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem('history');
    if (data) setHistory(JSON.parse(data));
  };

  const addToHistory = async (bazarId: string) => {
    const newHistory = [bazarId, ...history.filter(id => id !== bazarId)].slice(0, 10);
    setHistory(newHistory);
    await AsyncStorage.setItem('history', JSON.stringify(newHistory));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('history');
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};
