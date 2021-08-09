mv package-lock.json package-lock.json.bak
npm install
mv package-lock.json.bak package-lock.json
rm -rf ./node_modules/swig/node_modules/uglify-js
cp -rp ./node_modules/uglify-js ./node_modules/swig/node_modules/
sed -i 's/"optimist": "~0.6",//' node_modules/swig/package.json
sed -i 's/"uglify-js": "~2.4"/"uglify-js": "~2.6"/' node_modules/swig/package.json
npm audit
if [ $? -eq 1 ]; then
  exit
fi
./node_modules/grunt-cli/bin/grunt
