import { Test, TestingModule } from '@nestjs/testing';
import { CodeCounterService } from './code-counter.service';

describe('CodeCounterService', () => {
  let service: CodeCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeCounterService],
    }).compile();

    service = module.get<CodeCounterService>(CodeCounterService);
  });

  it('should correctly count blank, comment, and code lines', async () => {
    const fileMock: Express.Multer.File = {
      buffer: Buffer.from(`// This is a comment line\n\npublic class Main {\n    public static void main(String[] args) {\n        // Inside method\n        System.out.println("Hello, World!");\n    }\n}\n`),
      originalname: 'TestFile.java',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 1024,
      fieldname: 'file',
      destination: './uploads',
      filename: 'TestFile.java',
      path: './uploads/TestFile.java',
      stream: null,
    };

    const expectedCounts = {
      blankLines: 2, // There's one blank line in the mock file
      commentLines: 2, // There are two comment lines in the mock file
      codeLines: 5, // There are five lines of code in the mock file
      totalLines: 9, // Total lines in the mock file
    };

    const result = await service.countLines(fileMock);

    expect(result).toEqual(expectedCounts);
  });

  it('should aggregate counts for multiple files correctly', async () => {
    jest.spyOn(service, 'countLines').mockImplementation(async (file: Express.Multer.File) => {
      if (file.originalname === 'file1.txt') {
        return { blankLines: 1, commentLines: 2, codeLines: 3, totalLines: 6 };
      } else if (file.originalname === 'file2.txt') {
        return { blankLines: 2, commentLines: 1, codeLines: 4, totalLines: 7 };
      }
      return { blankLines: 0, commentLines: 0, codeLines: 0, totalLines: 0 };
    });

    // Simulate multiple files
    const files: Express.Multer.File[] = [
      {
        originalname: 'file1.txt',
        buffer: Buffer.from('Some content for file 1'),
      } as Express.Multer.File,
      {
        originalname: 'file2.txt',
        buffer: Buffer.from('Some content for file 2'),
      } as Express.Multer.File,
    ];

    const expectedTotals = {
      blankLines: 3,
      commentLines: 3,
      codeLines: 7,
      totalLines: 13,
    };

    const result = await service.countMultipleFiles(files);

    expect(result).toEqual(expectedTotals);
  });
});
