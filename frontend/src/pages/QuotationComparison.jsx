import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star, Award, TrendingDown, Clock, ShieldCheck,
  BrainCircuit, ChevronRight, Filter, SortAsc,
  Search, Info, AlertTriangle, Lightbulb
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/DataState';
import { formatCurrency, entityId } from '../utils/formatters';
import { rfqsApi } from '../api/rfqs';
import { quotationsApi } from '../api/quotations';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

export default function QuotationComparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [sortBy, setSortBy] = useState('score');
  const [selectedRfqId, setSelectedRfqId] = useState(searchParams.get('rfq'));

  useEffect(() => {
    const q = searchParams.get('rfq');
    if (q) setSelectedRfqId(q);
  }, [searchParams]);

  const { data: rfqData, isLoading: rfqsLoading } = useQuery({
    queryKey: queryKeys.rfqs({ status: { $in: ['open', 'evaluating'] }, limit: 50 }),
    queryFn: () => rfqsApi.list({ status: { $in: ['open', 'evaluating'] }, limit: 50 }),
  });

  const rfqs = rfqData?.items || [];
  const rfqId = selectedRfqId || entityId(rfqs[0]);
  const currentRfq = rfqs.find((r) => entityId(r) === rfqId);

  const { data: comparison, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.quotationCompare(rfqId),
    queryFn: () => quotationsApi.compare(rfqId),
    enabled: !!rfqId,
    retry: 1,
  });

  const selectMutation = useMutation({
    mutationFn: quotationsApi.select,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      success('Winning quotation selected and Purchase Order draft created');
    },
    onError: (err) => toastError(err.response?.data?.message || 'Failed to select winner'),
  });

  const quotes = comparison?.quotations || [];
  const summary = comparison?.summary || {};
  const ai = comparison?.aiInsights || null;

  const sorted = [...quotes].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    if (sortBy === 'score') return b.score - a.score;
    return 0;
  });

  if (rfqsLoading) return <LoadingState message="Connecting to Procurement Engine..." />;
  if (!rfqs.length) return <EmptyState message="No active RFQs available for comparison" />;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title="Procurement Comparison Center"
        subtitle={currentRfq ? `${currentRfq.rfqNumber} — ${currentRfq.title}` : 'Decision Intelligence Matrix'}
        actions={
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
              <select
                value={rfqId || ''}
                onChange={(e) => {
                  setSelectedRfqId(e.target.value);
                  setSearchParams({ rfq: e.target.value });
                }}
                className="rounded-xl border border-border pl-10 pr-4 py-2 text-sm bg-surface ring-primary/20 focus:ring-4 transition-all outline-none appearance-none"
              >
                {rfqs.map((r) => (
                  <option key={entityId(r)} value={entityId(r)}>{r.rfqNumber} — {r.title}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-border pl-10 pr-4 py-2 text-sm bg-surface ring-primary/20 focus:ring-4 transition-all outline-none appearance-none"
              >
                <option value="score">Rank by AI Score</option>
                <option value="price">Lowest Price First</option>
                <option value="delivery">Fastest Delivery</option>
              </select>
            </div>
          </div>
        }
      />

      {isLoading && <LoadingState message="Analyzing vendor quotations..." />}
      {isError && (
        <ErrorState
          message={error?.response?.data?.message || "Internal error in comparison engine"}
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && quotes.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          <div className="xl:col-span-3 space-y-6">
            {/* AI Recommendation Spotlight */}
            {ai?.recommendation && (
              <div className="relative p-6 rounded-2xl bg-gradient-to-r from-emerald-brand/10 to-cyan-soft/10 border border-emerald-brand/20 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform">
                  <Award className="w-20 h-20 text-emerald-brand" />
                </div>
                <div className="relative flex items-start gap-5">
                  <div className="p-3 rounded-xl bg-emerald-brand text-white shadow-lg">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-foreground">AI Top Recommendation</h3>
                      <Badge status="low">Best Value</Badge>
                    </div>
                    <p className="mt-2 text-foreground-subtle leading-relaxed max-w-2xl">
                      {ai.recommendation.rationale}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => selectMutation.mutate(summary.recommendedQuotationId)}
                        disabled={selectMutation.isPending}
                      >
                        Approve Winner: {ai.recommendation.vendorName}
                      </Button>
                      <button className="text-sm font-medium text-emerald-dark hover:underline flex items-center gap-1">
                        View Analysis <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Card className="overflow-hidden border-none shadow-premium bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-muted/50 border-b border-border">
                      <th className="text-left py-5 px-6 font-semibold text-foreground border-r border-border min-w-[200px]">Criteria Matrix</th>
                      {sorted.map((q) => (
                        <th key={entityId(q)} className={`py-5 px-6 min-w-[220px] text-center transition-colors ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border-2 border-border mb-3 flex items-center justify-center font-bold text-foreground-subtle bg-surface">
                              {q.vendor?.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-foreground block">{q.vendor?.name}</span>
                            <span className="text-[10px] text-foreground-subtle font-mono uppercase tracking-wider">{q.vendor?.vendorCode}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="group hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground-subtle border-r border-border flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-dark" /> AI Performance Score
                      </td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-4 px-6 text-center ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-xl font-black ${q.score > 80 ? 'text-emerald-dark' : q.score > 60 ? 'text-amber-warm' : 'text-rose-600'}`}>
                              {q.score}<span className="text-xs font-normal text-foreground-subtle">/100</span>
                            </span>
                            <div className="w-full max-w-[80px] h-1.5 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${q.score > 80 ? 'bg-emerald-brand' : q.score > 60 ? 'bg-amber-warm' : 'bg-rose-600'}`}
                                style={{ width: `${q.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="group hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground-subtle border-r border-border">Quotation Status</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-4 px-6 text-center ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <Badge status={q.status} />
                        </td>
                      ))}
                    </tr>
                    <tr className="group hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground-subtle border-r border-border">Total Price</td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-4 px-6 text-center ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <span className={`text-lg font-bold ${q.isLowestPrice ? 'text-emerald-dark' : 'text-foreground'}`}>
                            {formatCurrency(q.price)}
                          </span>
                          {q.isLowestPrice && <span className="block text-[10px] text-emerald-brand font-medium uppercase tracking-tight">Best Price</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="group hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground-subtle border-r border-border flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-brand" /> Delivery Timeline
                      </td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-4 px-6 text-center ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <span className="font-semibold text-foreground">{q.deliveryDays}</span>
                          <span className="text-foreground-subtle text-xs ml-1">days</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="group hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground-subtle border-r border-border flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-warm" /> Vendor Trust Rating
                      </td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-4 px-6 text-center ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                            <span className="font-bold text-foreground">{q.vendor?.rating}</span>
                            <span className="text-xs text-foreground-subtle">({q.vendor?.onTimeDelivery}%)</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="group hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground-subtle border-r border-border flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" /> Compliance & Risk
                      </td>
                      {sorted.map((q) => (
                        <td key={entityId(q)} className={`py-4 px-6 text-center ${entityId(q) === summary.recommendedQuotationId ? 'bg-emerald-brand/5' : ''}`}>
                          <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${q.vendor?.risk === 'low' ? 'bg-emerald-brand/10 text-emerald-dark' :
                              q.vendor?.risk === 'medium' ? 'bg-amber-warm/10 text-amber-dark' :
                                'bg-rose-600/10 text-rose-600'
                            }`}>
                            {q.vendor?.risk} risk
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* VendorBridge AI Copilot Panel */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-premium space-y-6 flex flex-col min-h-[600px]">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground">AI Procurement Copilot</h3>
              </div>

              {ai ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5" /> Savings Analysis
                    </div>
                    <div className="p-4 rounded-xl bg-surface-muted/50 border border-border">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-2xl font-bold text-foreground">{ai.costAnalysis.savingsPercentage}%</span>
                          <span className="text-xs text-foreground-subtle ml-2">est. savings</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-dark">-{formatCurrency(ai.costAnalysis.totalPotentialSavings)}</span>
                      </div>
                      <p className="mt-2 text-xs text-foreground-subtle italic">
                        {ai.costAnalysis.marketComparison}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-warm" /> Risk Factors
                    </div>
                    <div className="space-y-2">
                      {ai.riskAnalysis.factors.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border text-xs text-foreground bg-amber-warm/5 border-amber-warm/10">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-amber-warm shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-brand" /> Negotiation Strategy
                    </div>
                    <div className="space-y-3">
                      {ai.negotiationAdvice.map((a, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-foreground-subtle group">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-brand hidden group-hover:block shrink-0" />
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-border group-hover:hidden shrink-0" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="p-3 rounded-xl bg-surface-muted text-center">
                      <p className="text-[10px] text-foreground-subtle">
                        Analysis updated just now based on <b>{quotes.length}</b> quotations.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <BrainCircuit className="w-12 h-12 mb-4 text-border" />
                  <p className="text-sm">AI analysis is temporarily unavailable.</p>
                </div>
              )}
            </div>

            <Card>
              <CardHeader title="Decision Log" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-surface-muted italic text-xs text-foreground-subtle">
                  Compare status: {currentRfq?.status}
                </div>
                <div className="flex justify-between p-2">
                  <span className="text-foreground-muted">Total Budget</span>
                  <span className="font-medium">{formatCurrency(currentRfq?.budget)}</span>
                </div>
                <div className="flex justify-between p-2">
                  <span className="text-foreground-muted">Best Price</span>
                  <span className="font-medium text-emerald-dark">{formatCurrency(summary.lowestPrice)}</span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {!isLoading && !isError && quotes.length === 0 && (
        <EmptyState
          title="No Quotations in Queue"
          message="We're waiting for vendors to respond to this request. Come back later for analysis."
        />
      )}
    </div>
  );
}
