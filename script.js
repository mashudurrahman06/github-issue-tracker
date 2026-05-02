let issues = [];

const carddiv = document.getElementById("card-section");

  carddiv.innerHTML = "";

  const loading = document.getElementById("loading");
async function loadissues() {
  try {

    loading.classList.remove("hidden")
    carddiv.classList.add("hidden")
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    issues = data.data;

    displayissues();

     loading.classList.add("hidden")
    carddiv.classList.remove("hidden")

  } catch (error) {
    console.log("ERROR:", error);
  }
}

function displayissues() {
  const carddiv = document.getElementById("card-section");

  carddiv.innerHTML = "";

  issues.forEach(issue => {

    const card = document.createElement("div");

    let borderClass = "border-2 border-gray-200";
    let imgsrc = "";

    // status logic
    if (issue.status === "open") {
      borderClass = "border-t-4 border-green-500";
      imgsrc = "./assets/Open-Status.png";
    } 
    else if (issue.status === "closed") {
      borderClass = "border-t-4 border-purple-500";
      imgsrc = "./assets/Closed.png";
    }

    // ✅ FIX: priority define
    let priority = issue.priority?.toLowerCase();

    let priorityBg = "bg-gray-100";

    if (priority === "high") {
      priorityBg = "bg-[#FEECEC] text-red-500";
    } 
    else if (priority === "medium") {
      priorityBg = "bg-[#FFF6D1] text-[#F59E0B]";
    } 
    else if (priority === "low") {
      priorityBg = "bg-gray-200 text-[#9CA3AF]";
    }


    //--lebel--//

    const labelColors = {
  bug: "bg-red-100 text-red-500",
  "help wanted": "bg-yellow-100 text-yellow-600",
  enhancement: "bg-green-100 text-green-600",
  "good first issue": "bg-blue-100 text-blue-600"
};

let labelsHTML = "";

issue.labels?.forEach(label => {
  const color = labelColors[label.toLowerCase()] || "bg-gray-100 text-gray-500";

  labelsHTML += `
    <span class="px-2 py-1 rounded-[32px] font-medium text-[10px] mr-1 ${color}">
      ${label}
    </span>
  `;
});

    card.className = `p-4 shadow bg-white mx-4 mt-8 rounded-lg ${borderClass}`;

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <img src="${imgsrc}" class="w-8 h-8" />
        <span class="px-4 py-1 rounded-[32px] ${priorityBg}">
          ${issue.priority}
        </span>
      </div>

      <h2 class="font-semibold text-[14px] pb-2 pt-3">${issue.title}</h2>
      <p class"text-[#64748B] text-[12px] ">${issue.description.slice(0,55)}...</p>

        <div class="mt-2 pb-3 border-b-[1px] border-gray-400 flex flex-wrap gap-1">
    ${labelsHTML}
  </div>

  <p class="text-[12px] text-gray-600 pt-3"> ${issue.author}</p>

  <p class="text-[12px] text-gray-600 pt-3"> ${issue.createdAt}</p>
      
    `;

    carddiv.appendChild(card);
  });
}

loadissues();