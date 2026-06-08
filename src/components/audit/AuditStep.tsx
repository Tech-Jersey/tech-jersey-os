'use client'

type Option = {
  label: string
  value: string
}

type AuditStepProps = {
  stepNumber: number
  totalSteps: number
  question: string
  options: Option[]
  type: 'single' | 'multi'
  selectedValues: string[]
  onSelect: (value: string) => void
  onNext: () => void
  onBack: () => void
  canGoBack: boolean
  nextLabel?: string
}

export default function AuditStep({
  stepNumber,
  totalSteps,
  question,
  options,
  type,
  selectedValues,
  onSelect,
  onNext,
  onBack,
  canGoBack,
  nextLabel = 'Continue',
}: AuditStepProps) {
  const canProceed = selectedValues.length > 0

  return (
    <div className="audit-step-card">
      {/* Step number */}
      <div className="audit-step-num">
        Question {stepNumber} of {totalSteps}
        {type === 'multi' && (
          <span style={{ marginLeft: 12, opacity: 0.6, fontSize: 10 }}>
            · Select all that apply
          </span>
        )}
      </div>

      {/* Question */}
      <h2 className="audit-step-q">{question}</h2>

      {/* Options */}
      <div className="audit-options">
        {options.map(opt => {
          const isSelected = selectedValues.includes(opt.value)
          return (
            <button
              key={opt.value}
              className={`audit-option${type === 'multi' ? ' multi' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => onSelect(opt.value)}
              type="button"
              aria-pressed={isSelected}
            >
              <span className="audit-option-dot">
                <span className="audit-option-check" />
              </span>
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="audit-nav">
        <button
          className="audit-btn-back"
          onClick={onBack}
          type="button"
          style={{ visibility: canGoBack ? 'visible' : 'hidden' }}
        >
          ← Back
        </button>
        <button
          className="audit-btn-next"
          onClick={onNext}
          disabled={!canProceed}
          type="button"
        >
          {nextLabel} →
        </button>
      </div>
    </div>
  )
}
