echo "const INDEX=" >search-index.js
curl https://developer.mozilla.org/en-US/search-index.json >>search-index.js
. package.sh
