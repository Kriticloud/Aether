import React, { createContext, useContext, useState, useMemo } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AED";

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 153.25,
  AED: 3.67,
};

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AED: "د.إ",
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("USD");

  const formatPrice = useMemo(() => {
    return (usdPrice: number) => {
      const converted = usdPrice * RATES[currency];
      const symbol = SYMBOLS[currency];
      const decimals = currency === "JPY" ? 0 : 0;
      return `${symbol}${converted.toLocaleString("en-US", { maximumFractionDigits: decimals })}`;
    };
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
