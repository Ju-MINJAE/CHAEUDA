import React, { ReactNode } from 'react';

interface FormButtonProps {
  onClick?: () => void;
  children: ReactNode;
}

const FormButton = ({ children }: FormButtonProps) => {
  return (
    <>
      <button type="submit" className="bg-kick w-full h-10 text-4 text-white">
        {children}
      </button>
    </>
  );
};

export default FormButton;
