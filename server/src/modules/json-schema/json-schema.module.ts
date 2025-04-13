import { Module } from '@nestjs/common';

import { JsonSchemaController } from './json-schema.controller';

@Module({
	controllers: [JsonSchemaController],
})
export class JsonSchemaModule {}
