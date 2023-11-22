export const list = [
    { label: "LHS Desk", value: '0'},
    { label: "LACoFD", value: '1'},
    { label: "SP", value: '2'},
    { label: "NPS", value: '3'},
    { label: "MRCA", value: '4'},
    { label: "CHP", value: '5'},
    { label: "Drone Requested", value: '6'}
]

export const indicesToLabels = (items: string[]): string[] => {

    const selectedLabels: string[] = [];

        items.forEach((value: string) => {
            const foundItem = list.find(item => item.value === value);
            if (foundItem) {
                selectedLabels.push(foundItem.label);
            }
        });
    
    return selectedLabels;
}

export const labelsToIndices = (items: string[]): string[] => {
    const selectedIndices: string[] = [];

        items.forEach((value: string) => {
            const foundItem = list.find(item => item.label === value);
            if (foundItem) {
                selectedIndices.push(`${foundItem.value}`);
            }
        });
    
    return selectedIndices;
}

