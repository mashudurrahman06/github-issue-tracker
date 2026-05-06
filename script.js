let issues = [];
let currentTab = "all";
let activeBtn = null;
let selectedIssue = null;

const carddiv = document.getElementById("card-section");
const loading = document.getElementById("loading");
const countBox = document.getElementById("countbox");
const modal = document.getElementById("modal");
const searchInput = document.getElementById("searchInput");



//------Helper Function-------//

function getLabelColor(label) {
  const labelColors = {
    bug: "bg-red-100 text-red-500",
    "help wanted": "bg-yellow-100 text-yellow-600",
    enhancement: "bg-green-100 text-green-600",
    "good first issue": "bg-blue-100 text-blue-600"
  };

  return labelColors[label.toLowerCase()] || "bg-gray-100 text-gray-500";
}

function getPriorityClass(priority = "") {
  const p = priority.toLowerCase();

  if (p === "high") {
    return "bg-[#FEECEC] text-red-600";
  } 
  else if (p === "medium") {
    return "bg-[#FFF6D1] text-orange-600";
  } 
  else if (p === "low") {
    return "bg-gray-200 text-gray-500";
  }

  return "bg-gray-100 text-gray-500";
}

// ---------------- LOAD ALL ISSUES ----------------
async function loadissues() {
  try {
    loading.classList.remove("hidden");
    carddiv.classList.add("hidden");

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    issues = data.data || [];

    displayissues();
    updateCount();

    loading.classList.add("hidden");
    carddiv.classList.remove("hidden");

  } catch (error) {
    console.log(error);
  }
}

// ---------------- SEARCH API ----------------
async function searchIssues(query) {
  try {
    loading.classList.remove("hidden");
    carddiv.classList.add("hidden");

    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`
    );

    const data = await res.json();

    issues = data.data || [];

    displayissues();
    updateCount();

    loading.classList.add("hidden");
    carddiv.classList.remove("hidden");

  } catch (error) {
    console.log("SEARCH ERROR:", error);
  }
}

// ---------------- FILTER ----------------
function getFilteredIssues() {
  if (currentTab === "open") {
    return issues.filter(i => i.status?.toLowerCase() === "open");
  }
  if (currentTab === "closed") {
    return issues.filter(i => i.status?.toLowerCase() === "closed");
  }
  return issues;
}

// ---------------- DISPLAY ----------------
function displayissues() {
  carddiv.innerHTML = "";

  const filtered = getFilteredIssues();

  filtered.forEach(issue => {

    const card = document.createElement("div");

    let borderClass = "border-2 border-gray-200";
    let imgsrc = "";

    if (issue.status === "open") {
      borderClass = "border-t-4 border-green-500";
      imgsrc = "./assets/Open-Status.png";
    } 
    else if (issue.status === "closed") {
      borderClass = "border-t-4 border-purple-500";
      imgsrc = "./assets/Closed.png";
    }

    const priorityBg = getPriorityClass(issue.priority);

    let labelsHTML = "";

issue.labels?.forEach(label => {
  const color = getLabelColor(label);

  labelsHTML += `
    <span class="px-2 py-1 rounded text-xs mr-1 ${color}">
      ${label}
    </span>
  `;
});

    
    card.className = `mt-8 p-4 mx-2 shadow bg-white rounded-lg cursor-pointer ${borderClass}`;

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <img src="${imgsrc}" class="w-8 h-8" />
        <span class="px-3 py-1 rounded-[16px] ${priorityBg}">
          ${issue.priority}
        </span>
      </div>

      <h2 class="font-semibold text-sm mt-2">${issue.title}</h2>

      <p class="text-xs text-gray-500">
        ${issue.description.slice(0, 55)}...
      </p>

      <div class="mt-2 pb-4 flex flex-wrap  border-b-[1px] border-gray-400  gap-1"> ${labelsHTML} </div>


      <p  class="pt-3 pb-3 text-[12px] text-gray-400"> ${issue.author}</P>

      <p class=" text-gray-400 text-[12px]"> ${issue.createdAt} </>
    `;

    card.addEventListener("click", () => openModal(issue.id));

    carddiv.appendChild(card);
  });
}

// ---------------- COUNT ----------------
function updateCount() {
  const filtered = getFilteredIssues();
  countBox.innerText = `${filtered.length} issues`;
}

// ---------------- TAB ----------------
function setTab(tab, btn) {
  currentTab = tab;

  if (activeBtn) {
    activeBtn.classList.remove("bg-blue-500", "text-white");
  }

  btn.classList.add("bg-blue-500", "text-white");

  activeBtn = btn;

  displayissues();
  updateCount();
}

// ---------------- MODAL OPEN ----------------
function openModal(id) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;

  selectedIssue = issue;

  document.getElementById("modal-title").innerText = issue.title;
  document.getElementById("modal-desc").innerText = issue.description;
  document.getElementById("updated").innerText= issue.updatedAt;
    
//---------lebel style------------//
    let labelsHTML = "";

     issue.labels?.forEach(label => {
    const color = getLabelColor(label);

    labelsHTML += `
      <span class="px-2 py-1 rounded text-xs ${color}">
        ${label}
      </span>
    `;
  });

  document.getElementById("modal-label").innerHTML = labelsHTML;

  //------------priority----------//

  const priorityBg = getPriorityClass(issue.priority);

  document.getElementById("priority").innerHTML=`<span>Priority:</span> <br> <span class="px-3 py-1 rounded-[16px] ${priorityBg}">
     ${issue.priority}
</span>`;


//--------------assignee---------------//

document.getElementById("assignee").innerHTML=`<span class="font-medium">Assignee: </span class="font-normal"> <br> <span> ${issue.assignee} </span>`

  // ---------------- STATUS STYLE ----------------
  const statusEl = document.getElementById("modal-status");

  const status = issue.status?.toLowerCase();

  let statusClass = "bg-gray-200 text-gray-600";

  if (status === "open") {
    statusClass = "bg-green-100 text-green-600";
  } 
  else if (status === "closed") {
    statusClass = "bg-red-100 text-red-600";
  }

  statusEl.innerText = issue.status;
  statusEl.className = `px-2 py-1 rounded text-xs ml-1 ${statusClass}`;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}


// ---------------- MODAL CLOSE + STATUS UPDATE ----------------
function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");

  if (selectedIssue && selectedIssue.status === "open") {
    selectedIssue.status = "closed";
  }

  displayissues();
  updateCount();
}

// ---------------- SEARCH INPUT ----------------
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (value === "") {
    loadissues();
  } else {
    searchIssues(value);
  }
});

// ---------------- INIT ----------------
window.onload = () => {
  const allBtn = document.querySelector(".tab");

  if (allBtn) {
    allBtn.classList.add("bg-blue-500", "text-white");
    activeBtn = allBtn;
  };

 


  loadissues();
};