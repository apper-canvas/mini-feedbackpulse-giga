import React from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon="Search"
        className="pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          icon="X"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
        />
      )}
    </div>
  )
}

export default SearchBar