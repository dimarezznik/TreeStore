import type { Id, TreeItem } from './types'

export class TreeStore<T extends TreeItem = TreeItem> {
  private readonly items = new Map<Id, T>()
  private readonly childrenIndex = new Map<Id | null, Set<T>>()

  constructor(items: readonly T[] = []) {
    this.setItems(items)
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }
  getItem(id: Id): T {
    const item = this.items.get(id)
    if (!item) {
      throw Error('Такого элемента не существует')
    }
    return item
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
      const childrenList = Array.from(children)
      for (let i = 0; i < childrenList.length; i++) {
        stack.push(childrenList[i] as T)
      }
    }
    pushChildren(id)
    while (stack.length > 0) {
      const current = stack.pop() as T
      result.push(current)
      pushChildren(current.id)
    }
    return result
  }
  getAllParents(id: Id): T[] {
    const result: T[] = []
    let current: T | undefined = this.items.get(id)
    while (current !== undefined) {
      result.push(current)
      current = current.parent === null ? undefined : this.items.get(current.parent)
    }
    return result
  }
  setItems(items: readonly T[]) {
    this.items.clear()
    this.childrenIndex.clear()
    for (const item of items) {
      this.insert(item)
    }
  }
  addItem(item: T) {
    if (this.items.has(item.id)) {
      throw new Error(`Элемент с id ${item.id} уже существует`)
    }
    this.insert(item)
  }
  removeItem(id: Id) {
    const item = this.items.get(id)
    if (!item) return
    const relative = this.childrenIndex.get(item.parent)
    relative?.delete(item)
    for (const children of this.getAllChildren(item.id)) {
      this.items.delete(children.id)
      this.childrenIndex.delete(children.id)
    }
    this.items.delete(item.id)
    this.childrenIndex.delete(item.id)
  }
  updateItem(item: T) {
    const current: T = this.getItem(item.id)
    if (current.parent !== item.parent) {
      const oldRelatives = this.childrenIndex.get(current.parent)
      oldRelatives?.delete(current)
      const newRelatives = this.childrenIndex.get(item.parent)
      if (newRelatives) {
        newRelatives.add(item)
      } else {
        this.childrenIndex.set(item.parent, new Set([item]))
      }
    }
    this.items.set(current.id, current)
  }

  private insert(item: T) {
    this.items.set(item.id, item)
    const relative = this.childrenIndex.get(item.parent)
    if (relative) {
      relative.add(item)
    } else {
      this.childrenIndex.set(item.parent, new Set([item]))
    }
  }
}
