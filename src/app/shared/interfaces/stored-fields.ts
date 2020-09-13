import { JsonField } from './json-field';

export interface StoredFields {
  'defaultFields': JsonField[];
  'extraFields': JsonField[];
  'userFields': JsonField[];
}
