const fs = require('fs');
const crypto = require('crypto');
const readFile = function(path) {
    return fs.readFileSync(path, 'utf8');
}
const toMd5Hash = function (string) {
    return crypto.createHash('md5').update(string).digest("hex")
};
const toChunks = function (str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }
    return chunks
};
const toApexPluginFile = function (path) {
    const hexString = new Buffer.from(readFile(path)).toString('hex') // eslint-disable-line no-undef
    const chunks = toChunks(hexString, 200)
    let apexLoadFile = '';
    for (let i = 0; i < chunks.length; ++i) {
        apexLoadFile += "  wwv_flow_api.g_varchar2_table(" + (i + 1) + ") := '" + chunks[i] + "';\n"
    }
    return apexLoadFile
};

console.log('Build APEX plugin...');
let conf = JSON.parse(readFile('apexplugin.json'));
let md5Hash = toMd5Hash(readFile('dist/d3-force-' + conf.version + '.js'));
let template = readFile('src/apex-plugin-template.sql');
if (conf.jsFile.md5Hash !== md5Hash) {
    conf.jsFile.md5Hash = md5Hash;
    conf.jsFile.version += 1;
    fs.writeFileSync('apex-plugin/d3-force-apex-plugin-' + conf.version + '.sql',
        '--DO NOT CHANGE THIS FILE - IT IS GENERATED WITH THE BUILD SCRIPT src/apex-plugin-build.js\n\n' +
        template
            .split('#VERSION#').join(conf.version)
            .replace('#CSS#', toApexPluginFile('dist/d3-force-' + conf.version + '.css'))
            .replace('#JS#', toApexPluginFile('dist/d3-force-' + conf.version + '.js'))
            .replace('#JS_MIN#', toApexPluginFile('dist/d3-force-' + conf.version + '.min.js'))
            .replace('#LICENSE#', toApexPluginFile('LICENSE.txt'))
            .replace('#D3#', toApexPluginFile('dist/lib/d3/d3-3.5.6.js'))
            .replace('#D3_MIN#', toApexPluginFile('dist/lib/d3/d3-3.5.6.min.js'))
            .replace('#D3_LICENSE#', toApexPluginFile('dist/lib/d3/LICENSE.txt'))
            .replace('#D3_LABELER_LICENSE#', toApexPluginFile('dist/lib/d3/d3-plugin-labeler-LICENSE.txt'))
            .replace('#D3_LASSO_LICENSE#', toApexPluginFile('dist/lib/d3/d3-plugin-lasso-LICENSE.txt'))
            .replace('#RESIZE#', toApexPluginFile('dist/lib/resize-observer-polyfill/ResizeObserver-1.5.0.js'))
            .replace('#RESIZE_MIN#', toApexPluginFile('dist/lib/resize-observer-polyfill/ResizeObserver-1.5.0.min.js'))
            .replace('#RESIZE_LICENSE#', toApexPluginFile('dist/lib/resize-observer-polyfill/LICENSE.txt'))
    );
    fs.writeFileSync('apexplugin.json', JSON.stringify(conf, null, 2));
}
