export interface NestableMenu {
    name: string;
    textColor?: string;
    backgroundColor?: string;
    children?: NestableMenu[];
}