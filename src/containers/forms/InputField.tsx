import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, name, type, value, error, onChange }: InputFieldProps) => (
  <div>
    <label htmlFor={name} className="mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="border border-black p-2"
    />
    {error && <span>{error}</span>}
  </div>
);

export default InputField;
