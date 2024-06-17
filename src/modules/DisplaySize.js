import { BaseModule } from "./BaseModule";

export class DisplaySize extends BaseModule {
  onCreate = () => {
    this.display = document.createElement("div");
    Object.assign(this.display.style, this.options.displayStyles);
    this.overlay.appendChild(this.display);
  };

  onDestroy = () => {};

  onUpdate = () => {
    if (!this.display || !this.file) return;

    const size = this.getCurrentSize();
    this.display.innerHTML = size.join(" &times; ");
    if (size[0] > 120 && size[1] > 30) {
      Object.assign(this.display.style, {
        right: "4px",
        bottom: "4px",
        left: "auto",
      });
    } else if (this.file.style.float == "right") {
      const dispRect = this.display.getBoundingClientRect();
      Object.assign(this.display.style, {
        right: "auto",
        bottom: `-${dispRect.height + 4}px`,
        left: `-${dispRect.width + 4}px`,
      });
    } else {
      const dispRect = this.display.getBoundingClientRect();
      Object.assign(this.display.style, {
        right: `-${dispRect.width + 4}px`,
        bottom: `-${dispRect.height + 4}px`,
        left: "auto",
      });
    }
  };

  getCurrentSize = () => {
    return [this.file.clientWidth, this.file.clientHeight];
  };
}
