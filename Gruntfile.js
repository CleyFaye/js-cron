const loadGruntTasks = require("load-grunt-tasks");
const {readFileSync} = require("fs");

const BUILD_DIR = "lib";
const LICENSE_FILE = "LICENSE.js";

module.exports = (grunt) => {
  loadGruntTasks(grunt);
  grunt.initConfig({
    clean: {
      build: [
        BUILD_DIR,
        ".tscache",
        "tsconfig.tsbuildinfo",
      ],
    },
    // eslint-disable-next-line id-length
    ts: {build: {tsconfig: "./tsconfig.json"}},
    usebanner: {
      build: {
        options: {banner: readFileSync(LICENSE_FILE, "utf8")},
        files: [
          {
            expand: true,
            cwd: BUILD_DIR,
            src: ["**/*.js"],
          },
        ],
      },
    },
  });

  grunt.registerTask(
    "build",
    "Build the library for release",
    [
      "ts:build",
      "usebanner:build",
    ],
  );

  grunt.registerTask(
    "default",
    "build",
  );
};
