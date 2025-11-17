if [ -z $JENKINS_URL ]; then
  echo "JENKINS_URL is not set"
  exit
fi

npm install
npm audit

if [ $? -eq 1 ]; then
  echo "npm audit failed"
# Commented out until grunt will be replaced with something else
#  exit
fi

./node_modules/grunt-cli/bin/grunt
