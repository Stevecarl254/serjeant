import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import CouncilMember from "../models/CouncilMember.js";
import Resource from "../models/Resource.js";

export const generateCertificate = async (member, res) => {
  try {
    // Fetch latest certificate template
    const template = await Resource.findOne({
      category: "Certificate Template",
      type: "PDF"
    }).sort({ createdAt: -1 });

    if (!template) {
      return res.status(500).json({ message: "No certificate template found" });
    }

    const templatePath = path.join(process.cwd(), template.fileUrl);
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({
        message: "Certificate template file missing from server"
      });
    }

    // Load PDF template
    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.getPage(0);

    // Load Fonts
    const tinosRegular = await pdfDoc.embedFont(
      fs.readFileSync("./src/assets/fonts/Tinos-Regular.ttf")
    );
    const tinosBold = await pdfDoc.embedFont(
      fs.readFileSync("./src/assets/fonts/Tinos-Bold.ttf")
    );
    const scriptFont = await pdfDoc.embedFont(
      fs.readFileSync("./src/assets/fonts/GreatVibes/Great_Vibes/GreatVibes-Regular.ttf")
    );

    // Fetch Secretary Info
    const secretary = await CouncilMember.findOne({ isSecretary: true });
    const issueDate = new Date().toLocaleDateString("en-GB");

    //
    // ——— DRAW TEXT ON CERTIFICATE (NEW COORDINATES WITH WHITEOUTS) ———
    //

    // Whiteout mask for Member Name
    page.drawRectangle({
      x: 288 - 200, // approximate left side of rectangle
      y: 316 - 5,
      width: 400,
      height: 50,
      color: rgb(1, 1, 1),
    });

    // Member Name - center aligned
    const memberNameSize = 42;
    const memberCenterX = 288;
    const memberNameWidth = scriptFont.widthOfTextAtSize(member.fullName, memberNameSize);
    const memberNameX = memberCenterX - memberNameWidth / 2;

    page.drawText(member.fullName, {
      x: memberNameX,
      y: 316,
      size: memberNameSize,
      font: scriptFont,
      color: rgb(0, 0, 0)
    });

    // Membership Number
    page.drawText(member.membershipNumber, {
      x: 202,
      y: 140,
      size: 14,
      font: tinosRegular,
      color: rgb(0, 0, 0)
    });

    // Whiteout mask for Date of Admission
    page.drawRectangle({
      x: 225,
      y: 118 - 5,
      width: 100,
      height: 20,
      color: rgb(1, 1, 1),
    });

    // Date of Admission
    page.drawText(issueDate, {
      x: 225,
      y: 118,
      size: 14,
      font: tinosRegular,
      color: rgb(0, 0, 0)
    });

    // Place of Issue
    page.drawText("Nairobi", {
      x: 197,
      y: 97,
      size: 14,
      font: tinosRegular,
      color: rgb(0, 0, 0)
    });

    // Secretary Name - center aligned
    const secretaryName = secretary?.fullName || "Secretary";
    const secretaryNameSize = 14;
    const secretaryCenterX = 403;
    const secretaryNameWidth = tinosRegular.widthOfTextAtSize(secretaryName, secretaryNameSize);
    const secretaryNameX = secretaryCenterX - secretaryNameWidth / 2;

    page.drawText(secretaryName, {
      x: secretaryNameX,
      y: 140,
      size: secretaryNameSize,
      font: tinosRegular,
      color: rgb(0, 0, 0)
    });

    // Save and send PDF
    const finalBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Membership-Certificate-${member.membershipNumber}.pdf`
    );

    return res.send(Buffer.from(finalBytes));
  } catch (error) {
    console.error("CERT ERROR:", error);
    return res.status(500).json({
      message: "Error generating certificate",
      error: error.message
    });
  }
};
