type Nullable<T> = T | null;

type SuccessResponse = {
	success: boolean;
};

type JwtPayload = {
	alg?: string;
	iss?: string;
	sub?: string;
	aud?: string;
	exp?: string;
	iat?: string;
};

type TokenPair = {
	accessToken: string;
	refreshToken: string;
};

type TokenPairWithUser<T> = TokenPair & {
	user: T;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type TFunction = Function;
