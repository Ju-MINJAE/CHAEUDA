import React, { ReactNode } from 'react';

interface FormButtonProps {
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const FormButton = ({ children, type = 'button', onClick, disabled = false }: FormButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full h-10 text-4 text-white ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-kick cursor-pointer'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default FormButton;
