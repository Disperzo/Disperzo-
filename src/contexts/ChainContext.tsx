import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChainContextType {
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const useChain = () => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
};

interface ChainProviderProps {
  children: ReactNode;
}

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState('ethereum');

  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </ChainContext.Provider>
  );
}; 