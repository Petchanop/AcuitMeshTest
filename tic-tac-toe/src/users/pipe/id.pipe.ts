import { PipeTransform, Injectable, Type } from '@nestjs/common';
import * as slugid from 'slugid';

export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param';
  metatype?: Type<unknown>;
  data?: string;
}

@Injectable()
export class IdPipe implements PipeTransform {
  transform(value: object, metadata: ArgumentMetadata) {
    return this.transFormId(value, metadata);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private transFormId(value: object, metadata: ArgumentMetadata): object {
    if (value['id']) {
      value['id'] = slugid.decode(value['id']);
    }
    return value;
  }
}

@Injectable()
export class SlugIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === 'id') {
      return slugid.decode(value);
    }
    return value;
  }
}
