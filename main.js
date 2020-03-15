const { app, BrowserWindow, Menu, Tray, nativeImage } = require("electron");
const { join } = require("path");
require("./server");

async function bootstrap() {
  let browserWindow;

  const instance = app.requestSingleInstanceLock();

  if (!instance) {
    app.quit();
  } else {
    app.on("second-instance", () => {
      if (browserWindow) {
        if (browserWindow.isMinimized()) {
          browserWindow.restore();
        }
        browserWindow.focus();
      }
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("ready", () => {
      browserWindow = new BrowserWindow({ show: false });
      browserWindow.loadFile(join(__dirname, "./installer/index.html"));
      const iconPath = join(__dirname, "./installer/images/tray-icon.png");
      const trayIcon = nativeImage.createFromPath(iconPath);
      const tray = new Tray(trayIcon);

      browserWindow.once("ready-to-show", async () => {
        browserWindow.show();
      });

      browserWindow.on("minimize", event => {
        event.preventDefault();
        browserWindow.hide();
      });

      browserWindow.on("close", () => {
        browserWindow = null;
      });

      browserWindow.on("show", () => {
        tray.setHighlightMode("always");
      });

      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Show",
          click: () => {
            browserWindow.show();
          }
        },
        {
          label: "Quit",
          click: () => {
            app.quit();
          }
        }
      ]);

      tray.on("double-click", () => {
        browserWindow.show();
      });

      tray.setToolTip("Bematech API Server");
      tray.setContextMenu(contextMenu);
    });
  }
}

bootstrap();
