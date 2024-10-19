document.getElementById('check-btn').addEventListener('click', () => {
    const input = document.getElementById('text-input').value;
    const result = document.getElementById('result');

    if (input === '') return alert('Please input a value');

    // Remove non-alphanumeric characters and convert to lowercase
    const normalizedInput = input.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    const reversedInput = normalizedInput.split('').reverse().join('');

    if (normalizedInput === reversedInput) {
        result.textContent = `${input} is a palindrome`;
    } else {
        result.textContent = `${input} is not a palindrome`;
    }
});
