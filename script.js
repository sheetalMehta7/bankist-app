'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let currentAcc;
let sorted = false;
/////////////////////////////////////////////////

function adduserName(acc) {
  acc.username = acc.owner.toLowerCase().split(" ").map((name) => name[0]).join("");
  console.log(acc);
}

accounts.forEach((acc) => adduserName(acc));

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = '';
  const updatedMovements = sort ? movements.slice().sort((a, b) => a - b) : movements;

  updatedMovements.map((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
    </div>
  `
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function updateBalance(acc) {
  const movements = acc.movements;
  acc.balance = movements.reduce((total, mov) => total + mov, 0);
  const inBalance = movements.filter(mov => mov > 0).reduce((total, mov) => total + mov, 0);
  const outBalance = movements.filter(mov => mov < 0).reduce((total, mov) => total + mov, 0);
  const interestBalance = movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter(int => int >= 1).reduce((total, curr) => total + curr, 0);

  labelBalance.innerText = `${acc.balance}€`;
  labelSumIn.innerText = `${inBalance}€`;
  labelSumOut.innerText = `${Math.abs(outBalance)}€`;
  labelSumInterest.innerText = `${interestBalance}€`;
}

//Login Event Listener
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  // if (inputLoginUsername.value)
  console.log(inputLoginUsername.value)
  console.log(inputLoginPin.value);
  currentAcc = accounts.find((acc) => acc.username === inputLoginUsername.value);
  console.log(currentAcc)
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = "100";
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();
    labelWelcome.innerText = `Welcome ${currentAcc.owner.split(" ")[0]}!`
    displayMovements(currentAcc.movements);
    updateBalance(currentAcc);
  } else if (currentAcc && currentAcc?.pin !== Number(inputLoginPin.value)) {
    labelWelcome.innerText = `Oops wrong pin. Please enter correct pin!`
  } else {
    labelWelcome.innerText = `Please enter valid credentials!`
  }
}
);

//sorting
btnSort.addEventListener("click", () => {
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
});

//transfer amount
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value;
  if (!transferAmount || !transferTo) return;
  let receiverAcc = accounts.find((acc) => acc.username === transferTo);
  inputTransferAmount.value = inputTransferTo.value = "";

  if (transferAmount > 0 && receiverAcc && receiverAcc.username !== currentAcc.username && currentAcc.balance >= transferAmount) {
    currentAcc.movements.push(-transferAmount);
    receiverAcc.movements.push(transferAmount);
    displayMovements(currentAcc.movements);
    updateBalance(currentAcc);
  }
});

//request loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some((mov) => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);
    updateBalance(currentAcc);
    inputLoanAmount.value = "";
  }
});

//close account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (username === currentAcc.username && pin === currentAcc.pin) {
    const currentAccIndex = accounts.findIndex((acc) => username === acc.username && pin === acc.pin);
    accounts.splice(currentAccIndex, 1);
    containerApp.style.opacity = "0";
    labelWelcome.innerText = "Log in to get started";
  }
  inputCloseUsername.value = inputClosePin.value = "";
})

