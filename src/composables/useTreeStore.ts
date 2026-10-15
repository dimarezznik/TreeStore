import { ref } from 'vue'
import { fetchItems } from '../api/fetchItems'
import type { TreeItem } from '../store'
import { TreeStore } from '../store'

export function useTreeStore() {
  const store = new TreeStore<TreeItem>()
  const rowData = ref<TreeItem[]>(store.getAll())
  const isLoading = ref(true)

  function syncRows(): void {
    rowData.value = store.getAll()
  }

  async function load(): Promise<void> {
    isLoading.value = true
    try {
      const items = await fetchItems()
      console.log(items)

      store.setItems(items)
      syncRows()
    } catch (e) {
      console.debug(e)
    } finally {
      isLoading.value = false
    }
  }

  return { store, rowData, isLoading, load, syncRows }
}
