export const countCompletedDays = (dayChecks) => {
    let count = 0

    dayChecks.forEach((dayCheck) => {
        if (dayCheck.checked) {
            count++
        }
    })

    return count
}