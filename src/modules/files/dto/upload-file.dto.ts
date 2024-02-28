import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    isArray: false,
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  entityId!: string;

  @ApiProperty({
    type: 'string',
    isArray: false,
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  relatedTo!: string;

  @ApiProperty({
    type: 'object',
    nullable: true,
    description: 'JSON data to be stored with the file',
    required: false,
  })
  @IsJSON({})
  @IsOptional()
  data?: JSON;
}
