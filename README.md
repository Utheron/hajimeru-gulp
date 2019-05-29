# HAJIMERU GULP
- FontAwesome 5.5.0 already provided

## Install
```
git clone https://github.com/Utheron/hajimeru-gulp.git
```
Rename folder **hajimeru-gulp** according to your project (ex: /www)

## GULP4 SPECIFIC
- Edit/Create the file named **.env** according to your environment
```
# Your site URL (ex: localhost/mywebsite or mywebsite.com)
SITE_URL=

# Your IP address for BrowserSync external access on port 3000
EXTERNAL_URL=
```
- Add the BrowserSync script in your main view and replace **localhost** with the **siteUrl**
```
<script async src="//localhost:3000/browser-sync/browser-sync-client.js"></script>
```
- Add exceptions for the ports 3000 and 3001 in your firewall

## TASKS
- Style and script minification
```
gulp
```
- Images minification from the folder **/src/img**
```
gulp imagemin
```
- Watch changes on style, script and php files + browser reload (this is the one you'll keep using)
```
gulp watch
```

## NOTES
- You'll have to launch the imagemin task manually whenever you'll want to add your latest pictures.