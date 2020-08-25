import { FieldType } from '../enums/field-type.enum';

export interface UserField {
    name: string;
    selected: boolean;
    content: string;
    type?: FieldType;
    value?: string;
    error?: string;  
}
