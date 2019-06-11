# HAJIMERU GULP
- FontAwesome 5.5.0 provided

## Install
```
git clone https://github.com/Utheron/hajimeru-gulp.git
```
- Rename folder **hajimeru-gulp** according to your project (ex: /www)
```
git clone https://github.com/Utheron/hajimeru-gulp.git .
```
- Or clone the repository directly at the root of your project

## GULP4 SPECIFIC
- Edit/Create the file named **.env** according to your environment
- **SRC** is where your Sass and JS files are stored
- **DIST** is where your processed source files goes and organized in subfolder automatically
- **TPL** is your template folder name
- **IMG** is where your pictures are stored
```
#####################################################################
# ASSETS
#####################################################################
SRC     = ./src
DIST    = ./assets
TPL     = /default
IMG     = /img
```
```
#####################################################################
# SETTINGS
# -------------------------------------------------------------------
# SITE_URL is the domain address like www.mywebsite.com or localhost
# EXTERNAL_URL is your IP address for external acces on port 3000
#####################################################################
SITE_URL        = localhost
EXTERNAL_URL    = 0.0.0.0
```
## BROWSER-SYNC SPECIFIC
```
<script async src="//localhost:3000/browser-sync/browser-sync-client.js"></script>
```
- Add the **BrowserSync** script in your main view and replace **localhost** with the **siteUrl**
- This previous step may be skipped as it doesn't seems mandatory anymore
- Inside a Docker container, you must use **localhost** (took me a while to figure that out)
- Add exceptions for the ports 3000 and 3001 in your firewall in order to connect from external hosts/devices

## GULP TASKS
- Style and Script minification
```
gulp
```
- Images minification
```
gulp imagemin
```
- Watch changes on Style, Script, PHP files and reload the browser on port 3000 (this is the one you'll keep using)
```
gulp watch
```

## NOTES
- You'll have to launch the **imagemin** task manually whenever you'll want to compress your latest pictures.

## TO-DO
- ~~Some NPM packages were update manually in order to fix the moderate vulnerabilities warning. The CHECKSUM are still not corrected.~~
- NPM packages with some new vunerabilities (moderate), not fixed yet. I'm on it.