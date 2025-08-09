interface SearchWidgetProps {
  query: string
}

export default function SearchWidget({ query }: SearchWidgetProps) {
  const suggestions = [
    'Телевизор',
    'Телефон Samsung',
    'Телефон-лягушка'
  ].filter(item => item.toLowerCase().includes(query.toLowerCase()))

  if (suggestions.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
      <div className="p-2">
        <div className="text-xs text-gray-500 mb-2">Поиск</div>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
