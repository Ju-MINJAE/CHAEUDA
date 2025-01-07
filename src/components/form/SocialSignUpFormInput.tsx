import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SocialSignupFormData } from '@/app/auth/schemas/SocialSignInSchema';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  defaultValue?: string;
  register: UseFormRegister<SocialSignupFormData>;
  name: keyof SocialSignupFormData;
  errorMessage?: string;
  disabled?: boolean;
  placeholder: string | undefined;
}

const Input = ({ 
  label, 
  id, 
  type, 
  defaultValue,
  register, 
  name,
  errorMessage,
  disabled,
  placeholder
}: InputFieldProps) => {
  return (
    <div className='flex flex-col space-y-1.5'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        {...register(name)}
        className="border border-gray-400 w-full h-9 text-4 p-2"
        disabled={disabled}
        placeholder={placeholder}
      />
      {errorMessage && <p className="text-kick text-sm">{errorMessage}</p>}
    </div>
  );
};

export default Input;