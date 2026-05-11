import { dayChecks, payCheckbox } from "./dom.js"
import { renderSummary } from "./render.js"
import { 
    countCompletedDays, 
    calculateBasePay,
    calculateTotalPay,
    calculateExtraChorePay
 } from "./calculations.js"

 export const updateSummary = (selectedChild) => {
    if (!selectedChild) {
        renderSummary(0, 0)
        return
    }

    const count = countCompletedDays(dayChecks)

    if (payCheckbox.checked) {
        renderSummary(count, 0)
        return
    }

    const basePay = calculateBasePay(count, selectedChild.payRates)
    const extraChorePay = calculateExtraChorePay()
    const totalPay = calculateTotalPay(basePay, extraChorePay)

    renderSummary(count, totalPay)
 }