import fs from 'fs';
import path from 'path';

const srcDir = 'c:/projects/jewelsSite-main/src';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Let's search for function definitions inside components
      // A function definition inside a component could look like:
      // function Parent() {
      //   const Child = ... or function Child() ...
      // }
      
      // We can use a parser or some simple heuristics.
      // Let's parse line by line and look for const/function returning JSX or starting with capitalized letter
      const lines = content.split('\n');
      let inComponent = false;
      let componentName = '';
      
      lines.forEach((line, idx) => {
        // Detect component start
        const exportMatch = line.match(/(?:export\s+default\s+function|export\s+function|function|const)\s+([A-Z][A-Za-z0-9_]*)/);
        if (exportMatch) {
          inComponent = true;
          componentName = exportMatch[1];
        }
        
        // Detect nested functions that look like components (capitalized first letter)
        if (inComponent) {
          const nestedMatch = line.match(/^\s+(?:const|let|var|function)\s+([A-Z][A-Za-z0-9_]*)\s*=/);
          const nestedFuncMatch = line.match(/^\s+function\s+([A-Z][A-Za-z0-9_]*)/);
          
          if (nestedMatch && nestedMatch[1] !== componentName) {
            console.log(`[FOUND NESTED CONST COMPONENT] in ${file}:${idx + 1}: ${nestedMatch[1]} inside ${componentName}`);
          }
          if (nestedFuncMatch && nestedFuncMatch[1] !== componentName) {
            console.log(`[FOUND NESTED FUNC COMPONENT] in ${file}:${idx + 1}: ${nestedFuncMatch[1]} inside ${componentName}`);
          }
        }
      });
    }
  }
}

scanDir(srcDir);
console.log('Scan completed!');
