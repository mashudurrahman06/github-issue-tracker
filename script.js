document.getElementById("login-btn").addEventListener("click", function (e) {
    e.preventDefault(); // form submit বন্ধ রাখবে (important)

    const correctUser = 'admin';
    const correctPass = 'admin123';

    const userInput = document.getElementById("UserName");
    const passInput = document.getElementById("password");
    const msg = document.getElementById("invalid-alert");

    const user = userInput.value;
    const pass = passInput.value;
    
    if (user === correctUser && pass === correctPass) {
        window.location.href = "index.html";
    } else {
            msg.classList.remove("hidden");

            setTimeout(() => {
                msg.classList.add("hidden")
            },2000);
          userInput.value= ""  ;
          passInput.value= ""  ;
          userInput.focus();
            
    }
});