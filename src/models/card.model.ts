import { Model as Base } from ".";

export interface Model extends Base {}
export interface AttachMent extends Model {
    name: string;
    url: string;
}
export interface Params extends Model {
    [key: string]: any;
}