// Characters sets for password generation
const numbers = '0123456789';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
const similarCharacters = /[ilLI|oO0]/g;
const ambiguousCharacters = /[{}[\]()/\\'\"`~,;:.<>]/g;

// Get references to the DOM elements
const passwordLengthSlider = document.getElementById('password-lenght');
const passwordLengthValue = document.getElementById('password-lenght-value');
const includeNumbersCheckbox = document.getElementById('include-numbers');
const includeUppercaseCheckbox = document.getElementById('include-uppercase');
const includeLowercaseCheckbox = document.getElementById('include-lowercase');
const includeSymbolsCheckbox = document.getElementById('include-symbols');
const excludeSimilarCheckbox = document.getElementById('similar-characters');
const excludeDuplicateCheckbox = document.getElementById('duplicate-characters');
const excludeSequentialCheckbox = document.getElementById('sequential-characters');
const excludeAmbiguousCheckbox = document.getElementById('ambiguous-characters');
const generateButton = document.getElementById('generate-button');
const copyButton = document.getElementById('copy-button');
const shuffleButton = document.getElementById('shuffle-button');
const generatedPasswordField = document.getElementById('generated-password');

// Set default states for checkboxes
includeNumbersCheckbox.checked = true;
includeUppercaseCheckbox.checked = true;
includeLowercaseCheckbox.checked = true;
includeSymbolsCheckbox.checked = true;
excludeSimilarCheckbox.checked = true;
excludeDuplicateCheckbox.checked = false;
excludeSequentialCheckbox.checked = true;
excludeAmbiguousCheckbox.checked = true;

// Update slider value display
passwordLengthSlider.addEventListener('input', () => {
  passwordLengthValue.value = passwordLengthSlider.value;
});

// Get password generation options
const getPasswordOptions = () => ({
  includeNumbers: includeNumbersCheckbox.checked,
  includeUppercase: includeUppercaseCheckbox.checked,
  includeLowercase: includeLowercaseCheckbox.checked,
  includeSymbols: includeSymbolsCheckbox.checked,
});

// Get password exclusion options
const getExclusionOptions = () => ({
  excludeSimilar: excludeSimilarCheckbox.checked,
  excludeDuplicate: excludeDuplicateCheckbox.checked,
  excludeSequential: excludeSequentialCheckbox.checked,
  excludeAmbiguous: excludeAmbiguousCheckbox.checked,
});

// Function to generate a password
const generatePassword = () => {
  const length = parseInt(passwordLengthSlider.value);
  const options = getPasswordOptions();
  const exclusions = getExclusionOptions();

  let characterPool = '';

  if (options.includeNumbers) characterPool += numbers;
  if (options.includeUppercase) characterPool += uppercase;
  if (options.includeLowercase) characterPool += lowercase;
  if (options.includeSymbols) characterPool += symbols;

  if (exclusions.excludeSimilar) characterPool = characterPool.replace(similarCharacters, '');
  if (exclusions.excludeAmbiguous) characterPool = characterPool.replace(ambiguousCharacters, '');

  // Ensure character pool is not empty
  if (!characterPool) return '';

  let password = '';
  let usedCharacters = new Set();

  for (let i = 0; i < length; i++) {
    let randomChar;
    let validCharFound = false;

    // Try finding a valid character within a limited number of attempts to avoid infinite loop
    for (let attempts = 0; attempts < 100; attempts++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      randomChar = characterPool[randomIndex];

      // Check for duplicate characters if excluded
      if (exclusions.excludeDuplicate && usedCharacters.has(randomChar)) continue;

      // Check for sequential characters if excluded
      if (exclusions.excludeSequential && i > 0 && randomChar.charCodeAt(0) === password.charCodeAt(i - 1) + 1) continue;

      // Valid character found
      validCharFound = true;
      break;
    }

    // If no valid character found within attempts, reset password generation
    if (!validCharFound) return generatePassword();

    password += randomChar;
    usedCharacters.add(randomChar);
  }

  return password;
};

// Generate a password when clicking the generate button
generateButton.addEventListener('click', () => {
  const password = generatePassword();
  generatedPasswordField.value = password;
});

// Copy the generated password to the clipboard
const copyPasswordToClipboard = () => {
  generatedPasswordField.select();
  generatedPasswordField.setSelectionRange(0, 99999);

  document.execCommand('copy');

  alert('Password copied to clipboard: ' + generatedPasswordField.value);
};

copyButton.addEventListener('click', copyPasswordToClipboard);

// Shuffle (regenerate) the password
const shufflePassword = () => {
  const password = generatePassword();
  generatedPasswordField.value = password;
};

shuffleButton.addEventListener('click', shufflePassword);
