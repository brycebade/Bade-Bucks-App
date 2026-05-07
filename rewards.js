import { rewardsList } from "./dom.js"

import { rewards } from "./rewards-data.js"

rewards.forEach((reward) => {
  const rewardCard = document.createElement("div")
  rewardCard.classList.add("card", "bg-base-100", "shadow-md", "overflow-hidden")
  rewardCard.innerHTML = `
    <div class="card-body">
      <h3 class="card-title">${reward.item}</h3>

      <figure>
        <img
        class="h-40 w-full object-cover"
        src="${reward.image}"
        alt="${reward.item}"
        >
      </figure>

      <p class="text-lg font-bold">$${reward.cost}</p>
    </div>
    `

    rewardsList.appendChild(rewardCard)
})