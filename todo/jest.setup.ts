import fs from 'node:fs';
const envs = JSON.parse(fs.readFileSync('env.json', 'utf-8'));
for (const env of (Object.values(envs) as Array<Record<string, string>>)) {
    process.env = { ...process.env, ...env };
}