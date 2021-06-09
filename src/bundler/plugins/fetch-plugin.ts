import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

// simple key value storage
const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // overwrite esbuild

      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          // allow us to use different version as well
          contents: inputCode,
        };
      });
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Cache
        // check to see if we have already fetched this file
        // getItem is a generic function
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if it is in the cache, it yes, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
        // otherwise store it in the cache, could us args.path as the key
        // value can either be the response or the return object below
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, "") // global match
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style);
              `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // store response in cache
        await fileCache.setItem(args.path, result);

        // TS has no idea of the type of this
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
