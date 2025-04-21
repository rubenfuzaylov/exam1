const expenseForm = document.getElementById('expense-form');
const expenseInput = document.getElementById('expense-input');
const amountInput = document.getElementById('amount-input');
const categoryInput = document.getElementById('category-input');
const transactionList = document.getElementById('transaction-list');
const totalExpense = document.getElementById('total-expense');
const totalIncome = document.getElementById('total-income');
const balance = document.getElementById('balance');

expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const description = expenseInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const category = categoryInput.value;

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense description and amount.');
        return;
    }

    addTransaction(description, amount, category);
    clearInputs();
    updateSummary();
});

function addTransaction(description, amount, category) {
    const transaction = {
        description,
        amount,
        category
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    transactionList.appendChild(transactionRow);

    transactionRow.querySelector('.delete-btn').addEventListener('click', function () {
        transactionRow.remove();
        removeTransaction(transaction);
        updateSummary();
    });
}

function removeTransaction(transactionToRemove) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactions = transactions.filter(transaction =>
        !(transaction.description === transactionToRemove.description &&
          transaction.amount === transactionToRemove.amount &&
          transaction.category === transactionToRemove.category)
    );

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactions.forEach(transaction => {
        addTransaction(transaction.description, transaction.amount, transaction.category);
    });

    updateSummary();
}

window.addEventListener('load', loadTransactions);

function updateSummary() {
    let totalExpenses = 0;
    let totalIncomes = 0;

    const rows = transactionList.querySelectorAll('tr');

    rows.forEach(row => {
        const amount = parseFloat(row.children[2].textContent);
        const category = row.children[1].textContent;

        if (category === 'Income') {
            totalIncomes += amount;
        } else {
            totalExpenses += amount;
        }
    });

    const currentBalance = totalIncomes - totalExpenses;

    totalExpense.textContent = totalExpenses.toFixed(2);
    totalIncome.textContent = totalIncomes.toFixed(2);
    balance.textContent = currentBalance.toFixed(2);


    if (currentBalance >= 0) {
        balance.classList.remove('negative');
        balance.classList.add('positive');
    } else {
        balance.classList.remove('positive');
        balance.classList.add('negative');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearInputs() {
    expenseInput.value = '';
    amountInput.value = '';
    categoryInput.value = 'Ingredients';
}
