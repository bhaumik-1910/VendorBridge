import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Send } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { LoadingState, ErrorState } from '../components/ui/DataState';
import FileUpload from '../components/ui/FileUpload';
import { getApiErrorMessage } from '../utils/authErrors';
import { entityId } from '../utils/formatters';
import { vendorsApi } from '../api/vendors';
import { rfqsApi } from '../api/rfqs';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

export default function RFQCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({
    title: '', description: '', quantity: '', unit: 'units',
    category: 'IT Equipment', deadline: '', budget: '',
  });
  const [selectedVendors, setSelectedVendors] = useState(location.state?.vendorIds || []);
  const [attachments, setAttachments] = useState([]);

  const { data: vendorData, isLoading: vendorsLoading, isError: vendorsError, refetch: refetchVendors } = useQuery({
    queryKey: queryKeys.vendors({ status: 'active', limit: 100 }),
    queryFn: () => vendorsApi.list({ status: 'active', limit: 100 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['vendor-categories'],
    queryFn: vendorsApi.getCategories,
  });

  const categoryOptions = categories.length
    ? categories.map((c) => ({ value: c.name, label: c.name }))
    : [
      { value: 'IT Equipment', label: 'IT Equipment' },
      { value: 'Raw Materials', label: 'Raw Materials' },
      { value: 'Office Supplies', label: 'Office Supplies' },
      { value: 'Logistics', label: 'Logistics' },
      { value: 'Manufacturing', label: 'Manufacturing' },
    ];

  const vendors = vendorData?.items || [];

  const createMutation = useMutation({
    mutationFn: (body) => rfqsApi.create(body),
    onSuccess: async (data) => {
      const id = entityId(data?.rfq || data);
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      return id;
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to create RFQ'),
  });

  const publishMutation = useMutation({
    mutationFn: (id) => rfqsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      success('RFQ published successfully');
      navigate('/rfq');
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to publish RFQ'),
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggleVendor = (id) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const buildPayload = (status) => ({
    title: form.title,
    description: form.description,
    quantity: Number(form.quantity),
    unit: form.unit,
    category: form.category,
    budget: Number(form.budget) || 0,
    deadline: new Date(form.deadline).toISOString(),
    vendors: selectedVendors,
    status,
  });

  const uploadFiles = async (rfqId) => {
    for (const file of attachments) {
      await rfqsApi.uploadAttachment(rfqId, file);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const result = await createMutation.mutateAsync(buildPayload('draft'));
      const rfqId = entityId(result?.rfq || result);
      if (selectedVendors.length) await rfqsApi.assignVendors(rfqId, selectedVendors);
      if (attachments.length) await uploadFiles(rfqId);
      success('Draft saved');
      navigate('/rfq');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to save draft'));
    }
  };

  const handlePublish = async () => {
    try {
      const result = await createMutation.mutateAsync(buildPayload('draft'));
      const rfqId = entityId(result?.rfq || result);
      if (selectedVendors.length) await rfqsApi.assignVendors(rfqId, selectedVendors);
      if (attachments.length) await uploadFiles(rfqId);
      await publishMutation.mutateAsync(rfqId);
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to publish RFQ'));
    }
  };

  const isSaving = createMutation.isPending || publishMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create RFQ"
        subtitle="Request for Quotation — invite vendors to bid"
        actions={
          <>
            <Button variant="outline" icon={Save} onClick={handleSaveDraft} disabled={isSaving}>Save Draft</Button>
            <Button icon={Send} onClick={handlePublish} disabled={isSaving || !form.title || !form.quantity || !form.deadline}>
              {isSaving ? 'Saving...' : 'Publish RFQ'}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-foreground mb-4">RFQ Details</h3>
            <div className="space-y-4">
              <Input label="RFQ Title" value={form.title} onChange={update('title')} placeholder="e.g. Enterprise Server Infrastructure" required />
              <Textarea label="Product / Service Details" value={form.description} onChange={update('description')} placeholder="Describe requirements in detail..." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" value={form.quantity} onChange={update('quantity')} placeholder="0" required />
                <Input label="Unit" value={form.unit} onChange={update('unit')} placeholder="units, kg, licenses..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" options={categoryOptions} value={form.category} onChange={update('category')} />
                <Input label="Estimated Budget ($)" type="number" value={form.budget} onChange={update('budget')} placeholder="0" />
              </div>
              <Input label="Response Deadline" type="date" value={form.deadline} onChange={update('deadline')} required />
            </div>
          </Card>

          <Card>
            <FileUpload
              label="Attachments"
              files={attachments}
              onFilesChange={setAttachments}
              multiple
            />
          </Card>
        </div>

        <Card>
          <h3 className="text-base font-semibold text-foreground mb-4">Select Vendors</h3>
          <p className="text-xs text-foreground-subtle mb-4">Choose vendors to invite for this RFQ</p>
          {vendorsLoading ? <LoadingState message="Loading vendors..." /> : vendorsError ? (
            <ErrorState message="Failed to load vendors" onRetry={refetchVendors} />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vendors.map((vendor) => {
                const vid = entityId(vendor);
                return (
                  <label
                    key={vid}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedVendors.includes(vid)
                        ? 'border-emerald-brand bg-emerald-brand/5'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vid)}
                      onChange={() => toggleVendor(vid)}
                      className="rounded text-emerald-brand focus:ring-emerald-brand/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{vendor.name}</p>
                      <p className="text-xs text-foreground-subtle">{vendor.category}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
          <p className="text-xs text-foreground-subtle mt-3">{selectedVendors.length} vendors selected</p>
        </Card>
      </div>
    </div>
  );
}
