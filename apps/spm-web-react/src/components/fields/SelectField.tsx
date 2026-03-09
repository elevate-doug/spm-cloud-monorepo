import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  id?: string;
  extra?: string;
  placeholder?: string;
  variant?: string;
  state?: "error" | "success";
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
}

const SelectField: React.FC<SelectFieldProps> = (props) => {
  const {
    label,
    id,
    extra,
    placeholder,
    variant,
    state,
    disabled,
    value,
    onChange,
    options
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={`${extra}`}>
      {label && (
        <label
          htmlFor={id}
          className={`${
            variant === "auth"
              ? "mb-2 block text-sm font-medium text-navy-700 dark:text-white"
              : "ml-3 text-sm font-bold text-navy-700 dark:text-white"
          }`}
        >
          {label}
        </label>
      )}
      <select
        disabled={disabled}
        id={id}
        value={value}
        onChange={handleChange}
        className={`${variant !== "auth" ? "mt-2" : ""} w-full rounded-lg border px-4 py-3 text-sm outline-none cursor-pointer transition-colors ${
          variant === "auth"
            ? `bg-white dark:bg-navy-700 ${
                disabled
                  ? "!border-none !bg-gray-100 dark:!bg-white/5 text-gray-400"
                  : state === "error"
                  ? "border-red-500 text-red-500 dark:!border-red-400 dark:!text-red-400"
                  : state === "success"
                  ? "border-green-500 text-green-500 dark:!border-green-400 dark:!text-green-400"
                  : !value
                  ? "border-gray-200 text-gray-400 dark:border-navy-600 dark:text-gray-500"
                  : "border-gray-200 text-navy-700 dark:border-navy-600 dark:text-white"
              } focus:border-brand-500 dark:focus:border-brand-400`
            : `bg-white/0 ${
                disabled
                  ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:text-[rgba(255,255,255,0.15)]"
                  : state === "error"
                  ? "border-red-500 text-red-500 dark:!border-red-400 dark:!text-red-400"
                  : state === "success"
                  ? "border-green-500 text-green-500 dark:!border-green-400 dark:!text-green-400"
                  : !value
                  ? "border-gray-200 text-gray-400 dark:!border-white/10 dark:text-gray-400"
                  : "border-gray-200 text-navy-700 dark:!border-white/10 dark:text-white"
              }`
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-navy-700 dark:bg-navy-700 dark:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;