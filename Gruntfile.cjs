const {readFileSync} = require("fs");
const loadGruntTasks = require("load-grunt-tasks");

const BUILD_DIR = "lib";

const licenseJS = [
  "/**",
  " * @license",
  " * @preserve",
  ...readFileSync("LICENSE", "utf8").split("\n")
    .map(c => ` * ${c}`),
  " */",
].join("\n");

module.exports = grunt => {
  loadGruntTasks(grunt);
  grunt.initConfig({
    clean: {
      build: [
        BUILD_DIR,
      ],
      cache: [
        ".cache",
        ".tscache",
        ".tsbuildinfo",
      ],
    },
    ts: {
      build: {
        tsconfig: {
          tsconfig: "./",
          passThrough: true,
        },
      },
    },
    usebanner: {
      build: {
        options: {banner: licenseJS},
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
