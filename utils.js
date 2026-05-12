export const getSelectedChild = (children, selectedChildId) => {
    return children.find((child) => {
        return child.id === selectedChildId
    })
}

export const getSelectedWeek = (selectedChild, selectedWeekStart) => {
    return selectedChild.weeks.find((week) => {
        return week.weekStart === selectedWeekStart
    })
}

export const createWeek = (selectedWeekStart) => {
    return {
        weekStart: selectedWeekStart,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        isPaid: false,
        extraChores: []
    }
}

export const ensureExtraChores = (selectedWeek) => {
    if (!selectedWeek.extraChores) {
        selectedWeek.extraChores = []
    }
}