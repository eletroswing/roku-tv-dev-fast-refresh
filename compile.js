var rokuDeploy = require('roku-deploy');
var JsonBaseInfo = require('./rokudeploy.json')
const chokidar = require('chokidar');

console.clear()
console.log(" > Starting watch changes...")

const watcher = chokidar.watch(__dirname, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true, // don't trigger for initial scan
  depth: Infinity // watch files and directories recursively
});

watcher.on('all', (event, path) => {
  if(event == 'change'){
    if(!path.includes('package.json') &&
       !path.includes('package-lock.json') && 
       !path.includes('compile.js') &&
       !path.includes('rokudeploy.json') &&
       !path.includes('README.md') &&
       !path.includes('.gitignore') &&
       !path.includes('LICENSE') && 
       !path.includes('out')){
        let now = new Date();

        console.log(`[ ${now.toISOString()} ] Detect change in: ${path}`);
        console.log(">> Startgin building deploy!")
        rokuDeploy.deploy({
            host: JsonBaseInfo.host,
            password: JsonBaseInfo.password
            //other options if necessary
        }).then(function(){
            //it worked
            console.log('>> Your app has been deployed.')
        }, function(error) {
            //it failed
            console.log('>> Error: ', error)
        });
       }
  }
});