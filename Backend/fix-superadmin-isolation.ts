import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const directoryPath = path.join(__dirname, 'src', 'modules');

function traverseAndReplace(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndReplace(fullPath);
        } else if (fullPath.endsWith('.controller.ts') || fullPath.endsWith('.service.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Pattern in controllers:
            // const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN; (or similar)
            // const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);
            
            // Actually, an easier way is to just replace the `isSuperAdmin ? ... : ...` logic
            // We want to force `const franchiseId = req.user?.franchise_id || null;`
            
            // Let's replace:
            // const isSuperAdmin = user.role === Role.SUPER_ADMIN || user.role === 'SUPER_ADMIN';
            // const franchiseId = isSuperAdmin ? undefined : (user.franchise_id ?? null);
            // with
            // const franchiseId = user.franchise_id ?? null;
            
            // Replace pattern: const franchiseId = isSuperAdmin \? (null|undefined) : \((user|req\.user)\?\.franchise_id (\|\||\?\?) (null|undefined)\);
            
            const regex = /const isSuperAdmin\s*=\s*[^;]+;\s*(?:let|const) (targetFranchiseId|franchiseId)\s*=\s*isSuperAdmin\s*\?\s*(?:undefined|null)\s*:\s*\(([^)]+)\);/g;
            if (regex.test(content)) {
                content = content.replace(regex, (match, varName, expression) => {
                    return `const ${varName} = ${expression};`;
                });
                modified = true;
            }

            const regex2 = /const isSuperAdmin\s*=\s*[^;]+;\n\s*(?:let|const) (targetFranchiseId|franchiseId)\s*=\s*isSuperAdmin\s*\?\s*(?:undefined|null)\s*:\s*\(([^)]+)\);/g;
            if (regex2.test(content)) {
                content = content.replace(regex2, (match, varName, expression) => {
                    return `const ${varName} = ${expression};`;
                });
                modified = true;
            }

            const regex3 = /(?:let|const) (targetFranchiseId|franchiseId)\s*=\s*isSuperAdmin\s*\?\s*(?:undefined|null)\s*:\s*\(([^)]+)\);/g;
            if (regex3.test(content)) {
                content = content.replace(regex3, (match, varName, expression) => {
                    return `const ${varName} = ${expression};`;
                });
                modified = true;
            }

            if (fullPath.endsWith('users.service.ts')) {
                // Fix users.service.ts where.franchise_id = null
                if (content.includes('where.franchise_id = null;')) {
                    content = content.replace(/\} else if \(isSuperAdmin\) \{\s*\/\/[^\n]*\s*\/\/[^\n]*\s*\/\/[^\n]*\s*where\.franchise_id = null;\s*\}/g, '}');
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Modified: ${fullPath}`);
            }
        }
    }
}

console.log("Starting script to remove SUPER_ADMIN bypass...");
traverseAndReplace(directoryPath);
console.log("Done.");
