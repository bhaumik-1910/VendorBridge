import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Star, Mail, Phone, ExternalLink } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Drawer from '../components/ui/Drawer';
import Input from '../components/ui/Input';
import RiskIndicator from '../components/widgets/RiskIndicator';
import AdvancedFilters from '../components/widgets/AdvancedFilters';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/DataState';
import { formatCurrency, entityId } from '../utils/formatters';
import { useDebounce } from '../hooks/useDebounce';
import { vendorsApi } from '../api/vendors';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

const filterOptions = [
  { key: 'status', label: 'Status', options: [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ]},
  { key: 'category', label: 'Category', options: [
    { value: '', label: 'All Categories' },
    { value: 'IT Equipment', label: 'IT Equipment' },
    { value: 'Raw Materials', label: 'Raw Materials' },
    { value: 'Office Supplies', label: 'Office Supplies' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Manufacturing', label: 'Manufacturing' },
  ]},
  { key: 'risk', label: 'Risk Level', options: [
    { value: '', label: 'All Levels' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]},
];

export default function VendorManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAdd, setShowAdd] = useState(!!location.state?.openAdd);

  const { data: categories = [] } = useQuery({
    queryKey: ['vendor-categories'],
    queryFn: vendorsApi.getCategories,
  });

  const categoryFilterOptions = [
    { value: '', label: 'All Categories' },
    ...(categories.length
      ? categories.map((c) => ({ value: c.name, label: c.name }))
      : filterOptions.find((f) => f.key === 'category').options.slice(1)),
  ];

  const dynamicFilterOptions = filterOptions.map((f) =>
    f.key === 'category' ? { ...f, options: categoryFilterOptions } : f
  );
  const [newVendor, setNewVendor] = useState({ name: '', email: '', category: 'IT Equipment', phone: '' });
  const debouncedSearch = useDebounce(search);

  const params = { page, limit: 20, search: debouncedSearch || undefined, ...filters };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.vendors(params),
    queryFn: () => vendorsApi.list(params),
  });

  const createMutation = useMutation({
    mutationFn: vendorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      success('Vendor created successfully');
      setShowAdd(false);
      setNewVendor({ name: '', email: '', category: 'IT Equipment', phone: '' });
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to create vendor'),
  });

  const vendors = data?.items || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Vendor Management"
        subtitle={`${pagination?.total ?? 0} registered vendors`}
        actions={<Button onClick={() => setShowAdd(true)}>Add Vendor</Button>}
      />

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:border-emerald-brand focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
            />
          </div>
          <AdvancedFilters filters={dynamicFilterOptions} onApply={(f) => { setFilters(f); setPage(1); }} />
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={error?.response?.data?.message || error.message} onRetry={refetch} />}
        {!isLoading && !isError && vendors.length === 0 && <EmptyState message="No vendors found" />}

        {!isLoading && !isError && vendors.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Vendor', 'Category', 'Status', 'Rating', 'Risk', 'Total Spend', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={entityId(vendor)} className="border-b border-border hover:bg-surface-muted transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-brand/10 text-emerald-dark flex items-center justify-center text-xs font-bold">
                            {vendor.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{vendor.name}</p>
                            <p className="text-xs text-foreground-subtle">{vendor.vendorCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-foreground-muted">{vendor.category}</td>
                      <td className="py-3 px-3"><Badge status={vendor.status} /></td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-warm fill-amber-warm" />
                          {vendor.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3"><RiskIndicator risk={vendor.risk} /></td>
                      <td className="py-3 px-3 font-medium">{formatCurrency(vendor.spend || vendor.totalSpend)}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedVendor(vendor)}>View</Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/vendors/${entityId(vendor)}`)}>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={!pagination.hasPrev} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <span className="text-sm text-foreground-subtle self-center">Page {pagination.page} of {pagination.totalPages}</span>
                <Button size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Drawer open={!!selectedVendor} onClose={() => setSelectedVendor(null)} title="Vendor Profile">
        {selectedVendor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-brand/10 text-emerald-dark flex items-center justify-center text-lg font-bold">
                {selectedVendor.name.slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedVendor.name}</h3>
                <p className="text-sm text-foreground-subtle">{selectedVendor.category}</p>
                <div className="flex gap-2 mt-2">
                  <Badge status={selectedVendor.status} />
                  <RiskIndicator risk={selectedVendor.risk} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-surface-muted">
                <p className="text-xs text-foreground-subtle">Rating</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                  {selectedVendor.rating}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted">
                <p className="text-xs text-foreground-subtle">On-Time Delivery</p>
                <p className="text-lg font-bold text-foreground">{selectedVendor.onTimeDelivery}%</p>
              </div>
            </div>
            {selectedVendor.gst && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">GST Details</h4>
                <p className="text-sm text-foreground-muted font-mono bg-surface-muted px-3 py-2 rounded-lg">{selectedVendor.gst}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm text-foreground-muted">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-foreground-subtle" />{selectedVendor.email}</p>
                {selectedVendor.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-foreground-subtle" />{selectedVendor.phone}</p>}
                {selectedVendor.contactPerson && <p>{selectedVendor.contactPerson} — {selectedVendor.address}</p>}
              </div>
            </div>
            <Button className="w-full" onClick={() => navigate(`/vendors/${entityId(selectedVendor)}`)}>
              View Full Profile
            </Button>
          </div>
        )}
      </Drawer>

      <Drawer open={showAdd} onClose={() => setShowAdd(false)} title="Add Vendor">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(newVendor);
          }}
        >
          <Input label="Name" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} required />
          <Input label="Email" type="email" value={newVendor.email} onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} required />
          <Input label="Category" value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })} required />
          <Input label="Phone" value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} />
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Vendor'}
          </Button>
        </form>
      </Drawer>
    </div>
  );
}
