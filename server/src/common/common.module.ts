import { Module, Global } from '@nestjs/common';

import { CookieService, CryptoService, DateService } from './services';

@Global()
@Module({
	providers: [CookieService, CryptoService, DateService],
	exports: [CookieService, CryptoService, DateService],
})
export class CommonModule {}
