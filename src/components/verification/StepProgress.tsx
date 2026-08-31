import { cn } from '@/utils/cn';

interface StepProgressProps {
  currentStep: 1 | 2;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="mb-6" aria-label={`Step ${currentStep} of 2`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2].map((step) => (
          <div
            key={step}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              step === currentStep ? 'w-10 bg-[var(--accent)]' : 'w-6 bg-[var(--border-subtle)]',
              step < currentStep && 'bg-[var(--accent-muted)]'
            )}
          />
        ))}
      </div>
      <p className="text-center text-[11px] text-[var(--text-muted)] font-medium tracking-wide">
        Step {currentStep} of 2
      </p>
    </div>
  );
}
