import { children as starterChildren } from "./data.js"

let children = JSON.parse(localStorage.getItem("children")) || starterChildren

const dayChecks = document.querySelectorAll(".dayCheckbox")
const choresDisplay = document.getElementById("choresCompleted")
const payDisplay = document.getElementById("payDue")
const payCheckbox = document.getElementById("paidCheckbox")
const childOption = document.getElementById("childOption")
const childName = document.getElementById("childName")
const weekOption = document.getElementById("weekOption")
const weekText = document.getElementById("week")
const resetButton = document.getElementById("resetStorage")
const PASSWORD = "05012021"

function saveToStorage() {
    localStorage.setItem("children", JSON.stringify(children))
}

// POPULATE DROP DOWN LISTS

children.forEach((child) => {
    const childSelection = document.createElement("option")
    childSelection.textContent = child.name
    childSelection.value = child.id
    childOption.appendChild(childSelection)
})

const resetUI = () => {
  dayChecks.forEach((dayCheck) => {
    dayCheck.checked = false
    dayCheck.disabled = false
  })

  payCheckbox.checked = false
  choresDisplay.textContent = `Chores Completed: 0`
  payDisplay.textContent = `Pay Due: $0`
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

const savedChildId = localStorage.getItem("selectedChildId")
const savedWeekStart = localStorage.getItem("selectedWeekStart")

if (savedChildId) {
    childOption.value = savedChildId

    const selectedChild = children.find((child) => {
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

  const selectedChild = children.find((child) => {
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
  updateChoresCompleted()
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

// PAY DUE DISPLAY

const updatePayDisplay = (count, selectedChild) => {
if (payCheckbox.checked) {
  payDisplay.textContent = `Pay Due: $0`;
  return;
}

const pay = selectedChild.payRates[count] ?? 0
payDisplay.textContent = `Pay Due: $${pay}`;
};

// COUNT CHORES & CHECKED BOXES

const updateChoresCompleted = () => {
  const selectedChildId = childOption.value;

  const selectedChild = children.find((child) => {
    return child.id === Number(selectedChildId);
  });

  let count = 0;

  dayChecks.forEach((dayCheck) => {
    if (dayCheck.checked) {
      count++;
    }
  });

  if (!selectedChild) {
    choresDisplay.textContent = "Chores Completed: 0"
    payDisplay.textContent = `Pay Due: $0`;
    return;
  }

  choresDisplay.textContent = `Chores Completed: ${count}`;
  updatePayDisplay(count, selectedChild);
};

dayChecks.forEach((dayCheck) => {
  dayCheck.addEventListener("change", (event) => {
    const selectedChildId = childOption.value;
    const selectedWeekStart = weekOption.value;
    const day = event.target.id;
    const isChecked = event.target.checked;

    if (selectedChildId === "" || selectedWeekStart === "") {
      return;
    }

    const selectedChild = children.find((child) => {
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

    updateChoresCompleted()
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

  const selectedChild = children.find((child) => {
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

  updateChoresCompleted()
  saveToStorage()
});

resetButton.addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset all data?")

    if (!confirmReset) return
    
    localStorage.removeItem("children")
    location.reload()
})
