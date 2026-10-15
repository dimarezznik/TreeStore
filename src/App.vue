<template>
  <TreeTable />
</template>

<script setup lang="ts">
import TreeTable from './components/TreeTable.vue'
</script>

<style scoped>
.tree-table {
  height: 480px;
}

.tree-table__grid {
  width: 100%;
  height: 100%;
}

.tree-table :deep(.row-group) {
  font-weight: 600;
}
</style>
