import { useState, useMemo, useCallback } from 'react';
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
  const [isIdle, setIsIdle] = useState<contextType['isIdle']>(
    defaultContextValue.isIdle,
  );
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
  const [printerTemplate, setPrinterTemplate] = useState<
    contextType['printerTemplate']
  >(defaultContextValue.printerTemplate);
  const [printerTemplateKey, setPrinterTemplateKey] = useState<
    contextType['printerTemplateKey']
  >(defaultContextValue.printerTemplateKey);
  const [printOptions, setPrintOptions] = useState<contextType['printOptions']>(
    defaultContextValue.printOptions,
  );

  const mergePrintOptions = useCallback(
    (partialOptions: Partial<contextType['printOptions']>) => {
      setPrintOptions({ ...printOptions, ...partialOptions });
    },
    [printOptions, setPrintOptions],
  );

  const contextValue = useMemo(
    () => ({
      originalColors,
      customColors,
      template,
      templateKey,
      printerTemplate,
      printerTemplateKey,
      printOptions,
      isIdle,
      setOriginalColors,
      setCustomColors,
      setTemplate,
      setTemplateKey,
      setPrinterTemplate,
      setPrinterTemplateKey,
      setPrintOptions: mergePrintOptions,
      setIsIdle,
    }),
    [
      originalColors,
      customColors,
      template,
      templateKey,
      printerTemplate,
      printerTemplateKey,
      isIdle,
      printOptions,
      setOriginalColors,
      setCustomColors,
      setTemplate,
      setTemplateKey,
      setPrinterTemplate,
      setPrinterTemplateKey,
      mergePrintOptions,
    ],
  );

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};
