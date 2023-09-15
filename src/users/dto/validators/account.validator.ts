import {
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator, ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({async: false})
export class AccountValidator
    implements ValidatorConstraintInterface {
    validate(value: string) {
        return /^[a-z0-9]*$/.test(value);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return validationArguments ? 'Account only lowercase letters and numbers are allowed' : 'success!!';
    }
}

export function IsOnlyLowerCaseAndNumber(
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: AccountValidator,
        });
    };
}
