document.querySelector("form").addEventListener("submit", function (e) {
  const username = document.querySelector("input[name='username']").value.trim();
  const email = document.querySelector("input[name='email']").value.trim();
  const password = document.querySelector("input[name='password']").value.trim();

  if (!username || !email || !password) {
    alert("All fields are required.");
    e.preventDefault();
  }
});
