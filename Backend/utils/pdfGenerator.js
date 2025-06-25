import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateCertificate = (studentName, courseTitle, completionDate = new Date()) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4'
      });

      const fileName = `certificate_${Date.now()}.pdf`;
      const filePath = path.join(process.cwd(), 'certificates', fileName);
      
      // Ensure certificates directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'certificates'))) {
        fs.mkdirSync(path.join(process.cwd(), 'certificates'));
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

      // Add border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .stroke('#007bff');

      // Add title
      doc.fontSize(48)
        .font('Helvetica-Bold')
        .fill('#007bff')
        .text('Certificate of Completion', doc.page.width / 2, 100, {
          align: 'center'
        });

      // Add subtitle
      doc.fontSize(24)
        .font('Helvetica')
        .fill('#6c757d')
        .text('This is to certify that', doc.page.width / 2, 180, {
          align: 'center'
        });

      // Add student name
      doc.fontSize(36)
        .font('Helvetica-Bold')
        .fill('#212529')
        .text(studentName, doc.page.width / 2, 220, {
          align: 'center'
        });

      // Add course completion text
      doc.fontSize(20)
        .font('Helvetica')
        .fill('#6c757d')
        .text('has successfully completed the course', doc.page.width / 2, 280, {
          align: 'center'
        });

      // Add course title
      doc.fontSize(28)
        .font('Helvetica-Bold')
        .fill('#007bff')
        .text(courseTitle, doc.page.width / 2, 320, {
          align: 'center'
        });

      // Add date
      doc.fontSize(16)
        .font('Helvetica')
        .fill('#6c757d')
        .text(`Issued on: ${completionDate.toLocaleDateString()}`, doc.page.width / 2, 380, {
          align: 'center'
        });

      // Add signature line
      doc.fontSize(14)
        .font('Helvetica')
        .fill('#6c757d')
        .text('BCoder Platform', doc.page.width / 2, 450, {
          align: 'center'
        });

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default generateCertificate;