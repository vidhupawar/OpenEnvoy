export interface LanguageStrategy {
    isBlank(line: string): boolean;
    isComment(line: string): boolean;
    isCode(line: string): boolean;
}
