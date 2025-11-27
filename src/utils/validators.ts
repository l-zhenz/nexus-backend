import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that the value is either undefined/null or passes the given validation
 */
export function IsOptionalAndValid(
  validationFn: (value: any, args?: ValidationArguments) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalAndValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Skip validation if value is undefined, null, or empty string
          if (value === undefined || value === null || value === '') {
            return true;
          }
          return validationFn(value, args);
        },
      },
    });
  };
}

/**
 * Validates that the value is either undefined/null/empty string or a valid email
 */
export function IsOptionalEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Skip validation if value is undefined, null, or empty string
          if (value === undefined || value === null || value === '') {
            return true;
          }
          // Simple email regex validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
      },
    });
  };
}

/**
 * Validates that the value is either undefined/null/empty string or a valid Chinese phone number
 */
export function IsOptionalPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Skip validation if value is undefined, null, or empty string
          if (value === undefined || value === null || value === '') {
            return true;
          }
          // Simple Chinese phone number regex validation
          const phoneRegex = /^1[3-9]\d{9}$/;
          return phoneRegex.test(value);
        },
      },
    });
  };
}
