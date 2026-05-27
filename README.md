# Pending Dot - Obsidian Plugin

Mark notes as "pending" with a red circle indicator in your Obsidian file explorer.

## Features

- 🔴 **Red Circle Indicator**: Visually mark pending notes with a small red circle in the file explorer
- 🎯 **Quick Toggle**: Right-click any note to mark/unmark as pending
- ⌨️ **Command Palette**: Use commands to manage pending status
- 💾 **Persistent**: Pending marks persist across Obsidian sessions
- 🔄 **Smart Tracking**: Automatically updates pending status when files are renamed or moved

## Installation

### Manual Installation

1. Clone or download this repository
2. Navigate to your Obsidian vault's `.obsidian/plugins` directory
3. Create a folder named `pending-dot` and copy all files into it
4. Reload Obsidian (or restart the app)
5. Go to Settings > Community plugins > Installed plugins and enable "Pending Dot"

### From Obsidian Community Plugins (Coming Soon)

Once published to the official plugin directory, you can install it directly from Obsidian's community plugins browser.

## Usage

### Mark a Note as Pending

**Option 1: Right-Click Context Menu**
- Right-click on any note in the file explorer
- Select "Mark as pending"

**Option 2: Command Palette**
- Open Command Palette (Ctrl+P / Cmd+P)
- Search for "Toggle pending status"
- Press Enter

**Option 3: Keyboard Shortcut**
- You can set a custom hotkey in Settings > Hotkeys > "Toggle pending status"

### Bulk Operations

**Mark All Notes as Pending:**
- Open Command Palette
- Search for "Mark all notes as pending"

**Clear All Pending Marks:**
- Open Command Palette
- Search for "Clear all pending marks"

## How It Works

- The plugin tracks pending notes in `.obsidian/plugins/pending-dot/data.json`
- Notes themselves are not modified - the pending status is stored separately
- Red circles appear next to pending notes in the file explorer
- Pending status is preserved when notes are renamed or moved
- Pending status is removed if a note is deleted

## Customization

### Change the Indicator Color

Edit `styles.css` and modify these color values:

```css
.nav-file.is-pending .nav-file-title::after {
  background-color: #dc3545; /* Change this color */
  box-shadow: 0 0 4px rgba(220, 53, 69, 0.6); /* Adjust shadow */
}
```

### Change the Indicator Size

Modify the width and height in `styles.css`:

```css
.nav-file.is-pending .nav-file-title::after {
  width: 8px;  /* Change size */
  height: 8px; /* Change size */
}
```

## Building from Source

If you want to build the plugin yourself:

```bash
npm install
npm run build
```

For development with file watching:

```bash
npm run dev
```

## Troubleshooting

**Plugin doesn't show up?**
- Make sure you've placed all files in `.obsidian/plugins/pending-dot/`
- Reload Obsidian (Settings > About > Reload app)
- Check that the plugin is enabled in Settings > Community plugins

**Pending marks disappear after restart?**
- Check that the `.obsidian/plugins/pending-dot/` directory is writable
- Look for any error messages in the console (Developer Tools > Console)

**Red circles don't appear?**
- Try reloading Obsidian
- Check that `styles.css` is in the plugin directory
- Verify the plugin is enabled in community plugins

## License

MIT

## Inspiration

This plugin is based on the architecture of [obsidian-unread-dot](https://github.com/denmojo/obsidian-unread-dot), adapted to track pending status instead of unread files.
