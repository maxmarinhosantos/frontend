//fullstack/frontend/context/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theme, ThemeContextProps } from '../interfaces/theme';
import { ThemeStyles } from '../app/interfaces/theme';

const themes: Record<Theme, ThemeStyles> = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    button: '#6200EE',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    button: '#BB86FC',
  },
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Carregar tema inicial do backend ou localStorage
    setTheme('light'); // Exemplo: padrão "light"
  }, []);

  const setThemeHandler = (newTheme: Theme) => {
    setTheme(newTheme);
    // Atualizar tema no backend ou localStorage
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeHandler,
        themeStyles: themes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
