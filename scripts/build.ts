import glob from 'glob';
import git from 'isomorphic-git';
import * as fs from 'fs';

function isVersionedBranch(name: string): boolean {
    return name.startsWith('release-');
}

function getVersionFromBranch(name: string): string {
    return name.substring('release-'.length);
}

async function checkoutVersions(locale: string) {
    const branches = await git.listBranches({ fs, dir: '.', remote: 'origin' })
    const versionedBranches = branches.filter(isVersionedBranch);
    let branchTable = "";
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
        // print version
        let readme = fs.readFileSync(`src/${locale}docs/${version}/README.md`, 'utf8');
        readme = readme.replace(/shortTitle\:\s[\w\u4e00-\u9fa5]+/g, `shortTitle: "${version}"`);
        fs.writeFileSync(`src/${locale}docs/${version}/README.md`, readme);
        // disable edit link
        const mdfiles = await glob(`src/${locale}docs/${version}/**/*.md`);
        for (const mdfile of mdfiles) {
            let mdContent = fs.readFileSync(mdfile, 'utf8');
            mdContent = mdContent.replace('---', '---\neditLink: false');
            fs.writeFileSync(mdfile, mdContent);
        }
        // appemd to branch table
        branchTable += `| [${version}](/${locale}docs/${version}/README.md) | [${branch}](https://github.com/gorse-io/docs/tree/${branch}) | [${branch}](https://github.com/gorse-io/gorse/tree/${branch}) |`
    }
    await git.checkout({
        fs,
        dir: '.',
        noUpdateHead: true,
        force: true,
        filepaths: [`src/${locale}docs/master`, `src/${locale}docs/README.md`]
    })
    fs.appendFileSync(`src/${locale}docs/README.md`, branchTable);
}

await checkoutVersions('');
await checkoutVersions('zh/');
