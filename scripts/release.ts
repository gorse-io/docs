import glob from 'glob';
import git from 'isomorphic-git';
import * as fs from 'fs';

function isVersionedBranch(name: string): boolean {
    return name.startsWith('release-');
}

function getVersionFromBranch(name: string): string {
    return name.substring('release-'.length);
}

async function checkUncommittedFiles(fileDir: string) {
    let uncommittedFiles = [];
    const status = await git.statusMatrix({ fs, dir: '.', filter: f => f.startsWith(fileDir) });
    for (const [filepath, head, workdir, stage] of status) {
        if (head != 1 || workdir != 1 || stage != 1) {
            uncommittedFiles.push(filepath);
        }
    }
    if (uncommittedFiles.length > 0) {
        console.log(`Please commit the following files before release:`);
        for (const file of uncommittedFiles) {
            console.log(`  ${file}`);
        }
        process.exit(1);
    }
}

async function checkoutVersions(locale: string) {
    await checkUncommittedFiles(`src/${locale}docs/master`);
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
        console.log(`Checking out ${branch} to src/${locale}docs/${version}`)
        // disable edit link
        const mdfiles = await glob(`src/${locale}docs/${version}/**/*.md`);
        for (const mdfile of mdfiles) {
            let mdContent = fs.readFileSync(mdfile, 'utf8');
            mdContent = mdContent.replace('---', '---\neditLink: false');
            fs.writeFileSync(mdfile, mdContent);
        }
    }
    await git.checkout({
        fs,
        dir: '.',
        noUpdateHead: true,
        force: true,
        filepaths: [`src/${locale}docs/master`, `src/${locale}docs/README.md`]
    })
}

await checkoutVersions('');
await checkoutVersions('zh/');
