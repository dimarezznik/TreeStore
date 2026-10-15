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
    return [...(this.childrenIndex.get(id) ?? [])]
  }

  getAllChildren(id: Id): T[] {
    const result: T[] = []
    const stack: T[] = []
    const pushChildren = (parentId: Id): void => {
      const children = this.childrenIndex.get(parentId)
      if (!children) return
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i] as T)
      }
    }
    pushChildren(id)
    while (stack.length > 0) {
      const current = stack.pop() as T
      result.push(current)
      pushChildren(current.id);
    }
    return result
  }
}
