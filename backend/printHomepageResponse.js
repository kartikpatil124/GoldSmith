import fs from 'fs';

try {
  let content = fs.readFileSync('homepage_response.json', 'utf8');
  // Strip BOM if present
  if (content.charCodeAt(0) === 0xFEFF || content.charCodeAt(0) === 0xFFFE) {
    content = content.slice(1);
  }
  
  // Try utf16le as well
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    let content16 = fs.readFileSync('homepage_response.json', 'utf16le');
    if (content16.charCodeAt(0) === 0xFEFF || content16.charCodeAt(0) === 0xFFFE) {
      content16 = content16.slice(1);
    }
    data = JSON.parse(content16);
  }
  
  console.log("Success:", data.success);
  if (data.data && data.data.sections) {
    data.data.sections.forEach(sec => {
      console.log(`Section: ${sec.title} (${sec.sectionKey})`);
      if (sec.resolvedProducts) {
        sec.resolvedProducts.forEach(p => {
          console.log(` - Product: ${p.name}`);
          console.log(`   images field type: ${typeof p.images}`);
          console.log(`   images field:`, p.images);
          console.log(`   featuredImage:`, p.featuredImage);
          console.log(`   image:`, p.image);
        });
      }
    });
  }
} catch (err) {
  console.error(err);
}
