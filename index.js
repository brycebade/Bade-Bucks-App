import { children as starterChildren } from "./data.js"

import { 
dayChecks,
choresDisplay,
payDisplay,
payCheckbox,
childOption,
childName,
weekOption,
weekText,
resetButton,
extraChore,
extraPay,
choreList,
choreBtn,
noExtraChores 
} from "./dom.js"

import { 
  resetUI,
  renderSummary
 } from "./render.js"
 
import { 
  countCompletedDays,
  calculateBasePay,
  calculateTotalPay
} from "./calculations.js"

let children = JSON.parse(localStorage.getItem("children")) || starterChildren

const PASSWORD = "05012021"

let basePay = 0
let extraChorePay = 0
let selectedChild = null

const updateSummary = () => {
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
  const totalPay = calculateTotalPay(basePay, extraChorePay)

  renderSummary(count, totalPay)
}

function saveToStorage() {
    localStorage.setItem("children", JSON.stringify(children))
}

choreBtn.addEventListener("click", () => {
  const chore = extraChore.value.trim()
  const extraPayAmount = Number(extraPay.value)

  if (chore === "" || extraPay.value === "") return

  const formattedChore = chore.charAt(0).toUpperCase() + chore.slice(1)

  noExtraChores.style.display = "none"

  const li = document.createElement("li")
  li.classList.add("flex", "items-center", "gap-3")

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.classList.add("checkbox", "checkbox-primary", "checkbox-lg", "extraChoreCheckbox")

  const textSpan = document.createElement("span")
  textSpan.textContent = formattedChore
  //textSpan.style.margin = "0 10px"

  const deleteBtn = document.createElement("button")
  deleteBtn.textContent = "❌"
  deleteBtn.classList.add("ml-6")

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      extraChorePay += extraPayAmount
    } else {
      extraChorePay -= extraPayAmount
    }

    updateSummary()
})

  deleteBtn.addEventListener("click", () => {
    if (checkbox.checked) {
      checkbox.checked = false

      checkbox.dispatchEvent(new Event("change"))
    }

    textSpan.classList.toggle("line-through")
    textSpan.classList.toggle("opacity-60")
  })

  li.appendChild(checkbox)
  li.appendChild(textSpan)
  li.appendChild(deleteBtn)

  choreList.appendChild(li)

  extraChore.value = ""
  extraPay.value = ""
})

// POPULATE DROP DOWN LISTS

children.forEach((child) => {
    const childSelection = document.createElement("option")
    childSelection.textContent = child.name
    childSelection.value = child.id
    childOption.appendChild(childSelection)
})

const resetData = () => {
  basePay = 0
  extraChorePay = 0
}

// get Weekdate function

const getWeekday = (date) => {
  const weekday = date.getDay()
  const copyDate = new Date(date)
  let diff

  if (weekday === 0) {
      diff = date.getDate() - weekday - 6
  } else {
      diff = date.getDate() - weekday + 1
  }

  copyDate.setDate(diff)
  return copyDate
}

const today = new Date()
const currentWeek = getWeekday(today)

weekOption.innerHTML = `<option value="">Select Week</option>`

for (let i = -5; i <= 4; i++) {
  const weekDate = new Date(currentWeek)
  weekDate.setDate(currentWeek.getDate() + i * 7)

  const option = document.createElement("option")

  option.value = weekDate.toISOString().split("T")[0]
  option.textContent = weekDate.toDateString()

  weekOption.appendChild(option)
}

// CHANGE TEXT ON WEEK OF 

