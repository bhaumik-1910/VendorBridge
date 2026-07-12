import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Mail, Phone, MapPin, FileText, Download, TrendingUp, Upload } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';
import Input from '../components/ui/Input';
import RiskIndicator from '../components/widgets/RiskIndicator';
import FileUpload from '../components/ui/FileUpload';
import { LoadingState, ErrorState } from '../components/ui/DataState';
import { formatCurrency, formatDate, entityId } from '../utils/formatters';
import { vendorsApi } from '../api/vendors';
import { quotationsApi } from '../api/quotations';
import { purchaseOrdersApi } from '../api/purchaseOrders';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/authErrors';

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: vendor, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.vendor(id),
    queryFn: () => vendorsApi.get(id),
  });

  const { data: quotesData, isLoading: quotesLoading } = useQuery({
    queryKey: queryKeys.quotations({ vendor: id, limit: 10 }),
    queryFn: () => quotationsApi.list({ limit: 50 }),
    enabled: !!id,
  });

  const { data: posData, isLoading: posLoading } = useQuery({
    queryKey: queryKeys.purchaseOrders({ limit: 50 }),
    queryFn: () => purchaseOrdersApi.list({ limit: 50 }),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (body) => vendorsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendor(id) });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      success('Vendor updated');
      setEditOpen(false);
    },
    onError: (err) => toastError(getApiErrorMessage(err)),
  });

  const openEdit = () => {
    setEditForm({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone || '',
      category: vendor.category,
      contactPerson: vendor.contactPerson || '',
      address: vendor.address || '',
    });
    setEditOpen(true);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      await vendorsApi.uploadDocument(id, file);
      queryClient.invalidateQueries({ queryKey: queryKeys.vendor(id) });
      success('Document uploaded');
      setUploadFiles([]);
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await vendorsApi.downloadDocument(id, entityId(doc), doc.name || doc.fileName);
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Download failed'));
    }
  };

  if (isLoading) return <LoadingState message="Loading vendor..." />;
  if (isError || !vendor) {
    return (
      <div className="text-center py-20">
        <ErrorState message={error?.response?.data?.message || 'Vendor not found'} onRetry={refetch} />
        <Link to="/vendors" className="text-emerald-brand text-sm mt-4 inline-block">Back to vendors</Link>
      </div>
    );
  }

  const vendorQuotes = (quotesData?.items || []).filter(
    (q) => entityId(q.vendor) === id || q.vendor?._id === id
  );
  const vendorPOs = (posData?.items || []).filter(
    (po) => entityId(po.vendor) === id || po.vendor?._id === id
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={vendor.name}
        breadcrumbs={<Link to="/vendors" className="text-emerald-brand hover:underline">Vendors</Link>}
        subtitle={`${vendor.category} · Joined ${formatDate(vendor.createdAt)}`}
        actions={
          <>
            <Button variant="outline" onClick={openEdit}>Edit Vendor</Button>
            <Button onClick={() => navigate('/rfq/create', { state: { vendorIds: [id] } })}>Create RFQ</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-xl bg-emerald-brand/10 text-emerald-dark flex items-center justify-center text-xl font-bold">
                {vendor.name.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge status={vendor.status} />
                  <RiskIndicator risk={vendor.risk} />
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                    {vendor.rating} rating
                  </span>
                </div>
                <p className="text-sm text-foreground-subtle">{vendor.vendorCode}{vendor.gst ? ` · GST: ${vendor.gst}` : ''}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: vendor.totalOrders ?? vendorPOs.length },
              { label: 'On-Time Delivery', value: `${vendor.onTimeDelivery ?? 0}%` },
              { label: 'Total Spend', value: formatCurrency(vendor.spend || vendor.totalSpend || 0) },
              { label: 'Quotations', value: vendorQuotes.length },
            ].map((m) => (
              <Card key={m.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-foreground-subtle mt-1">{m.label}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader title="Recent Quotations" />
            {quotesLoading ? <LoadingState message="Loading quotations..." /> : (
              <div className="space-y-3">
                {vendorQuotes.map((q) => (
                  <div key={entityId(q)} className="flex items-center justify-between p-3 rounded-lg bg-surface-muted">
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.rfq?.title || q.quotationNumber}</p>
                      <p className="text-xs text-foreground-subtle">{formatCurrency(q.price)} · {q.deliveryDays} days delivery</p>
                    </div>
                    <Badge status={q.status} />
                  </div>
                ))}
                {vendorQuotes.length === 0 && <p className="text-sm text-foreground-subtle text-center py-4">No quotations yet</p>}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Procurement History" />
            {posLoading ? <LoadingState message="Loading purchase orders..." /> : (
              <div className="space-y-3">
                {vendorPOs.map((po) => (
                  <div key={entityId(po)} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{po.poNumber}</p>
                      <p className="text-xs text-foreground-subtle">Created {formatDate(po.createdAt)}</p>
                    </div>
                    <Badge status={po.status} />
                  </div>
                ))}
                {vendorPOs.length === 0 && <p className="text-sm text-foreground-subtle text-center py-4">No purchase orders yet</p>}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Contact Details" />
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-foreground-muted"><Mail className="w-4 h-4 text-foreground-subtle" />{vendor.email}</p>
              {vendor.phone && <p className="flex items-center gap-2 text-foreground-muted"><Phone className="w-4 h-4 text-foreground-subtle" />{vendor.phone}</p>}
              {vendor.address && <p className="flex items-start gap-2 text-foreground-muted"><MapPin className="w-4 h-4 text-foreground-subtle mt-0.5" />{vendor.address}</p>}
              {vendor.contactPerson && <p className="text-foreground-subtle">Contact: <span className="text-foreground font-medium">{vendor.contactPerson}</span></p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="Performance Metrics" />
            <div className="space-y-4">
              {[
                { label: 'Delivery Score', value: vendor.onTimeDelivery ?? 0 },
                { label: 'Quality Score', value: Math.round((vendor.rating || 0) * 20) },
                { label: 'Cost Efficiency', value: Math.min(95, Math.round(100 - (vendor.risk === 'high' ? 18 : vendor.risk === 'medium' ? 10 : 5))) },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground-subtle">{m.label}</span>
                    <span className="font-medium text-foreground">{m.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-brand rounded-full" style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-dark">
              <TrendingUp className="w-4 h-4" />
              Live performance data
            </div>
          </Card>

          <Card>
            <CardHeader title="Documents" action={<Upload className="w-4 h-4 text-foreground-subtle" />} />
            <FileUpload
              label=""
              files={uploadFiles}
              onFilesChange={setUploadFiles}
              onUpload={handleUpload}
              uploading={uploading}
            />
            <div className="space-y-2 mt-4">
              {(vendor.documents || []).map((doc) => (
                <div key={entityId(doc)} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-muted transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-foreground-subtle shrink-0" />
                    <span className="text-sm text-foreground truncate">{doc.name || doc.fileName}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleDownload(doc)}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              {!vendor.documents?.length && <p className="text-sm text-foreground-subtle text-center py-2">No documents uploaded</p>}
            </div>
          </Card>
        </div>
      </div>

      <Drawer open={editOpen} onClose={() => setEditOpen(false)} title="Edit Vendor">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(editForm); }}>
          <Input label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
          <Input label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
          <Input label="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <Input label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} required />
          <Input label="Contact person" value={editForm.contactPerson} onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })} />
          <Input label="Address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
          <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </Drawer>
    </div>
  );
}
