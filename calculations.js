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