import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { LoadingState, ErrorState } from '../components/ui/DataState';
import { formatCurrency, formatDate, entityId } from '../utils/formatters';
import { rfqsApi } from '../api/rfqs';
import { quotationsApi } from '../api/quotations';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

export default function QuotationSubmit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rfqId = searchParams.get('rfq');
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data: rfqList, isLoading: listLoading, isError: listError, error: listErr, refetch: refetchRfqs } = useQuery({
    queryKey: queryKeys.rfqs({ status: 'open', limit: 50 }),
    queryFn: () => rfqsApi.list({ status: 'open', limit: 50 }),
  });

  const selectedRfqId = rfqId || entityId(rfqList?.items?.[0]);
  const rfq = rfqList?.items?.find((r) => entityId(r) === selectedRfqId) || rfqList?.items?.[0];

  const [form, setForm] = useState({
    unitPrice: '', price: '', deliveryDays: '', notes: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submitMutation = useMutation({
    mutationFn: (body) => quotationsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      success('Quotation submitted successfully');
      setForm({ unitPrice: '', price: '', deliveryDays: '', notes: '' });
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to submit quotation'),
  });

  const handleSubmit = () => {
    if (!rfq) return;
    submitMutation.mutate({
      rfq: entityId(rfq),
      unitPrice: Number(form.unitPrice) || 0,
      price: Number(form.price),
      deliveryDays: Number(form.deliveryDays),
      notes: form.notes,
    });
  };

  if (listLoading) return <LoadingState message="Loading RFQs..." />;
  if (listError) return <ErrorState message={listErr?.response?.data?.message || listErr.message} onRetry={refetchRfqs} />;
  if (!rfq) return <ErrorState message="No open RFQs available" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {rfqList?.items?.length > 1 && (
        <div className="max-w-xs">
          <label className="text-sm font-medium text-foreground">Select RFQ</label>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={selectedRfqId || ''}
            onChange={(e) => setSearchParams({ rfq: e.target.value })}
          >
            {rfqList.items.map((r) => (
              <option key={entityId(r)} value={entityId(r)}>{r.rfqNumber} — {r.title}</option>
            ))}
          </select>
        </div>
      )}

      <PageHeader
        title="Submit Quotation"
        subtitle="Respond to an open RFQ with your pricing"
        actions={
          <Button icon={Send} onClick={handleSubmit} disabled={submitMutation.isPending || !form.price || !form.deliveryDays}>
            {submitMutation.isPending ? 'Submitting...' : 'Submit Quotation'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Quotation Form" subtitle="Enter your pricing and delivery details" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Unit Price ($)" type="number" value={form.unitPrice} onChange={update('unitPrice')} placeholder="0.00" />
                <Input label="Total Price ($)" type="number" value={form.price} onChange={update('price')} placeholder="0.00" required />
              </div>
              <Input label="Delivery Timeline (days)" type="number" value={form.deliveryDays} onChange={update('deliveryDays')} placeholder="e.g. 14" required />
              <Textarea label="Notes & Terms" value={form.notes} onChange={update('notes')} placeholder="Warranty, installation, payment terms..." />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-cyan-soft/20 bg-cyan-soft/5">
            <CardHeader title="RFQ Details" subtitle={rfq.rfqNumber} />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge status={rfq.status} />
                <span className="text-xs text-foreground-subtle flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {rfq.rfqNumber}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{rfq.title}</h3>
              <p className="text-sm text-foreground-subtle">{rfq.description}</p>
              <div className="pt-3 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Deadline</span>
                  <span className="font-medium">{formatDate(rfq.deadline)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Budget</span>
                  <span className="font-medium">{formatCurrency(rfq.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Quantity</span>
                  <span className="font-medium">{rfq.quantity} {rfq.unit}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
