import React from 'react';

interface InputProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({ min=0, max=100, value, onChange, label, id = 'number-input' }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      onChange(value);
    }
  };

  return (
    <div className="card">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;