import BoxSeaction from "./BoxSection";


const defaultPeriods = [
    "Today", "This Week", "This month", "This year"
];

function Filter({
    value, onChange, className = "", options = defaultPeriods
}) {
    return (
        <BoxSeaction
            items={options}
            value={value}
            onValueChange={onChange}
            placeholder="Period"
            className={className}
        />
    )
}

export default Filter