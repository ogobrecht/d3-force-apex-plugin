const fs = require('fs');
const crypto = require('crypto');
const UglifyJS = require("uglify-js");
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
const toApexPluginFile = function (code) {
    const hexString = new Buffer.from(code).toString('hex') // eslint-disable-line no-undef
    const chunks = toChunks(hexString, 200)
    let apexLoadFile = '';
    for (let i = 0; i < chunks.length; ++i) {
        apexLoadFile += "  wwv_flow_api.g_varchar2_table(" + (i + 1) + ") := '" + chunks[i] + "';\n"
    }
    return apexLoadFile
};

console.log('Build APEX plugin...');
let jsCode = fs.readFileSync('src/d3-force.js', 'utf8');
let md5Hash = toMd5Hash(jsCode);
let conf = JSON.parse(fs.readFileSync('apexplugin.json', 'utf8'));
let minified;
if (conf.version !== version || conf.jsFile.md5Hash !== md5Hash) {
    // minify JS code
    minified = UglifyJS.minify({ "d3-force.js": consoleJsCode }, { sourceMap: false });
    if (minified.error) throw minified.error;
    // build plug-in
    conf.jsFile.md5Hash = md5Hash;
    conf.jsFile.version += 1;
    fs.writeFileSync('apex-plugin/d3-force-apex-plugin-' + conf.version + '.sql',
        '--DO NOT CHANGE THIS FILE - IT IS GENERATED WITH THE BUILD SCRIPT sources/build.js\n\n' +
        fs.readFileSync('src/apex-plugin-template.sql', 'utf8')
            .replace('#VERSION#', conf.version)
            .replace('#JS#', toApexPluginFile(fs.readFileSync('src/d3-force.js', 'utf8')))
            .replace('#JS_MIN#', toApexPluginFile(minified.code))
    );
    fs.writeFileSync('apexplugin.json', JSON.stringify(conf, null, 2));
}
