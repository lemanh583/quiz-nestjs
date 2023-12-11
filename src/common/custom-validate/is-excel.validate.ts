import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsExcelFile(options?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(mimeType) {
          const acceptMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
          const fileType = acceptMimeTypes.find((type) => type === mimeType);
          return !fileType;
        },
      },
    });
  };
}