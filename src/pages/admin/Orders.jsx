import { AdminShell } from '@/components/admin/AdminShell';
import { OrdersTable } from '@/components/admin/OrdersTable';

export function Orders() {
  return (
    <AdminShell>
      <OrdersTable />
    </AdminShell>
  );
}
