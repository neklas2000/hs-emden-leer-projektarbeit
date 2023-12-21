import { Column, ColumnOptions } from 'typeorm';

/**
 * This decorator can be used on the property level of an entity.
 * It wraps the `Column` decorator from the typeorm package, which is being
 * initiated with the following default values
 * ```js
 * {
 *    type: 'uuid',
 *    default: () => 'UUID',
 *    primary: true,
 *    ...options,
 * }
 * ```
 * The part `...options` allows to provide any additional options, which can be
 * defined as a parameter of this decorator.
 */
export function PrimaryGeneratedUUID(
  options: ColumnOptions = {},
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Column({
      type: 'uuid',
      default: () => 'UUID()',
      primary: true,
      ...options,
    })(target, propertyKey);
  };
}
