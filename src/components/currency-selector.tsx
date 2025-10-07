import { createContext, useContext, useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

interface CurrencyContextType {
  currency: typeof currencies[0];
  setCurrency: (currency: typeof currencies[0]) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState(currencies[0]);

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) {
      const found = currencies.find(c => c.code === saved);
      if (found) setCurrencyState(found);
    }
  }, []);

  const setCurrency = (newCurrency: typeof currencies[0]) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency.code);
  };

  const formatAmount = (amount: number) => {
    return `${currency.symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency.code} onValueChange={(code) => {
      const found = currencies.find(c => c.code === code);
      if (found) setCurrency(found);
    }}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>{currency.symbol} {currency.code}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
