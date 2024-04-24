const path = require('path')
const fs = require('fs')
module.exports = {
  devServer: {
    port: "9999",
    https: {
      cert: fs.readFileSync(path.join(__dirname, 'src/ssl/server.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/ssl/server.key'))
    },
    overlay: {
      warnings: false,
      errors: true
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        nsis: {
          allowToChangeInstallationDirectory: true,
          oneClick: false,
          installerIcon: "./src/static/lg.png",
          installerHeaderIcon: "./src/static/lg.png",
          "guid": "xxxx",
          "perMachine": true,
          "allowElevation": true,
          "createDesktopShortcut": true,
          "createStartMenuShortcut": true,
          "shortcutName": "remote"
        },
        "compression": "maximum",
        "asar": true,
        "directories": {
          "output": "build",
        },
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/"
        },
        win: {
          icon: './src/static/lg.png',
          "target": [
            {
              "target": "portable",
              "arch": [
                "x64",
              ],

            }
          ],
        },
        productName: "Comfort Talker",
        artifactName: '${productName}.${ext}'
      },
    }
  }
}