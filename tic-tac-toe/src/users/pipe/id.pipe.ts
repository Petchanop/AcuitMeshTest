import { PipeTransform, Injectable, Type } from '@nestjs/common';
import * as slugid from 'slugid';

export interface ArgumentMetadata {
    type: 'body' | 'query' | 'param';
    metatype?: Type<unknown>;
    data?: string;
  }

@Injectable()
export class IdPipe implements PipeTransform {
  transform(value: object, metadata : ArgumentMetadata) {
    console.log("pipe", value, metadata);
    return this.transFormId(value, metadata);
  }

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
    console.log("slugidpipe", value, metadata)
    if (metadata.data === 'id') {
        console.log("id", value)
        return slugid.decode(value);
    }
    return value
  }
}