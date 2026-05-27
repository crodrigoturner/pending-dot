'use strict';

const obsidian = require('obsidian');

const MARK_CLASS = 'pending-dot-mark';

class PendingDotPlugin extends obsidian.Plugin {
  async onload() {
    const data = (await this.loadData()) || {};
    this.pending = new Set(Array.isArray(data.pending) ? data.pending : []);
    this.layoutReady = false;

    this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
      if (!(file instanceof obsidian.TFile)) return;
      const isPending = this.pending.has(file.path);
      menu.addItem((item) => {
        item
          .setTitle(isPending ? 'Unmark pending' : 'Mark as pending')
          .setIcon(isPending ? 'check-circle' : 'circle')
          .onClick(async () => {
            if (isPending) this.pending.delete(file.path);
            else this.pending.add(file.path);
            await this.persist();
            this.scheduleRefresh();
          });
      });
    }));

    this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
      if (this.pending.has(oldPath)) {
        this.pending.delete(oldPath);
        this.pending.add(file.path);
        this.persist();
        this.scheduleRefresh();
      }
    }));

    this.registerEvent(this.app.vault.on('delete', (file) => {
      if (this.pending.has(file.path)) {
        this.pending.delete(file.path);
        this.persist();
      }
    }));

    this.app.workspace.onLayoutReady(() => {
      this.layoutReady = true;
      this.attachObservers();
      this.scheduleRefresh();
    });

    this.addCommand({
      id: 'toggle-pending',
      name: 'Toggle pending status',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        if (checking) return true;
        if (this.pending.has(file.path)) this.pending.delete(file.path);
        else this.pending.add(file.path);
        this.persist();
        this.scheduleRefresh();
      },
    });

    this.addCommand({
      id: 'clear-all-pending',
      name: 'Clear all pending marks',
      callback: async () => {
        this.pending.clear();
        await this.persist();
        this.scheduleRefresh();
        new obsidian.Notice('Pending Dot: cleared all pending marks');
      },
    });
  }

  onunload() {
    if (this.observers) {
      for (const o of this.observers) o.disconnect();
      this.observers = null;
    }
    document.querySelectorAll('.' + MARK_CLASS).forEach((el) => {
      el.classList.remove(MARK_CLASS);
    });
  }

  attachObservers() {
    this.observers = [];
    const leaves = this.app.workspace.getLeavesOfType('file-explorer');
    for (const leaf of leaves) {
      const container = leaf.view && leaf.view.containerEl;
      if (!container) continue;
      const obs = new MutationObserver(() => this.scheduleRefresh());
      obs.observe(container, { childList: true, subtree: true });
      this.observers.push(obs);
    }
  }

  scheduleRefresh() {
    if (this.refreshPending) return;
    this.refreshPending = true;
    window.requestAnimationFrame(() => {
      this.refreshPending = false;
      this.refreshExplorer();
    });
  }

  refreshExplorer() {
    const leaves = this.app.workspace.getLeavesOfType('file-explorer');
    for (const leaf of leaves) {
      const view = leaf.view;
      if (!view || !view.fileItems) continue;
      for (const path in view.fileItems) {
        const item = view.fileItems[path];
        const el = item.selfEl || item.titleEl;
        if (!el) continue;
        const shouldMark = this.pending.has(path);
        const hasMark = el.classList.contains(MARK_CLASS);
        if (shouldMark && !hasMark) el.classList.add(MARK_CLASS);
        else if (!shouldMark && hasMark) el.classList.remove(MARK_CLASS);
      }
    }
  }

  async persist() {
    await this.saveData({ pending: Array.from(this.pending) });
  }
}

module.exports = PendingDotPlugin;
