import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, FileText, GitCompare, CheckSquare, ShoppingCart, Receipt,
  BarChart3, Shield, Zap, Clock, TrendingUp, Star, ChevronDown, Mail, Phone, MapPin,
  HelpCircle, Send,
} from 'lucide-react';
import Logo from '../components/brand/Logo';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { contactApi } from '../api/contact';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/authErrors';

const features = [
  { icon: Users, title: 'Vendor Management', desc: 'Onboard, rate, and manage vendors with risk scoring and performance tracking.' },
  { icon: FileText, title: 'RFQ Management', desc: 'Create RFQs, invite vendors, and track responses in real time.' },
  { icon: GitCompare, title: 'Quotation Comparison', desc: 'Side-by-side vendor quotes with AI-powered recommendations.' },
  { icon: CheckSquare, title: 'Approval Workflows', desc: 'Multi-step approvals with audit trails and notifications.' },
  { icon: ShoppingCart, title: 'Purchase Orders', desc: 'Auto-generate POs from winning quotations with status tracking.' },
  { icon: Receipt, title: 'Invoice Generation', desc: 'Create, send, and track invoices linked to purchase orders.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Spending trends, vendor performance, and procurement KPIs.' },
];

const steps = [
  { n: 1, title: 'Create RFQ', desc: 'Define requirements and invite qualified vendors.' },
  { n: 2, title: 'Receive Quotations', desc: 'Vendors submit competitive pricing and delivery terms.' },
  { n: 3, title: 'Compare Vendors', desc: 'Evaluate quotes on price, delivery, and performance.' },
  { n: 4, title: 'Approval Workflow', desc: 'Route decisions through managers and approvers.' },
  { n: 5, title: 'Purchase Order', desc: 'Generate POs automatically from approved quotes.' },
  { n: 6, title: 'Invoice Generation', desc: 'Issue invoices and track payments end to end.' },
];

const roles = [
  { title: 'Admin', desc: 'Full system control, user management, and configuration.' },
  { title: 'Procurement Officer', desc: 'Create RFQs, manage vendors, and drive sourcing.' },
  { title: 'Vendor', desc: 'Submit quotations and track POs and invoices.' },
  { title: 'Manager / Approver', desc: 'Review and approve procurement decisions.' },
];

const benefits = [
  { icon: Zap, title: 'Faster Procurement', desc: 'Reduce cycle time with automated workflows.' },
  { icon: Shield, title: 'Compliance Ready', desc: 'Audit trails and approval gates built in.' },
  { icon: TrendingUp, title: 'Cost Savings', desc: 'Competitive bidding drives better pricing.' },
  { icon: Clock, title: 'Real-time Visibility', desc: 'Live dashboards across the procurement pipeline.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Procurement Director, Acme Corp', quote: 'VendorBridge cut our RFQ cycle from weeks to days. The comparison view alone saved us 12% on IT spend.' },
  { name: 'Marcus Webb', role: 'CFO, Nova Industries', quote: 'Approval workflows and audit logs gave our finance team the control we needed without slowing operations.' },
  { name: 'Priya Sharma', role: 'Vendor Partner, DataCore', quote: 'As a vendor, submitting quotes is straightforward. We get notified instantly and track PO status in one place.' },
];

const stats = [
  { value: '500+', label: 'Active Vendors' },
  { value: '$2.4M+', label: 'Procurement Volume' },
  { value: '98%', label: 'On-time Delivery' },
  { value: '4.2 days', label: 'Avg. Cycle Time' },
];

const faqs = [
  { q: 'What is VendorBridge?', a: 'VendorBridge is a modern procurement ERP that connects vendors, buyers, and approvers in one platform—from RFQ to invoice.' },
  { q: 'Who can use VendorBridge?', a: 'Admins, procurement officers, managers, and vendors each get role-based dashboards and workflows.' },
  { q: 'Is my data secure?', a: 'Yes. We use JWT authentication, encrypted passwords, and role-based access control on every API endpoint.' },
  { q: 'Can I try it for free?', a: 'Sign up for a free account and explore the full platform with demo data seeded for your team.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-muted transition-colors">
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-4 pb-4 text-sm text-foreground-subtle">{a}</p>}
    </div>
  );
}

