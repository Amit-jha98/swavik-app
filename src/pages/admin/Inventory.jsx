import { AdminShell } from '@/components/admin/AdminShell';
import { InventoryManager } from '@/components/admin/InventoryManager';

export function Inventory() {
  return (
    <AdminShell>
      <InventoryManager />
    </AdminShell>
  );
}
