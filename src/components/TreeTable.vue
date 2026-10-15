<template>
  <div class="tree-table">
    <ag-grid-vue
      class="tree-table__grid"
      :treeData="true"
      :loading="isLoading"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :autoGroupColumnDef="autoGroupColumnDef"
      :getDataPath="getDataPath"
      :overlayComponentParams="overlayComponentParams"
      :groupDefaultExpanded="-1"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import type {
  AutoGroupColumnDef,
  ColDef,
  GetDataPath,
  GridReadyEvent,
  GridApi,
} from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'
import { onMounted, ref } from 'vue'
import { useTreeStore } from '@/composables/useTreeStore'
import type { TreeItem } from '@/store'
ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule])

const { store, rowData, isLoading, load } = useTreeStore()
const gridApi = ref<GridApi<TreeItem> | null>(null)
const getDataPath: GetDataPath<TreeItem> = (row) =>
  store
    .getAllParents(row.id)
    .reverse()
    .map((item) => String(item.id))

const columnDefs: ColDef<TreeItem>[] = [
  {
    colId: 'rowNumber',
    headerName: `№ п\\п`,
    width: 90,
    valueGetter: (params) => params.node?.rowIndex && params.node?.rowIndex + 1,
  },
  { headerName: 'Наименование', field: 'label', flex: 1 },
]
const autoGroupColumnDef: AutoGroupColumnDef<TreeItem> = {
  headerName: 'Категория',
  minWidth: 260,
  valueFormatter: (params) => (params.node?.group ? 'Группа' : 'Элемент'),
}
function onGridReady(event: GridReadyEvent<TreeItem>): void {
  gridApi.value = event.api
  event.api.moveColumns(['rowNumber'], 0)
}

const overlayComponentParams = {
  loading: { overlayText: 'Загрузка...' },
}
onMounted(() => {
  load()
})
</script>

<style scoped>
.tree-table {
  height: 400px;
}

.tree-table__grid {
  width: 100%;
  height: 100%;
}
</style>
