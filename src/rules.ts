import * as emailValidator from "email-validator";
import constants from "./constants";

export interface RuleResult<D = any> {
    valid: boolean;
    message?: string;
    data?: D;
}

export type Rule<I = string, D = any> = (input: I) => RuleResult<D>;

const username: Rule<string> = input => {
    const res = /^([A-z]|[0-9]|\.|_|-|\$){3,20}$/.test(input);
    
    if (!res) return { valid: false, message: "Usernames must have from 3 to 30 letters, numbers, ., _, - or $" };
    return { valid: true };
}

const passwordRules = [
    // Has at least 8 characters
    { regex: /.{8,}/g, message: "Password must have at least 8 characters" },
    // Has at least one number
    { regex: /\d/g, message: "Password must have at least one number" },
    // Has at least one special character
    { regex: /[^\p{L}\d\s]/gu, message: "Password must have at least one special character"}
]
const password: Rule<string> = input => {
    for (let rule of passwordRules) {
        const res = rule.regex.test(input);
        if (!res) return { valid: false, message: rule.message };
    }

    return { valid: true };
}

const email: Rule<string> = input => {
    const res = emailValidator.validate(input);

    if (!res) return { valid: res, message: "Email is not valid" };
    return { valid: true };
}

const birthday: Rule<string> = input => {
    const date = new Date(input);
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (years >= constants.minAge) return { valid: true };
    return { valid: false, message: `You must be at least ${constants.minAge} years old` };
}

const passwordConfirmation: Rule<string[]> = input => {
    const res = input[1] === input[0];
    return { valid: res, message: "Passwords must match" };
}

const name: Rule<string> = input => {
    if (name.length > 50) return { valid: false, message: "Name must be less than 50 characters" }
    else return { valid: true }
}

export const rules = { username, password, passwordConfirmation, email, birthday, name };
export default rules;