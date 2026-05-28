const fs = require('fs');
const docx = require('docx');
const mammoth = require('mammoth');

async function createAndTest() {
  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: [
        new docx.Paragraph({
          text: "1. What is the main tradeoff when flattening a deeply nested information architecture?",
          numbering: {
            reference: "my-numbering",
            level: 0
          }
        }),
        new docx.Paragraph({
          text: "Answer: The tradeoff is between reducing interaction cost and increasing cognitive load."
        }),
        new docx.Paragraph({
          text: "2. What architecture solution balances interaction cost and cognitive load in large menus?",
          numbering: {
            reference: "my-numbering",
            level: 0
          }
        }),
        new docx.Paragraph({
          text: "Answer: A Hub-and-Spoke model."
        })
      ]
    }]
  });

  const buffer = await docx.Packer.toBuffer(doc);
  fs.writeFileSync('test_mammoth.docx', buffer);

  const result = await mammoth.extractRawText({ buffer });
  console.log("MAMMOTH OUTPUT:");
  console.log(JSON.stringify(result.value));
}

createAndTest();
