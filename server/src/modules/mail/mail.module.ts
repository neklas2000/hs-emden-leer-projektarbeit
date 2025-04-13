import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { join } from 'path';
import { cwd } from 'process';

import { MailService } from './mail.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				transport: {
					host: config.get('MAIL_HOST'),
					port: config.get('MAIL_PORT'),
					auth: {
						user: config.get('MAIL_USER'),
						pass: config.get('MAIL_PASSWORD'),
					},
				},
				defaults: {
					from: `"No Reply <${config.get('MAIL_USER')}>"`,
				},
				template: {
					dir: join(cwd(), 'templates'),
					adapter: new HandlebarsAdapter({
						host: () => config.get('WEB_HOST') + (config.get('WEB_PORT') || ''),
					}),
					options: {
						strict: true,
					},
				},
				options: {
					partials: {
						dir: join(cwd(), 'templates', 'partials'),
						options: {
							strict: true,
						},
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
