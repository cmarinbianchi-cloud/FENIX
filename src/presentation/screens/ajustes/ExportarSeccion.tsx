<Button mode="outlined" onPress={() => setExportOpen(true)}>
  Exportar datos (CSV / PDF)
</Button>
<ExportarDialog
  visible={exportOpen}
  onClose={() => setExportOpen(false)}
  filters={{}} // vacío = exportar TODO
/>