import Quill from "quill";
import defaultsDeep from "lodash/defaultsDeep";
import DefaultOptions from "./DefaultOptions";
import { DisplaySize } from "./modules/DisplaySize";
import { Toolbar } from "./modules/Toolbar";
import { Resize } from "./modules/Resize";

const knownModules = { DisplaySize, Toolbar, Resize };

export default class FileResize {
  constructor(quill, options = {}) {
    this.quill = quill;

    let moduleClasses = false;
    if (options.modules) {
      moduleClasses = options.modules.slice();
    }

    this.options = defaultsDeep({}, options, DefaultOptions);

    if (moduleClasses !== false) {
      this.options.modules = moduleClasses;
    }

    document.execCommand("enableObjectResizing", false, "false");

    this.quill.root.addEventListener("click", this.handleClick, false);
    this.quill.root.addEventListener("scroll", this.handleScroll, false);

    this.quill.root.parentNode.style.position =
      this.quill.root.parentNode.style.position || "relative";

    this.moduleClasses = this.options.modules;

    this.modules = [];
  }

  initializeModules = () => {
    this.removeModules();

    this.modules = this.moduleClasses.map(
      (ModuleClass) => new (knownModules[ModuleClass] || ModuleClass)(this)
    );

    this.modules.forEach((module) => module.onCreate());

    this.onUpdate();
  };

  onUpdate = () => {
    this.repositionElements();
    this.modules.forEach((module) => module.onUpdate());
  };

  removeModules = () => {
    this.modules.forEach((module) => module.onDestroy());
    this.modules = [];
  };

  handleClick = (evt) => {
    if (
      evt.target &&
      evt.target.tagName &&
      (evt.target.tagName.toUpperCase() === "VIDEO" ||
        evt.target.tagName.toUpperCase() === "IMG")
    ) {
      if (this.file === evt.target) return;
      if (this.file) this.hide();
      this.show(evt.target);
      evt.preventDefault();
    } else if (this.file) this.hide();
  };

  handleScroll = (evt) => this.hide();

  show = (file) => {
    this.file = file;
    this.showOverlay();
    this.initializeModules();
  };

  showOverlay = () => {
    if (this.overlay) {
      this.hideOverlay();
    }

    this.quill.setSelection(null);
    this.setUserSelect("none");

    document.addEventListener("keyup", this.checkFile, true);
    this.quill.root.addEventListener("input", this.checkFile, true);

    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, this.options.overlayStyles);

    this.quill.root.parentNode.appendChild(this.overlay);

    this.overlay.addEventListener("click", (evt) => this.hide(), false);

    this.repositionElements();
  };

  hideOverlay = () => {
    if (!this.overlay) return;

    this.quill.root.parentNode.removeChild(this.overlay);
    this.overlay = undefined;

    document.removeEventListener("keyup", this.checkFile);
    this.quill.root.removeEventListener("input", this.checkFile);

    this.setUserSelect("");
  };

  repositionElements = () => {
    if (!this.overlay || !this.file) return;

    const parent = this.quill.root.parentNode;
    const fileRect = this.file.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${fileRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${fileRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${fileRect.width}px`,
      height: `${fileRect.height}px`,
    });
  };

  hide = () => {
    this.hideOverlay();
    this.removeModules();
    this.file = undefined;
  };

  setUserSelect = (value) => {
    ["userSelect", "mozUserSelect", "webkitUserSelect", "msUserSelect"].forEach(
      (prop) => {
        this.quill.root.style[prop] = value;
        document.documentElement.style[prop] = value;
      }
    );
  };

  checkFile = (evt) => {
    if (this.file) {
      if (evt.keyCode == 46 || evt.keyCode == 8) {
        (window.Quill || Quill).find(this.file).deleteAt(0);
      }
      this.hide();
    }
  };
}

if (window.Quill) {
  const FileFormatAttributesList = ["alt", "height", "width", "style"];

  var BaseVideoFormat = window.Quill.import("formats/video");
  class VideoFormat extends BaseVideoFormat {
    static formats(domNode) {
      return FileFormatAttributesList.reduce(function (formats, attribute) {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
    format(name, value) {
      if (FileFormatAttributesList.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
  }

  var BaseImageFormat = window.Quill.import("formats/image");
  class ImageFormat extends BaseImageFormat {
    static formats(domNode) {
      return FileFormatAttributesList.reduce(function (formats, attribute) {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
    format(name, value) {
      if (FileFormatAttributesList.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
  }

  window.Quill.register(VideoFormat, true);
  window.Quill.register(ImageFormat, true);
  window.Quill.register("modules/fileResize", FileResize);
}
