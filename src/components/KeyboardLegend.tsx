interface Shortcut {
  key: string;
  action: string;
}

const SHORTCUTS: Shortcut[] = [
  { key: "Space", action: "Play / Pause" },
  { key: ",", action: "-1 frame" },
  { key: ".", action: "+1 frame" },
  { key: "\u2190", action: "-1 second" },
  { key: "\u2192", action: "+1 second" },
  { key: "S", action: "Mark Shot" },
  { key: "L", action: "Mark Landing" },
  { key: "X", action: "Clear pending" },
];

export function KeyboardLegend() {
  return (
    <div className="hidden rounded-lg border bg-card p-3 md:block">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Keyboard Shortcuts
      </h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {SHORTCUTS.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
              {s.key}
            </kbd>
            <span className="text-muted-foreground">{s.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
