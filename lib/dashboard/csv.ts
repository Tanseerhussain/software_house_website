export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (typeof window === "undefined") return
  const headers = rows.length ? Object.keys(rows[0]) : []
  const escape = (value: unknown) => {
    const text = value == null ? "" : String(value)
    return `"${text.replace(/"/g, '""')}"`
  }
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n")
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
