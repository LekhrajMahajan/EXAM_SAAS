const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../modules');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace ref: "User" or ref: "Employee" with refPath: "userModel"
  const refRegex = /ref\s*:\s*(["'])(User|Employee)\1/g;
  
  if (refRegex.test(content)) {
    content = content.replace(refRegex, 'refPath: "userModel"');
    
    // Inject the discriminator field
    const userModelField = `\n    userModel: {\n      type: String,\n      enum: ['Admin', 'Manager', 'Candidate'],\n      default: 'Admin'\n    }`;
    
    // Inject it just before the `timestamps: true` configuration
    const configRegex = /\},\s*\{\s*timestamps:/;
    if (configRegex.test(content)) {
      content = content.replace(configRegex, `  ${userModelField},\n  },\n  {\n    timestamps:`);
    } else {
      // Fallback: inject before ...BaseSchemaFields
      const baseFieldsRegex = /\.\.\.BaseSchemaFields/;
      if (baseFieldsRegex.test(content)) {
         content = content.replace(baseFieldsRegex, `${userModelField},\n    ...BaseSchemaFields`);
      }
    }
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.model.ts')) {
      processFile(fullPath);
    }
  }
}

console.log("Starting schema refactor...");
walkDir(modulesDir);
console.log('Schema refactor complete. All User and Employee references updated to use refPath.');
