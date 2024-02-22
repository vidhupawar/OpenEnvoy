import { LanguageStrategy } from './language-strategy.interface';

export class CLikeStrategy implements LanguageStrategy {
    private inBlockComment = false;

    isBlank(line: string): boolean {
        return line.trim() === '';
    }

    isComment(line: string): boolean {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('/*')) {
            this.inBlockComment = true;
        }
        if (this.inBlockComment) {
            if (trimmedLine.endsWith('*/')) {
                this.inBlockComment = false;
                return true;
            }
            return true;
        }
        return trimmedLine.startsWith('//');
    }

    isCode(line: string): boolean {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return false;
        if (trimmedLine.startsWith('//')) return false;
        const commentIndex = trimmedLine.indexOf('//');
        if (commentIndex > 0) {
            return trimmedLine.slice(0, commentIndex).trim().length > 0;
        }
        return true;
    }
}
