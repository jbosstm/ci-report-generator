mv package-lock.json package-lock.json.bak

npm install

mv package-lock.json.bak package-lock.json

npm audit

if [ $? -eq 1 ]; then
  exit
fi

./node_modules/grunt-cli/bin/grunt
