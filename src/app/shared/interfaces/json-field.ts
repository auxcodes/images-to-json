import { FieldType } from '../enums/field-type.enum';

export interface JsonField {
    name: string;
    text: string;
    selected: boolean;
    content: string;
    type?: FieldType;
    value?: any;
    error?: string;  
}