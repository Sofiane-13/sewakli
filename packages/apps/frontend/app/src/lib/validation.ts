import { VALIDATION } from '../constants/app'

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required',
    }
  }

  if (!VALIDATION.email.pattern.test(email)) {
    return {
      isValid: false,
      error: VALIDATION.email.message,
    }
  }

  return { isValid: true }
}

/**
 * Validates a verification code
 * @param code - The verification code to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateVerificationCode(code: string): ValidationResult {
  if (!code || code.trim() === '') {
    return {
      isValid: false,
      error: 'Verification code is required',
    }
  }

  if (code.length !== VALIDATION.verificationCode.length) {
    return {
      isValid: false,
      error: VALIDATION.verificationCode.message,
    }
  }

  if (!VALIDATION.verificationCode.pattern.test(code)) {
    return {
      isValid: false,
      error: VALIDATION.verificationCode.message,
    }
  }

  return { isValid: true }
}

/**
 * Validates a required string field
 * @param value - The value to validate
 * @param fieldName - The name of the field (for error messages)
 * @returns Validation result with isValid flag and optional error message
 */
export function validateRequired(
  value: string,
  fieldName: string = 'Field',
): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    }
  }

  return { isValid: true }
}

/**
 * Validates a price value
 * @param price - The price to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validatePrice(price: string): ValidationResult {
  if (!price || price.trim() === '') {
    return {
      isValid: false,
      error: 'Price is required',
    }
  }

  const numPrice = parseFloat(price)
  if (isNaN(numPrice)) {
    return {
      isValid: false,
      error: 'Price must be a valid number',
    }
  }

  if (numPrice < 0) {
    return {
      isValid: false,
      error: 'Price must be positive',
    }
  }

  return { isValid: true }
}

/**
 * Validates a date string
 * @param date - The date string to validate
 * @param fieldName - The name of the field (for error messages)
 * @returns Validation result with isValid flag and optional error message
 */
export function validateDate(
  date: string,
  fieldName: string = 'Date',
): ValidationResult {
  if (!date || date.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    }
  }

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid date`,
    }
  }

  return { isValid: true }
}

/**
 * Validates multiple fields at once
 * @param validations - Array of validation results
 * @returns Combined validation result
 */
export function validateAll(validations: ValidationResult[]): ValidationResult {
  const errors = validations
    .filter((v) => !v.isValid)
    .map((v) => v.error)
    .filter((e): e is string => e !== undefined)

  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join(', '),
    }
  }

  return { isValid: true }
}
