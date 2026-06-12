import React, { createContext, useContext, useState } from "react";

interface CompareContextType {
  compareIds: number[];
  toggleCompare: (uniId: number) => void;
  clearCompare: () => void;
  showCompare: boolean;
  setShowCompare: (show: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (uniId: number) => {
    setCompareIds((prev) =>
      prev.includes(uniId) ? prev.filter((id) => id !== uniId) : [...prev, uniId].slice(-2)
    );
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        toggleCompare,
        clearCompare,
        showCompare,
        setShowCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
