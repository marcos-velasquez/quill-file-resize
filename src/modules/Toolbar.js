import Quill from "quill";
import { BaseModule } from "./BaseModule";

const Parchment = Quill.imports.parchment;
const FloatStyle = new Parchment.Attributor.Style("float", "float");
const MarginStyle = new Parchment.Attributor.Style("margin", "margin");
const DisplayStyle = new Parchment.Attributor.Style("display", "display");

const offsetAttributor = new Parchment.Attributor.Attribute(
  "nameClass",
  "class",
  { scope: Parchment.Scope.INLINE }
);

Quill.register(offsetAttributor);

export class Toolbar extends BaseModule {
  onCreate = () => {
    this.toolbar = document.createElement("div");
    Object.assign(this.toolbar.style, this.options.toolbarStyles);
    this.overlay.appendChild(this.toolbar);

    this._defineAlignments();
    this._addToolbarButtons();
  };

  onDestroy = () => {};

  onUpdate = () => {};

  _defineAlignments = () => {
    this.alignments = [
      {
        icon: `
        <svg viewbox="0 0 18 18">
          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
        </svg>
        `,
        apply: () => {
          DisplayStyle.add(this.file, "inline");
          FloatStyle.add(this.file, "left");
          MarginStyle.add(this.file, "0 1em 1em 0");
          this.file.align = "left";
        },
        isApplied: () => FloatStyle.value(this.file) == "left",
      },
      {
        icon: `
        <svg viewbox="0 0 18 18">
          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
        </svg>
        `,
        apply: () => {
          DisplayStyle.add(this.file, "block");
          FloatStyle.remove(this.file);
          MarginStyle.add(this.file, "auto");
          this.file.align = "center";
        },
        isApplied: () => MarginStyle.value(this.file) == "auto",
      },
      {
        icon: `
        <svg viewbox="0 0 18 18">
          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
        </svg>
        `,
        apply: () => {
          DisplayStyle.add(this.file, "inline");
          FloatStyle.add(this.file, "right");
          MarginStyle.add(this.file, "0 0 1em 1em");
          this.file.align = "right";
        },
        isApplied: () => FloatStyle.value(this.file) == "right",
      },
    ];
  };

  _addToolbarButtons = () => {
    const buttons = [];
    this.alignments.forEach((alignment, idx) => {
      const button = document.createElement("span");
      buttons.push(button);
      button.innerHTML = alignment.icon;
      button.addEventListener("click", () => {
        buttons.forEach((button) => (button.style.filter = ""));
        if (alignment.isApplied()) {
          FloatStyle.remove(this.file);
          MarginStyle.remove(this.file);
          DisplayStyle.remove(this.file);
        } else {
          this._selectButton(button);
          alignment.apply();
        }
        this.requestUpdate();
      });
      Object.assign(button.style, this.options.toolbarButtonStyles);
      if (idx > 0) {
        button.style.borderLeftWidth = "0";
      }
      Object.assign(
        button.children[0].style,
        this.options.toolbarButtonSvgStyles
      );
      if (alignment.isApplied()) {
        this._selectButton(button);
      }
      this.toolbar.appendChild(button);
    });
  };

  _selectButton = (button) => {
    button.style.filter = "invert(20%)";
  };
}
