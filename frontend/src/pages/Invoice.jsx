import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Printer, Download, Mail, Building2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/DataState';
import { formatCurrency, formatDate, entityId } from '../utils/formatters';
import { invoicesApi } from '../api/invoices';
import { queryKeys } from '../api/queryKeys';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/authErrors';

export default function Invoice() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [selected, setSelected] = useState(null);
  const [emailing, setEmailing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.invoices({ limit: 50 }),
    queryFn: () => invoicesApi.list({ limit: 50 }),
  });

  const invoices = data?.items || [];

  useEffect(() => {
    if (invoices.length && !selected) setSelected(invoices[0]);
  }, [invoices, selected]);

  const handleDownload = async () => {
    if (!selected) return;
    try {
      await invoicesApi.downloadPdf(entityId(selected), `${selected.invoiceNumber}.pdf`);
      success('PDF downloaded');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Download failed'));
    }
  };

  const handleEmail = async () => {
    if (!selected) return;
    setEmailing(true);
    try {
      const data = await invoicesApi.email(entityId(selected));
      const sent = data?.emailSent ?? data?.invoice?.emailSent;
      const msg = sent === false
        ? 'Invoice recorded — email logged on server (configure SMTP to send real emails)'
        : 'Invoice emailed successfully';
      success(msg);
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to email invoice'));
    } finally {
      setEmailing(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading invoices..." />;
  if (isError) return <ErrorState message={error?.response?.data?.message || error.message} onRetry={refetch} />;
  if (!invoices.length) return <EmptyState message="No invoices yet" />;

  const vendor = selected?.vendor;
  const po = selected?.purchaseOrder;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Invoices"
        subtitle="Invoice management and history"
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={() => window.print()}>Print</Button>
            <Button variant="outline" icon={Download} onClick={handleDownload}>Download PDF</Button>
            <Button icon={Mail} onClick={handleEmail} disabled={emailing}>{emailing ? 'Sending...' : 'Email Invoice'}</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Invoice History" />
          <div className="space-y-2">
            {invoices.map((inv) => (
              <button
                key={entityId(inv)}
                type="button"
                onClick={() => setSelected(inv)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  entityId(selected) === entityId(inv) ? 'bg-emerald-brand/5 border border-emerald-brand/20' : 'hover:bg-surface-muted'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-sm font-medium text-foreground">{inv.invoiceNumber}</span>
                  <Badge status={inv.status} />
                </div>
                <p className="text-xs text-foreground-subtle mt-1">{inv.vendor?.name}</p>
                <p className="text-sm font-medium text-foreground mt-1">{formatCurrency(inv.total)}</p>
              </button>
            ))}
          </div>
        </Card>

        {selected && (
          <div className="lg:col-span-2">
            <Card className="!p-0 overflow-hidden">
              <div className="p-8 border-b border-border bg-gradient-to-r from-charcoal to-charcoal-light text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-6 h-6 text-emerald-brand" />
                      <span className="text-lg font-bold">VendorBridge</span>
                    </div>
                    <p className="text-sm text-foreground-muted">{user?.company || 'Your Company'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{selected.invoiceNumber}</p>
                    <Badge status={selected.status} className="mt-2" />
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-medium text-foreground-subtle uppercase mb-2">Bill To</h4>
                    <p className="font-semibold text-foreground">{vendor?.name}</p>
                    <p className="text-sm text-foreground-subtle">{vendor?.email}</p>
                    {vendor?.gst && <p className="text-sm text-foreground-subtle mt-1">GST: {vendor.gst}</p>}
                  </div>
                  <div className="text-right text-sm space-y-1">
                    <p><span className="text-foreground-subtle">Issued:</span> {formatDate(selected.issued)}</p>
                    <p><span className="text-foreground-subtle">Due:</span> {formatDate(selected.due)}</p>
                    {po && <p><span className="text-foreground-subtle">PO Ref:</span> {po.poNumber}</p>}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-emerald-dark">{formatCurrency(selected.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground-subtle mt-2">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selected.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground-subtle">
                    <span>Tax</span>
                    <span>{formatCurrency(selected.tax)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
