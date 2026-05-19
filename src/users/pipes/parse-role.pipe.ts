import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const VALID_ROLES = ['USER', 'ADMIN'] as const;
export type UserRole = typeof VALID_ROLES[number];

/**
 * Validates that the optional `role` query param is one of the allowed values.
 * Passes `undefined` through so the filter is truly optional.
 */
@Injectable()
export class ParseRolePipe implements PipeTransform<string | undefined, UserRole | undefined> {
  transform(value: string | undefined): UserRole | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const upper = value.toUpperCase() as UserRole;

    if (!VALID_ROLES.includes(upper)) {
      throw new BadRequestException(
        `Invalid role "${value}". Allowed values are: ${VALID_ROLES.join(', ')}.`,
      );
    }

    return upper;
  }
}
