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