import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto-js';

@Injectable()
export class CryptoService {
	hash(source: string): string {
		return crypto.SHA256(source).toString(crypto.enc.Hex);
	}
}
