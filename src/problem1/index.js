var MAX_SAFE_LIMIT = BigInt(Number.MAX_SAFE_INTEGER);

// Max call stack limit
var MAX_RECURSION_DEPTH = 7_000;

// Max for loop limit
var MAX_FOR_LOOP_STACK_DEPTH = 134_000_000;

/**
 * The first function to check if input is invalid
 * @param n Input number to check
 * @returns message error if invalid, empty string in other one
 */
var previous_invalid_check_result = function (n) {
  // Prevent max input reached
  if (n >= MAX_SAFE_LIMIT) {
    return 'Input param exceeds limit';
  }

  // Prevent negative number
  if (n < 0) {
    return 'Input param must be greater or equal to 0';
  }

  // Return empty if passed
  return '';
};

// Implementation A: iterative loop
var sum_to_n_a = function (n) {
  // Check input invalid first
  const previousCheckRes = previous_invalid_check_result(n);
  if (previousCheckRes) {
    throw new Error(previousCheckRes);
  }

  // If pass, create predicted result
  const bigN = BigInt(n);
  const predictedSum = (bigN * (bigN + 1n)) / 2n;

  // if break for loop max stack, return predicted result
  if (n >= MAX_FOR_LOOP_STACK_DEPTH) {
    return Number(predictedSum);
  }

  // Run a new for loop to calc total from 0 to n
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return Number(total);
};

// Implementation B: arithmetic series formula
var sum_to_n_b = function (n) {
  // Check input invalid first
  const previousCheckRes = previous_invalid_check_result(n);
  if (previousCheckRes) {
    throw new Error(previousCheckRes);
  }

  // Sum of list from 1 to n can be calculated by (n * (n + 1))/2
  const bigIntConverted = BigInt(n);
  const result = (bigIntConverted * (bigIntConverted + 1n)) / 2n;

  return Number(result);
};

// Implementation C: Reverse of A
var sum_to_n_c = function (n) {
  // Check input invalid first
  const previousCheckRes = previous_invalid_check_result(n);
  if (previousCheckRes) {
    throw new Error(previousCheckRes);
  }
  const predictedSum = (bigN * (bigN + 1n)) / 2n;
  // Recursion of this depth would overflow the call stack
  if (n >= MAX_RECURSION_DEPTH) {
    return predictedSum;
  }

  function sum_to_n_c_recurse(n) {
    if (n <= 0) {
      return 0;
    }
    return n + sum_to_n_c_recurse(n - 1);
  }
  return sum_to_n_c_recurse(n);
};
