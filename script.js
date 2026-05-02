let issues = [];
let currentTab = "all";
let activeBtn = null;
let selectedIssue = null;

const carddiv = document.getElementById("card-section");
const loading = document.getElementById("loading");
const countBox = document.getElementById("countbox");
const modal = document.getElementById("modal");
const searchInput = document.getElementById("searchInput");

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

    let priority = issue.priority?.toLowerCase();

    let priorityBg = "bg-gray-100";

    if (priority === "high") {
      priorityBg = "bg-red-200 text-red-600";
    } 
    else if (priority === "medium") {
      priorityBg = "bg-orange-200 text-orange-600";
    } 
    else if (priority === "low") {
      priorityBg = "bg-gray-200 text-gray-500";
    }

    card.className = `p-4 shadow bg-white rounded-lg cursor-pointer ${borderClass}`;

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <img src="${imgsrc}" class="w-8 h-8" />
        <span class="px-3 py-1 rounded ${priorityBg}">
          ${issue.priority}
        </span>
      </div>

      <h2 class="font-semibold text-sm mt-2">${issue.title}</h2>

      <p class="text-xs text-gray-500">
        ${issue.description.slice(0, 55)}...
      </p>
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
  document.getElementById("modal-status").innerText = issue.status;

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
  }

  loadissues();
};