export default function Landing() {
  const { success, error: toastError } = useToast();
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const submitContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactApi.submit(contact);
      success('Message sent! We will respond shortly.');
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/"><Logo variant="compact" /></Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-foreground-subtle">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/signup"><Button size="sm" icon={ArrowRight}>Sign up</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-mesh">
        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <p className="text-sm font-medium text-emerald-brand mb-3">Procurement ERP for modern teams</p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Bridge vendors, buyers &amp; approvals in one platform
            </h1>
            <p className="mt-5 text-lg text-foreground-subtle max-w-lg">
              VendorBridge streamlines RFQs, quotations, approvals, purchase orders, and invoicing—with real-time analytics your team can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg" icon={ArrowRight}>Get started free</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-xl dark:shadow-black/30">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="p-4 rounded-xl bg-surface-muted text-center">
                    <p className="text-2xl font-bold text-emerald-brand">{s.value}</p>
                    <p className="text-xs text-foreground-subtle mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-32 rounded-xl bg-gradient-to-r from-emerald-brand/20 to-cyan-soft/20 flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-emerald-brand/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-surface-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Everything you need to procure smarter</h2>
            <p className="text-foreground-subtle mt-2 max-w-2xl mx-auto">End-to-end procurement modules built for enterprise teams and growing businesses.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-border bg-surface-elevated card-hover">
                <div className="w-10 h-10 rounded-lg bg-emerald-brand/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-emerald-brand" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-foreground-subtle mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative p-6 rounded-2xl border border-border">
                <span className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-emerald-brand text-white text-sm font-bold flex items-center justify-center">{s.n}</span>
                <h3 className="font-semibold text-foreground mt-2">{s.title}</h3>
                <p className="text-sm text-foreground-subtle mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-surface-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Built for every role</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r) => (
              <div key={r.title} className="p-5 rounded-xl border border-border bg-surface-elevated text-center">
                <h3 className="font-semibold text-emerald-brand">{r.title}</h3>
                <p className="text-sm text-foreground-subtle mt-2">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Why teams choose VendorBridge</h2>
            <div className="mt-8 space-y-6">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-brand/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-5 h-5 text-emerald-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{b.title}</h3>
                    <p className="text-sm text-foreground-subtle mt-1">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="p-6 rounded-2xl border border-border bg-surface-elevated text-center">
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-foreground-subtle mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Trusted by procurement teams</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-border bg-surface-elevated">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 text-amber-warm fill-amber-warm" />)}
                </div>
                <p className="text-sm text-foreground-muted italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-foreground-subtle">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8 flex items-center justify-center gap-2">
            <HelpCircle className="w-8 h-8 text-emerald-brand" /> FAQ
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-surface-muted/50">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Get in touch</h2>
            <p className="text-foreground-subtle mt-2">Questions about VendorBridge? We&apos;d love to hear from you.</p>
            <div className="mt-8 space-y-4 text-sm">
              <p className="flex items-center gap-3 text-foreground-muted"><Mail className="w-5 h-5 text-emerald-brand" /> hello@vendorbridge.com</p>
              <p className="flex items-center gap-3 text-foreground-muted"><Phone className="w-5 h-5 text-emerald-brand" /> +1 (800) 555-0199</p>
              <p className="flex items-start gap-3 text-foreground-muted"><MapPin className="w-5 h-5 text-emerald-brand mt-0.5" /> 100 Procurement Way, Suite 400<br />San Francisco, CA 94105</p>
            </div>
          </div>
          <form onSubmit={submitContact} className="p-6 rounded-2xl border border-border bg-surface-elevated space-y-4">
            <input className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-background" placeholder="Your name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
            <input type="email" className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-background" placeholder="Email address" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
            <input className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-background" placeholder="Subject" value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} />
            <textarea className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-background min-h-[120px]" placeholder="Your message" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} required />
            <Button type="submit" className="w-full" icon={Send} disabled={sending}>{sending ? 'Sending...' : 'Send message'}</Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-emerald-brand/8 via-cyan-soft/12 to-emerald-brand/5 border-y border-emerald-brand/15">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to transform your procurement?</h2>
          <p className="mt-3 text-foreground-subtle max-w-xl mx-auto">Join teams already using VendorBridge to source smarter and spend less.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/signup"><Button size="lg" icon={ArrowRight}>Create free account</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo variant="compact" />
          <p className="text-sm text-foreground-subtle">© {new Date().getFullYear()} VendorBridge. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-foreground-subtle">
            <a href="#features" className="hover:text-foreground">Features</a>
            <Link to="/login" className="hover:text-foreground">Login</Link>
            <Link to="/signup" className="hover:text-foreground">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
