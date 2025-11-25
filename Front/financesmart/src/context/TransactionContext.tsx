// src/context/TransactionsContext.tsx
import React, { createContext, useState, useContext, type ReactNode } from 'react';

// Define o formato de uma transação
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // Formato ISO YYYY-MM-DD
  category: string;
}

interface TransactionsContextData {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transactionInput: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transactionInput,
      id: crypto.randomUUID(), // Gera um ID único
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);