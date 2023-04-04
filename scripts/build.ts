import git from 'isomorphic-git';
import * as fs from 'fs';
import * as os from 'os';

function isVersionedBranch(name: string): boolean {
    return name.startsWith('release-');
}

function getVersionFromBranch(name: string): string {
    return name.substring('release-'.length);
}

async function checkoutVersions(locale: string) {
    fs.rmSync(`src/${locale}docs`, { recursive: true, force: true });
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
            filepaths: [`src/${locale}docs/master`]
        })
        fs.cpSync(`src/${locale}docs/master`, `src/${locale}docs/${version}`, { recursive: true });
    }

    // fs.rmSync('src/docs', { recursive: true, force: true });
    // fs.rmSync('src/zh/docs', { recursive: true, force: true });
    // fs.cpSync(tempDocsFolder, 'src/docs', { recursive: true });
    // fs.cpSync(tempZHDocsFolder, 'src/zh/docs', { recursive: true });
    // fs.cpSync('src/img', 'src/docs/img', { recursive: true });

}

await checkoutVersions('');
await checkoutVersions('zh/');
