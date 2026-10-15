import { describe, expect, it } from 'vitest'
import { TreeStore } from '../store/TreeStore'
import type { TreeItem } from '@/store/types'

const makeItems = (): TreeItem[] => [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cef', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cef', label: 'Айтем 4' },
  { id: 5, parent: '91064cef', label: 'Айтем 5' },
  { id: 6, parent: '91064cef', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

describe('TreeStore', () => {
  describe('getAll', () => {
    it('возвращает все элементы в исходном порядке', () => {
      const items = makeItems()
      expect(new TreeStore(items).getAll()).toEqual(items)
    })

    it('для пустого хранилища возвращает []', () => {
      expect(new TreeStore().getAll()).toEqual([])
    })
  })
})
