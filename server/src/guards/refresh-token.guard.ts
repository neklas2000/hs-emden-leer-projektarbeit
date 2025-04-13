import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
	private readonly logger = new Logger(RefreshTokenGuard.name);

	override handleRequest<TUser = any>(
		err: any,
		user: any,
		info: any,
		context: ExecutionContext,
		status?: any,
	): TUser {
		if (err) {
			this.logger.error('Fehler bei der Authentifizierung: ', err);
		}

		if (info) {
			this.logger.warn('Info von Passport: ', info);
		}

		if (!user) {
			this.logger.warn('Kein Benutzer gefunden!');
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
