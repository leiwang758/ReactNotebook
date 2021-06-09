import * as esbuild from "esbuild-wasm";

// //
// // immediately call the function
// (async () => {
//   await fileCache.setItem("color", "red");
//   const color = await fileCache.getItem("color");
//   console.log(color);
// })();

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    // build represent the entire bundling process
    setup(build: esbuild.PluginBuild) {
      // filter using Regex to determine files

      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // Handle relative paths in a module
      build.onResolve(
        {
          filter: /^\.+\//,
        },
        (args: any) => {
          return {
            namespace: "a",
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }
      );
      // whenever esbuild is trying to figure out a path to a module
      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        //console.log("onResolve", args);

        // // using filter we can delete all below
        // // we will take care from here, don't access local disk
        // if (args.path === "index.js") {
        //   return { path: args.path, namespace: "a" };
        // }

        // find relative modules
        // if (args.path.includes("./") || args.path.includes("../")) {
        //   return {
        //     namespace: "a",
        //     path: new URL(
        //       args.path,
        //       "https://unpkg.com" + args.resolveDir + "/"
        //     ).href,
        //   };
        // }

        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
        //return { path: args.path, namespace: "a" };
      });
    },
  };
};
