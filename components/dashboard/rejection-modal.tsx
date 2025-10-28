import React from 'react'

interface RejectionModalProps {
  blogTitle: string
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function RejectionModal({ blogTitle, onClose, onConfirm }: RejectionModalProps) {
  const [reason, setReason] = React.useState('')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Reject Blog</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide a reason for rejecting "{blogTitle}"
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full p-3 border border-border rounded-md bg-background text-foreground mb-4"
          rows={4}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Reject Blog
          </button>
        </div>
      </div>
    </div>
  )
}
