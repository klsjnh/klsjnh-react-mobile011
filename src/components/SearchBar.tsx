/**
 * 搜索栏组件
 */
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  filterOptions?: { label: string; value: string }[];
  onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '搜索...',
  filterValue,
  onFilterChange,
  filterOptions,
  onSearch,
}) => (
  <div className="search-bar">
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        style={{
          flex: 1,
          height: '36px',
          padding: '0 12px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: '14px',
          outline: 'none',
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
      />
      {filterOptions && onFilterChange && (
        <select
          style={{
            height: '36px',
            padding: '0 8px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '13px',
            background: '#fff',
            outline: 'none',
          }}
          value={filterValue || ''}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </div>
  </div>
);
