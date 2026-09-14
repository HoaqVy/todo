function Filter({
    value = "",
    onChange,
    options = [],
    placeholder = "Select", 
    className = ""
}) {

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`h-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 outline-none focus:border-gray-400 ${className}`}
        >
            <option value="" disabled>
                {placeholder}
            </option>
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    )
}

export default Filter