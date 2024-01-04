import { useState, useMemo } from 'react';
import type { FC, JSX, ReactNode } from 'react';
import {
  type contextType,
  defaultContextValue,
  AppDataContext,
} from '../contexts/appData.ts';

type AppDataContextProps = {
  children: JSX.Element | JSX.Element[] | ReactNode;
};

export const AppDataContextProvider: FC<AppDataContextProps> = ({
  children,
}) => {
  const [originalColors, setOriginalColors] = useState<
    contextType['originalColors']
  >(defaultContextValue.originalColors);
  const [customColors, setCustomColors] = useState<contextType['customColors']>(
    defaultContextValue.customColors,
  );
  const [template, setTemplate] = useState<contextType['template']>(
    defaultContextValue.template,
  );
  const [templateKey, setTemplateKey] = useState<contextType['templateKey']>(
    defaultContextValue.templateKey,
  );

  const contextValue = useMemo(
    () => ({
      originalColors,
      customColors,
      template,
      templateKey,
      setOriginalColors,
      setCustomColors,
      setTemplate,
      setTemplateKey,
    }),
    [
      originalColors,
      customColors,
      template,
      templateKey,
      setOriginalColors,
      setCustomColors,
      setTemplate,
      setTemplateKey,
    ],
  );

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};
