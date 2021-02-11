module.exports = {
    apps: [{
        name: "Some Bot",
        cwd: "build/",
        script: "index.js",
        watch: ["build"],
        // Delay between restart
        watch_delay: 1000,
        ignore_watch: ["node_modules"],
        watch_options: {
            "followSymlinks": false
        }
    }]
}
