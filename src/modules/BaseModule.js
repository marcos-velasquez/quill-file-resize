export class BaseModule {
  constructor(resizer) {
    this.overlay = resizer.overlay;
    this.file = resizer.file;
    this.options = resizer.options;
    this.requestUpdate = resizer.onUpdate;
  }
  onCreate = () => {};
  onDestroy = () => {};
  onUpdate = () => {};
}
