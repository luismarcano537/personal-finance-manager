import type { Transaction } from '../../types/transaction'

type DeleteTransactionConfirmModalProps = {
  error: string
  formatCurrency: (value: number) => string
  formatTransactionDate: (value: string) => string
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
  transaction: Transaction | null
}

function DeleteTransactionConfirmModal({
  error,
  formatCurrency,
  formatTransactionDate,
  isDeleting,
  onCancel,
  onConfirm,
  transaction,
}: DeleteTransactionConfirmModalProps) {
  if (transaction === null) {
    return null
  }

  return (
    <div
      aria-labelledby="delete-transaction-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#1F2933]/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_28px_80px_rgba(220,38,38,0.16)]">
        <div className="border-b border-[#E5E7EB] px-6 py-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#DC2626]">
            Remove from active list
          </p>
          <h2
            className="mt-2 text-2xl font-bold text-[#1F2933]"
            id="delete-transaction-title"
          >
            Delete transaction?
          </h2>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          {error.length > 0 ? (
            <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEF2F2] px-4 py-3">
              <p className="text-sm font-medium text-[#DC2626]">{error}</p>
            </div>
          ) : null}

          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAF7] p-4">
            <p className="break-words text-base font-semibold text-[#1F2933]">
              {transaction.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6B7280]">
              <span>{formatCurrency(transaction.amount)}</span>
              <span>{formatTransactionDate(transaction.transactionDate)}</span>
            </div>
          </div>

          <p className="text-sm leading-6 text-[#374151]">
            This transaction will be removed or deactivated from the active
            transactions list.
          </p>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              className="rounded-2xl border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-semibold text-[#374151] transition hover:bg-[#F8FAF7] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-2xl bg-[#DC2626] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.22)] transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isDeleting}
              onClick={onConfirm}
              type="button"
            >
              {isDeleting ? 'Deleting...' : 'Delete transaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteTransactionConfirmModal
