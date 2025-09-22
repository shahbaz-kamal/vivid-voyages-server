/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
  url?: string;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk: Uint8Array<ArrayBufferLike>) =>
        buffer.push(chunk)
      );
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      //PDF content
      //   headline
      doc.fontSize(20).text("Invoice", { align: "center" });
      //equivalent of enter
      doc.moveDown();
      doc.fontSize(14).text(`TransactionId : ${invoiceData.transactionId}`);
      doc.text(`BookingDate : ${invoiceData.bookingDate}`);
      doc.text(`Customer : ${invoiceData.userName}`);
      doc.moveDown();

      doc.text(`Tour :${invoiceData.tourTitle}`);
      doc.text(`Guests : ${invoiceData.guestCount}`);
      doc.text(`Total Amount : ${invoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();

      doc.text("Thank You Booking With Us", { align: "center" });
      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `pdf creation error: ${error.message} `);
  }
};
