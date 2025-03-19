// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function() {
    loadAccounts();
  });
  
  // Login function for authentication
  function checkLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "cam7644" && password === "12") {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("content").style.display = "block";
      document.getElementById("nav-links").style.display = "flex";
    } else {
      document.getElementById("login-error").style.display = "block";
    }
  }
  
  // Toggle mobile menu
  document.querySelector(".menu-toggle").addEventListener("click", function() {
    document.querySelector(".nav-links").classList.toggle("active");
  });
  
  /* ----------------------------
     Chart of Accounts Functions
  -------------------------------*/
  
  // Add a new account by sending a POST request to the server
  function addAccount() {
    const name = document.getElementById("account-name").value.trim();
    const type = document.getElementById("account-type").value;
    const balance = parseFloat(document.getElementById("account-balance").value) || 0;
  
    if (name === "") {
      alert("Please enter an account name.");
      return;
    }
    const account = { name, type, balance };
    fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    })
    .then(response => response.json())
    .then(data => {
      loadAccounts();
      // Clear form fields
      document.getElementById("account-name").value = "";
      document.getElementById("account-balance").value = "";
    })
    .catch(error => console.error("Error adding account:", error));
  }
  
  // Load accounts from the server using a GET request
  function loadAccounts() {
    fetch('/api/accounts')
      .then(response => response.json())
      .then(accounts => {
        renderAccounts(accounts);
      })
      .catch(error => console.error("Error loading accounts:", error));
  }
  
  // Render the accounts list in the table
  function renderAccounts(accounts) {
    const tableBody = document.getElementById("accounts-list");
    tableBody.innerHTML = "";
    accounts.forEach((account, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${account.name}</td>
        <td>${account.type}</td>
        <td contenteditable="true" class="editable" onBlur="updateBalance(${index}, this)">${account.balance.toFixed(2)}</td>
        <td><button class="delete-btn" onclick="confirmDelete(${index})">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Update the account’s balance by sending a PUT request
  function updateBalance(index, element) {
    const newBalance = parseFloat(element.innerText) || 0;
    // Retrieve the current row values for name and type:
    const row = element.parentElement.parentElement;
    const name = row.cells[0].innerText;
    const type = row.cells[1].innerText;
    const updatedAccount = { name, type, balance: newBalance };
  
    fetch(`/api/accounts/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedAccount)
    })
    .then(response => response.json())
    .then(data => loadAccounts())
    .catch(error => console.error("Error updating balance:", error));
  }
  
  // Display a confirmation popup before deletion
  function confirmDelete(index) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
      <p>Are you sure you want to delete this account?</p>
      <button onclick="deleteAccount(${index})">Yes</button>
      <button onclick="this.parentElement.remove()">No</button>
    `;
    document.body.appendChild(popup);
    popup.style.display = "block";
  }
  
  // Delete an account by sending a DELETE request
  function deleteAccount(index) {
    fetch(`/api/accounts/${index}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      document.querySelector(".popup").remove();
      loadAccounts();
    })
    .catch(error => console.error("Error deleting account:", error));
  }
  