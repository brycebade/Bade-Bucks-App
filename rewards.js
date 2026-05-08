import { 
  rewardsList,
  rewardSuggestionBtn,
  rewardSuggestionInput,
  rewardSuggestionMessage 
} from "./dom.js"

import { rewards } from "./rewards-data.js"

rewards.forEach((reward) => {
  const rewardCard = document.createElement("div")
  rewardCard.classList.add("card", "bg-base-100", "shadow-md", "overflow-hidden")
  rewardCard.innerHTML = `
    <div class="card-body p-4 flex flex-col items-center">
      <h3 class="card-title text-base text-center justify-center min-h-[60px]">${reward.item}</h3>

      <figure class="p-2 flex justify-center">
        <img
        class="h-24 w-3/4 object-contain"
        src="${reward.image}"
        alt="${reward.item}"
        >
      </figure>

      <p class="text-lg font-bold text-white flex items-center justify-center gap-1">
        <span class="font-semibold">Ƀ</span>
        ${reward.cost}
      </p>
    </div>
    `

    rewardsList.appendChild(rewardCard)
})

rewardSuggestionBtn.addEventListener("click", () => {
  rewardSuggestionInput.value = ""
})

rewardSuggestionMessage.textContent = "Suggestion saved for future parent approval."