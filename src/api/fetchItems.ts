import type { TreeItem } from '../store'

const DELAY = 500;
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchItems(): Promise<TreeItem[]> {
  const [response] = await Promise.all([fetch('/public/items.json'), sleep(DELAY)])
  return await response.json()
}
