module.exports = {
    entry: ["./src/App.ts"],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    output: {
        path: __dirname + "/build",
        publicPath: "/",
        filename: "script.js"
    }
};
