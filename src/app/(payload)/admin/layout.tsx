// Import pre-compiled Payload admin CSS. The per-component .scss imports in
// @payloadcms/ui dist files are ignored via ignore-loader in next.config.ts.
import '@payloadcms/ui/dist/styles.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
