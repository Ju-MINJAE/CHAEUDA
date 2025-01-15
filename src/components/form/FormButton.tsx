import React, { ReactNode } from 'react';

interface FormButtonProps {
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const FormButton = ({ children, type = 'button', onClick }: FormButtonProps) => {
  return (
    <button type={type} className="bg-kick w-full h-10 text-4 text-white" onClick={onClick}>
      {children}
    </button>
  );
};

export default FormButton;
