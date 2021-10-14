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
    run: {
      tsbuild: {
        cmd: "npx",
        args: ["tsc"],
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
      "run:tsbuild",
      "usebanner:build",
    ],
  );

  grunt.registerTask(
    "default",
    "build",
  );
};
