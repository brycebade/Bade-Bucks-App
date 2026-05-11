export const countCompletedDays = (dayChecks) => {
    let count = 0

    dayChecks.forEach((dayCheck) => {
        if (dayCheck.checked) {
            count++
        }
    })

    return count
}

export const calculateBasePay = (count, payRates) => {
    return payRates[count] ?? 0
}

export const calculateTotalPay = (basePay, extraChorePay) => {
    return basePay + extraChorePay
}

export const calculateExtraChorePay = (selectedWeek) => {
    if (!selectedWeek || !selectedWeek.extraChores) {
        return 0
    }

    return selectedWeek.extraChores.reduce((total, chore) => {
        if (chore.completed) {
            return total + chore.amount
        }

        return total
    }, 0)
}