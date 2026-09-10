const fs = require('fs');
const glob = require('glob');

const controllersPath = 'src/modules/**/*.controller.ts';

glob(controllersPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  let updatedCount = 0;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace: companyId: req.query.companyId as string,
    const original = 'companyId: req.query.companyId as string,';
    const replacement = 'companyId: ((req as any).user?.companyId ? ((req as any).user.companyId as string) : (req.query.companyId as string)),';
    
    if (content.includes(original)) {
      content = content.replace(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed:', file);
      updatedCount++;
    }
  });

  console.log(`Finished updating ${updatedCount} controllers.`);
});
