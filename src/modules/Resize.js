import { BaseModule } from "./BaseModule";

export class Resize extends BaseModule {
  onCreate = () => {
    this.boxes = [];

    this.addBox("nwse-resize");
    this.addBox("nesw-resize");
    this.addBox("nwse-resize");
    this.addBox("nesw-resize");

    this.positionBoxes();
  };

  onDestroy = () => this.setCursor("");

  positionBoxes = () => {
    const handleXOffset = `${
      -parseFloat(this.options.handleStyles.width) / 2
    }px`;
    const handleYOffset = `${
      -parseFloat(this.options.handleStyles.height) / 2
    }px`;

    [
      { left: handleXOffset, top: handleYOffset },
      { right: handleXOffset, top: handleYOffset },
      { right: handleXOffset, bottom: handleYOffset },
      { left: handleXOffset, bottom: handleYOffset },
    ].forEach((pos, idx) => Object.assign(this.boxes[idx].style, pos));
  };

  addBox = (cursor) => {
    const box = document.createElement("div");

    Object.assign(box.style, this.options.handleStyles);
    box.style.cursor = cursor;

    box.style.width = `${this.options.handleStyles.width}px`;
    box.style.height = `${this.options.handleStyles.height}px`;

    box.addEventListener("mousedown", this.handleMousedown, false);
    this.overlay.appendChild(box);
    this.boxes.push(box);
  };

  handleMousedown = (evt) => {
    this.dragBox = evt.target;
    this.dragStartX = evt.clientX;
    this.preDragWidth =
      this.file.width || this.file.naturalWidth || this.file.clientWidth;
    this.setCursor(this.dragBox.style.cursor);
    document.addEventListener("mousemove", this.handleDrag, false);
    document.addEventListener("mouseup", this.handleMouseup, false);
  };

  handleMouseup = () => {
    this.setCursor("");
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.handleMouseup);
  };

  handleDrag = (evt) => {
    if (!this.file) return;

    const deltaX = evt.clientX - this.dragStartX;
    if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
      this.file.width = Math.round(this.preDragWidth - deltaX);
    } else {
      this.file.width = Math.round(this.preDragWidth + deltaX);
    }
    this.requestUpdate();
  };

  setCursor = (value) => {
    [document.body, this.file].forEach((el) => (el.style.cursor = value));
  };
}
