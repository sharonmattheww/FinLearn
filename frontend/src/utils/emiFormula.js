// ─────────────────────────────────────────────────────────────
// EMI FORMULA
// EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
//
// Where:
//   P = Principal (loan amount in rupees)
//   r = Monthly interest rate = annual rate / 12 / 100
//   n = Total number of monthly installments (tenure in months)
// ─────────────────────────────────────────────────────────────

/**
 * Calculate the monthly EMI amount.
 * @param {number} principal   - Loan amount in rupees
 * @param {number} annualRate  - Annual interest rate as percentage (e.g. 12 for 12%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} Monthly EMI rounded to 2 decimal places
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  // Edge case: if interest rate is 0, EMI is simply principal divided by months
  if (annualRate === 0) {
    return parseFloat((principal / tenureMonths).toFixed(2));
  }

  const r = annualRate / 12 / 100; // monthly rate as decimal
  const n = tenureMonths;
  const pow = Math.pow(1 + r, n); // (1 + r)^n

  const emi = (principal * r * pow) / (pow - 1);
  return parseFloat(emi.toFixed(2));
};

/**
 * Calculate the full amortization schedule — one row per month.
 * Each row shows how much of that month's EMI went to interest vs principal.
 *
 * @param {number} principal    - Loan amount
 * @param {number} annualRate   - Annual interest rate percentage
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {object} { emi, totalPayment, totalInterest, schedule }
 */
export const calculateAmortization = (principal, annualRate, tenureMonths) => {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const r = annualRate / 12 / 100;

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    // Interest for this month = remaining balance × monthly rate
    const interestForMonth = parseFloat((balance * r).toFixed(2));

    // Principal paid this month = EMI - interest portion
    let principalForMonth = parseFloat((emi - interestForMonth).toFixed(2));

    // In the last month, pay off whatever balance remains exactly
    // (avoids tiny floating point leftovers like 0.01)
    if (month === tenureMonths) {
      principalForMonth = balance;
    }

    balance = parseFloat((balance - principalForMonth).toFixed(2));

    schedule.push({
      month,
      emi: parseFloat(emi.toFixed(2)),
      principal: principalForMonth,
      interest: interestForMonth,
      balance: Math.max(0, balance), // never show negative balance
    });
  }

  const totalPayment = parseFloat((emi * tenureMonths).toFixed(2));
  const totalInterest = parseFloat((totalPayment - principal).toFixed(2));

  return {
    emi,
    totalPayment,
    totalInterest,
    schedule,
  };
};
