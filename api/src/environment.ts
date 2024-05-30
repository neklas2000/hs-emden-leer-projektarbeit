type Environment = {
	/**
	 * This constant represents the expiration time unit as a string, which follows the pattern:
	 * \d+(d|m) ~> e.g. 30m or 7d
	 *
	 * This pattern requires that the string starts with an integer which needs to have atleast one
	 * digit and that number needs to be followed by a `m` or a `d` representing the time units
	 * 'minutes' and 'days'.
	 */
	ACCESS_TOKEN_EXPIRATION: string;
	/**
	 * This constant represents the expiration time unit as a string, which follows the pattern:
	 * \d+(d|m) ~> e.g. 30m or 7d
	 *
	 * This pattern requires that the string starts with an integer which needs to have atleast one
	 * digit and that number needs to be followed by a `m` or a `d` representing the time units
	 * 'minutes' and 'days'.
	 */
	REFRESH_TOKEN_EXPIRATION: string;
	JWT_ACCESS_SECRET: string;
	JWT_REFRESH_SECRET: string;
};

export default {
	ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
	REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
} as Environment;
