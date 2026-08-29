import BoxSeaction from "./BoxSection";


const periods = [
    "Today", "This Week", "This month", "This year"
];

function Filter({
    value, onChange, className = ""
}) {
    return (
        <BoxSeaction
            items={periods}
            value={value}
            onValueChange={onChange}
            placeholder="Period"
            className={className}
        />
    )
}

export default Filter