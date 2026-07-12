import Button from './Button';
import EmptyIllustration from '../illustrations/EmptyIllustration';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, type = 'default' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4">
        {Icon ? (
          <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center">
            <Icon className="w-8 h-8 text-foreground-subtle" />
          </div>
        ) : (
          <EmptyIllustration type={type} />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-foreground-subtle mt-2 max-w-sm">{description}</p>
      {actionLabel && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