weekOption.addEventListener("change", () => {
  const selectedChildId = childOption.value
  const selectedWeekStart = weekOption.value

  if (selectedChildId === "" || selectedWeekStart === "") {
      weekText.textContent = "Week Of: "
      resetUI()
      return
  }

  localStorage.setItem("selectedChildId", selectedChildId)
  localStorage.setItem("selectedWeekStart", selectedWeekStart)

  const selectedWeekText = weekOption.options[weekOption.selectedIndex].text
  weekText.textContent = `Week Of: ${selectedWeekText}`

  selectedChild = children.find((child) => {
      return child.id === Number(selectedChildId)
  })

  if (!selectedChild) {
      return
  }

  let selectedWeek = selectedChild.weeks.find((week) => {
      return week.weekStart === selectedWeekStart
  })

  if (!selectedWeek) {
      selectedWeek = {
        weekStart: selectedWeekStart,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        isPaid: false
      }

      selectedChild.weeks.push(selectedWeek)
      saveToStorage()
  }

  dayChecks.forEach((dayCheck) => {
      const day = dayCheck.id
      dayCheck.checked = selectedWeek[day]
      dayCheck.disabled = selectedWeek.isPaid
  })

  payCheckbox.checked = selectedWeek.isPaid
  updateSummary()
})

// FUNCTIONS OF CHILD DROP DOWN LIST

childOption.addEventListener("change", () => {
  const selectedChildId = childOption.value

  localStorage.setItem("selectedChildId", selectedChildId)
  localStorage.removeItem("selectedWeekStart")
  
  const foundChild = children.find((child) => {
      return child.id === Number(selectedChildId)
  })

  weekOption.value = ""
  weekText.textContent = "Week Of: "

  if (!foundChild) {
      childName.textContent = ""
      resetUI()
      return
  }

  childName.textContent = foundChild.name
  resetUI()
})

dayChecks.forEach((dayCheck) => {
  dayCheck.addEventListener("change", (event) => {
    const selectedChildId = childOption.value;
    const selectedWeekStart = weekOption.value;
    const day = event.target.id;
    const isChecked = event.target.checked;

    if (selectedChildId === "" || selectedWeekStart === "") {
      return;
    }

    selectedChild = children.find((child) => {
      return child.id === Number(selectedChildId);
    });

    if (!selectedChild) {
      return;
    }

    let selectedWeek = selectedChild.weeks.find((week) => {
      return week.weekStart === selectedWeekStart;
    });

    if (!selectedWeek) {
        selectedWeek = {
            weekStart: selectedWeekStart,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            isPaid: false
        }

        selectedChild.weeks.push(selectedWeek)
        saveToStorage()
    }

    selectedWeek[day] = isChecked;

    updateSummary()
    saveToStorage()
  });
});

// UPDATE PAY

payCheckbox.addEventListener("change", () => {
  const selectedChildId = childOption.value;
  const selectedWeekStart = weekOption.value;

  if (selectedChildId === "" || selectedWeekStart === "") {
    return;
  }

  selectedChild = children.find((child) => {
    return child.id === Number(selectedChildId);
  });

  if (!selectedChild) {
    return
  }

  const selectedWeek = selectedChild.weeks.find((week) => {
    return week.weekStart === selectedWeekStart;
  });

  if (!selectedWeek) {
    return;
  }

  if (payCheckbox.checked === false) {
    const userInput = prompt("Enter Password")

    if (userInput !== PASSWORD) {
      payCheckbox.checked = true
      alert("Permission Denied")
      return
    }
  }

  selectedWeek.isPaid = payCheckbox.checked;

  dayChecks.forEach((dayCheck) => {
    if (payCheckbox.checked === true) {
      dayCheck.disabled = true;
    } else {
      dayCheck.disabled = false;
    }
  });

  updateSummary()
  saveToStorage()
});

const savedChildId = localStorage.getItem("selectedChildId")
const savedWeekStart = localStorage.getItem("selectedWeekStart")

if (savedChildId) {
    childOption.value = savedChildId

    selectedChild = children.find((child) => {
        return child.id === Number(savedChildId)
    })
        
    if (selectedChild) {
        childName.textContent = selectedChild.name
    }
}

if (savedChildId && savedWeekStart) {
    weekOption.value = savedWeekStart
    weekOption.dispatchEvent(new Event("change"))
}

resetButton.addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset all data?")
    if (!confirmReset) return
    
    localStorage.removeItem("children")
    localStorage.removeItem("selectedChildId")
    localStorage.removeItem("selectedWeekStart")
    location.reload()
})