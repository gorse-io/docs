import git from 'isomorphic-git';
import * as fs from 'fs';
import * as os from 'os';

function isVersionedBranch(name: string): boolean {
    return name.startsWith('release-') || name === 'main';
}

function getVersionFromBranch(name: string): string {
    if (name === 'main') {
        return 'stable';
    }
    return name.substring('release-'.length);
}

const tempDocsFolder = fs.mkdtempSync(os.tmpdir() + '/docs-build');
const tempZHDocsFolder = fs.mkdtempSync(os.tmpdir() + '/docs-build');

fs.rmSync('src/docs', { recursive: true, force: true });
fs.rmSync('src/zh/docs', { recursive: true, force: true });

const branches = await git.listBranches({ fs, dir: '.', remote: 'origin' })
const versionedBranches = branches.filter(isVersionedBranch);
for (const branch of versionedBranches) {
    const version = getVersionFromBranch(branch);
    await git.checkout({
        fs,
        dir: '.',
        ref: branch,
        noUpdateHead: true,
        force: true,
        filepaths: ['src/docs', 'src/zh/docs']
    })
    fs.cpSync('src/docs', `${tempDocsFolder}/${version}`, { recursive: true });
    fs.cpSync('src/zh/docs', `${tempZHDocsFolder}/${version}`, { recursive: true });
}

fs.rmSync('src/docs', { recursive: true, force: true });
fs.rmSync('src/zh/docs', { recursive: true, force: true });
fs.cpSync(tempDocsFolder, 'src/docs', { recursive: true });
fs.cpSync(tempZHDocsFolder, 'src/zh/docs', { recursive: true });
fs.cpSync('src/img', 'src/docs/img', { recursive: true });
