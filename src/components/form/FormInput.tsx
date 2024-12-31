import React from 'react';
import { UseFormRegister, FieldErrors  } from 'react-hook-form';
import { SignupFormData } from '@/app/auth/schemas/FormSchema';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  register: UseFormRegister<SignupFormData>;
  name: keyof SignupFormData;
  errorMessage?: string;
  errors?: FieldErrors<SignupFormData>;
  disabled?: boolean;
}

const Input = ({ 
  label, 
  id, 
  type, 
  register, 
  name,
  errorMessage,
  disabled 
}: InputFieldProps) => {
  return (
    <div className='flex flex-col space-y-1.5'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        {...register(name)}
        className="border border-gray-400 w-full h-9 text-4 cursor-pointer p-2"
        disabled={disabled}
      />
      {errorMessage && <p className="text-kick text-sm">{errorMessage}</p>}
    </div>
  );
};

export default Input;