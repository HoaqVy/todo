import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";

function BoxSeaction({ className = "", items = [], placeholder = "Select", value, onValueChange }) {
    return (
        <div className={`relative ${className}`}>
            <Combobox items={items} value={value} onValueChange={onValueChange}>
                <ComboboxInput placeholder={placeholder} className="h-10" />

                <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>

                    <ComboboxList>
                        {(item) => (
                            <ComboboxItem key={item} value={item}>
                                {item}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}

export default BoxSeaction;