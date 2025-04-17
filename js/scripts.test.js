const { test, expect } = require('@jest/globals');

test('hello world!', () => {
	expect(1 + 1).toBe(2);
});
describe('usernameRegex validation', () => {
    const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    test('valid username with uppercase, number, and special character', () => {
        const validUsername = 'Password1!';
        expect(usernameRegex.test(validUsername)).toBe(true);
    });

    test('invalid username without uppercase letter', () => {
        const invalidUsername = 'password1!';
        expect(usernameRegex.test(invalidUsername)).toBe(false);
    });

    test('invalid username without number', () => {
        const invalidUsername = 'Password!';
        expect(usernameRegex.test(invalidUsername)).toBe(false);
    });

    test('invalid username without special character', () => {
        const invalidUsername = 'Password1';
        expect(usernameRegex.test(invalidUsername)).toBe(false);
    });

    test('invalid username with less than 8 characters', () => {
        const invalidUsername = 'Pass1!';
        expect(usernameRegex.test(invalidUsername)).toBe(false);
    });

    test('valid username with exactly 8 characters', () => {
        const validUsername = 'Pass1!As';
        expect(usernameRegex.test(validUsername)).toBe(true);
    });
});