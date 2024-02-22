import { Injectable } from '@nestjs/common';
import * as readline from 'readline';
import { CLikeStrategy } from '../strategies/c-like.strategy';
import { LanguageStrategy } from '../strategies/language-strategy.interface';

@Injectable()
export class CodeCounterService {
  private strategy: LanguageStrategy = new CLikeStrategy();
  async countLines(file: Express.Multer.File): Promise<{blankLines: number; commentLines: number; codeLines: number; totalLines: number }> {
    const lines = file.buffer.toString().split('\n');

    console.log('lines', lines)
    let blankLines = 0;
    let commentLines = 0;
    let codeLines = 0;

    lines.forEach((line) => {
      if (this.strategy.isBlank(line)) {
        blankLines++;
      } else if (this.strategy.isComment(line)) {
        commentLines++;
      } else {
        codeLines++;
      }
    });

    console.log(`Blank: ${blankLines}`);
    console.log(`Comments: ${commentLines}`);
    console.log(`Code: ${codeLines}`);
    console.log(`Total: ${blankLines + commentLines + codeLines}`);
    const totalLines = blankLines + commentLines + codeLines;
    return { blankLines, commentLines, codeLines, totalLines };
  }

  async countMultipleFiles(files: Array<Express.Multer.File>): Promise<{blankLines: number; commentLines: number; codeLines: number; totalLines: number}> {
    let blankLines = 0;
    let commentLines = 0;
    let codeLines = 0;
  
    for (const file of files) {
      const { blankLines: fileBlankLines, commentLines: fileCommentLines, codeLines: fileCodeLines, totalLines: fileTotalLines } = await this.countLines(file);
      blankLines += fileBlankLines;
      commentLines += fileCommentLines;
      codeLines += fileCodeLines;
    }
  
    return { blankLines, commentLines, codeLines, totalLines: blankLines + commentLines + codeLines };
  }
}
