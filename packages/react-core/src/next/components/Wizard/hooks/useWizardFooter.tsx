import React from 'react';
import { useWizardContext } from '../WizardContext';

/**
 * Set a unique footer for the wizard. stepId is only required if inactive steps are hidden instead of unmounted.
 * @param footer
 * @param stepId
 */
export const useWizardFooter = (footer: React.ReactElement, stepId?: string | number) => {
  const { activeStep, setFooter } = useWizardContext();

  React.useEffect(() => {
    if (!stepId || activeStep.id === stepId) {
      setFooter(footer);

      // Reset the footer on unmount.
      return () => {
        setFooter(null);
      };
    }
  }, [activeStep, footer, setFooter, stepId]);
};
