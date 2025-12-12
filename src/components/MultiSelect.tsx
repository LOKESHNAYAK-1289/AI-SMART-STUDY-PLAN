import React, { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  maxSelections = 10
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else if (selected.length < maxSelections) {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string) => {
    onChange(selected.filter(item => item !== value));
  };

  const getSelectedLabels = () => {
    return selected.map(value => 
      options.find(option => option.value === value)?.label || value
    );
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] p-2 border border-gray-300 rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 ? (
              <span className="text-gray-500 py-1">{placeholder}</span>
            ) : (
              getSelectedLabels().map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(selected[index]);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            const isDisabled = !isSelected && selected.length >= maxSelections;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => !isDisabled && toggleOption(option.value)}
                disabled={isDisabled}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-700' 
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}

      {selected.length >= maxSelections && (
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxSelections} selections allowed
        </p>
      )}
    </div>
  );
};

export default MultiSelect;