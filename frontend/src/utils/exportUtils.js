import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

const addImageToPDF = async (doc, imageUrl, yPosition, margin, contentWidth) => {
  if (!imageUrl) return yPosition;
  
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onload = function(event) {
        const imgData = event.target.result;
        const imgWidth = Math.min(contentWidth, 150);
        const imgHeight = 100;
        doc.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight, undefined, 'FAST');
        resolve(yPosition + imgHeight + 10);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error adding image to PDF:', error);
    return yPosition;
  }
};

const stripHtmlTags = (html) => {
  if (!html) return '';
  // First decode HTML entities to get proper characters
  const decoded = html.replace(/&([^;]+);/g, (match, entity) => {
    const entities = {
      'amp': '&',
      'lt': '<',
      'gt': '>',
      'quot': '"',
      'nbsp': ' '
    };
    return entities[entity] || match;
  });
  // Then remove HTML tags while preserving emojis
  return decoded.replace(/<[^>]*>/g, '');
};

export const exportToPDF = async (note) => {
  try {
    const doc = new jsPDF({fontFaces: [
      {
        family: 'NotoEmoji',
        style: 'normal',
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-emoji/files/noto-emoji-latin-400-normal.woff2'
      }
    ]});
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41);
    doc.text(stripHtmlTags(note.title), margin, yPosition);
    yPosition += 15;

    // Add metadata
    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125);
    doc.text(`Category: ${stripHtmlTags(note.category)}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Created: ${new Date(note.created).toLocaleDateString()}`, margin, yPosition);
    yPosition += 10;

    // Add content with emoji support
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    const cleanContent = stripHtmlTags(note.body || '');
    const contentLines = doc.splitTextToSize(cleanContent, contentWidth);
    doc.text(contentLines, margin, yPosition);
    yPosition += (contentLines.length * 7) + 10;

    // Add image if exists
    if (note.image) {
      yPosition = await addImageToPDF(doc, note.image, yPosition, margin, contentWidth);
    }

    // Add drawing if exists
    if (note.drawing) {
      yPosition = await addImageToPDF(doc, note.drawing, yPosition, margin, contentWidth);
    }

    // Save the PDF
    const filename = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

const getImageAsBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

export const exportToWord = async (note) => {
  try {
    let imageHtml = '';
    let drawingHtml = '';

    if (note.image) {
      const imageBase64 = await getImageAsBase64(note.image);
      if (imageBase64) {
        imageHtml = `<img src="${imageBase64}" alt="Note Image" style="max-width: 100%; height: auto; margin-top: 20px;">`;
      }
    }

    if (note.drawing) {
      const drawingBase64 = await getImageAsBase64(note.drawing);
      if (drawingBase64) {
        drawingHtml = `<img src="${drawingBase64}" alt="Drawing" style="max-width: 100%; height: auto; margin-top: 20px;">`;
      }
    }

    const content = `${stripHtmlTags(note.title)}

Category: ${stripHtmlTags(note.category)}
Created: ${new Date(note.created).toLocaleDateString()}
Last Updated: ${new Date(note.updated).toLocaleDateString()}

${stripHtmlTags(note.body || '')}

${note.image ? '[Note Image]' : ''}
${note.drawing ? '[Drawing]' : ''}`;

    // Create blob with UTF-8 encoding to preserve emojis
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const filename = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw new Error('Failed to generate Word document');
  }
};

export const exportToMarkdown = async (note) => {
  try {
    let imageSection = '';
    let drawingSection = '';

    if (note.image) {
      imageSection = `\n### Attached Image\n![Note Image](${note.image})\n`;
    }

    if (note.drawing) {
      drawingSection = `\n### Drawing\n![Drawing](${note.drawing})\n`;
    }

    const markdown = `# ${note.title}

## Metadata
- **Category:** ${note.category}
- **Created:** ${new Date(note.created).toLocaleDateString()}
- **Last Updated:** ${new Date(note.updated).toLocaleDateString()}

## Content
${note.body || ''}

${imageSection}${drawingSection}`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const filename = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Error generating Markdown:', error);
    throw new Error('Failed to generate Markdown file');
  }
}; 