const fs = require("fs");
const fse = require("fs-extra");
const prod = process.env.npm_config_production || false;
const rimraf = require("rimraf");

//actualizando el archivos del build
const filesToMove = [
  {
    oldPath: "./build/index.html",
    newPath: "../repo_laravel/resources/views/react.php",
    title: "HTML",
  },
  {
    oldPath: "./build/manifest.json",
    newPath: "../repo_laravel/public/manifest.json",
    title: "MANIFEST",
  },
  {
    oldPath: "./build/asset-manifest.json",
    newPath: "../repo_laravel/public/asset-manifest.json",
    title: "ASSET-MANIFEST",
  },
];

filesToMove.forEach((file) => {
  fs.rename(file.oldPath, file.newPath, function (err) {
    if (err) throw err;
    console.log(`${file.title} SUCCESSFULLY MOVED`);
  });
});

//actualizando el directorio static
const srcDir = `./build/static`;
const destDir = `../repo_laravel/public/static`;
rimraf.sync(destDir);

fse.moveSync(srcDir, destDir, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("STATIC DIR SUCCESSFULLY MOVED !");
  }
});

console.log("DONE");
