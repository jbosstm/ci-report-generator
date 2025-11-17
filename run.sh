if [ -z $JENKINS_URL ]; then
  echo "JENKINS_URL is not set"
  exit
fi

npm install
npm audit

if [ $? -eq 1 ]; then
  echo "npm audit failed"
  exit
fi

rm -rf dist
mkdir dist
node index.js
