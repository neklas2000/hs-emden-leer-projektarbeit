import { Controller } from '@Common/decorators';
import { AppSettings } from '@Entities/app-settings';
import { CRUDControllerMixin } from '@Modules/crud-mixin.controller';
import { AppSettingsService } from './app-settings.service';

@Controller(() => AppSettings, {
	path: 'app-settings',
	version: '1',
})
export class AppSettingsController extends CRUDControllerMixin(
	AppSettings,
	'delete',
	'deleteOneById',
	'create',
) {
	constructor(private readonly appSettings: AppSettingsService) {
		super(appSettings);
	}
}
