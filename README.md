# Quill Image/Video Resize Module

Forked from kensnyder/quill-image-resize-module [quill-image-resize-module](https://github.com/kensnyder/quill-image-resize-module)

A module for Quill rich text editor to allow images/videos to be resized.

Also see [quill-image-drop-module](https://github.com/kensnyder/quill-image-drop-module),
a module that enables copy-paste and drag/drop for Quill.

## Usage

### Webpack/ES6

```javascript
import Quill from "quill";
import FileResize from "quill-file-resize-module";

Quill.register("modules/fileResize", FileResize);

const quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {
			// See optional "config" below
		},
	},
});
```

### Config

For the default experience, pass an empty object, like so:

```javascript
var quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {},
	},
});
```

Functionality is broken down into modules, which can be mixed and matched as you like. For example,
the default is to include all modules:

```javascript
const quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {
			modules: ["Resize", "DisplaySize", "Toolbar"],
		},
	},
});
```

Each module is described below.

#### `Resize` - Resize the file

Adds handles to the file's corners which can be dragged with the mouse to resize the file.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {
			// ...
			handleStyles: {
				backgroundColor: "black",
				border: "none",
				color: white,
				// other camelCase styles for size display
			},
		},
	},
});
```

#### `DisplaySize` - Display pixel size

Shows the size of the image in pixels near the bottom right of the file.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {
			// ...
			displayStyles: {
				backgroundColor: "black",
				border: "none",
				color: white,
				// other camelCase styles for size display
			},
		},
	},
});
```

#### `Toolbar` - Image alignment tools

Displays a toolbar below the image, where the user can select an alignment for the file.

The look and feel can be controlled with options:

```javascript
var quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {
			// ...
			toolbarStyles: {
				backgroundColor: "black",
				border: "none",
				color: white,
				// other camelCase styles for size display
			},
			toolbarButtonStyles: {
				// ...
			},
			toolbarButtonSvgStyles: {
				// ...
			},
		},
	},
});
```

#### `BaseModule` - Include your own custom module

You can write your own module by extending the `BaseModule` class, and then including it in
the module setup.

For example,

```javascript
import { Resize, BaseModule } from "quill-file-resize-module";

class MyModule extends BaseModule {
	// See src/modules/BaseModule.js for documentation on the various lifecycle callbacks
}

var quill = new Quill(editor, {
	// ...
	modules: {
		// ...
		fileResize: {
			modules: [MyModule, Resize],
			// ...
		},
	},
});
```
