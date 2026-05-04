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

export const calculateExtraChorePay = () => {
    let total = 0

    document.querySelectorAll(".extraChoreCheckbox").forEach((checkbox) => {
        if (checkbox.checked) {
            total += Number(checkbox.dataset.amount)
        }
    })

    return total
}