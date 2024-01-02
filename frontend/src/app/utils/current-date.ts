/**
 * This function takes the current date and parses it in the required format
 * for the database.
 *
 * @returns The date in the format yyyy-mm-dd
 */
export function currentDate(): string {
  return (new Date()).toLocaleDateString('en-CA');
}
