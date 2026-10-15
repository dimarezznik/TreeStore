import type { Id, TreeItem } from './types'

export class TreeStore<T extends TreeItem = TreeItem> {
  private readonly items = new Map<Id, T>()
  private readonly childrenIndex = new Map<Id | null, T[]>()

  constructor(items: readonly T[] = []) {
    for (const item of items) {
      this.items.set(item.id, item)
      const children = this.childrenIndex.get(item.parent)
      if (children) {
        children.push(item)
      } else {
        this.childrenIndex.set(item.parent, [item])
      }
    }
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }

  getItem(id: Id): T | undefined {
    return this.items.get(id)
  }

  getChildren(id: Id): T[] {
    return [...(this.childrenIndex.get(id) ?? [])];
  }
}
