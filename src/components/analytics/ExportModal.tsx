import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const EXPORT_FORMATS = ['CSV', 'PDF'] as const

export interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  format?: 'CSV' | 'PDF'
  onConfirm?: (params: {
    format: 'CSV' | 'PDF'
    includeScheduled: boolean
    emailDelivery: boolean
  }) => void
}

export function ExportModal({
  open,
  onOpenChange,
  format: initialFormat = 'CSV',
  onConfirm,
}: ExportModalProps) {
  const [format, setFormat] = useState<'CSV' | 'PDF'>(initialFormat)
  const [includeScheduled, setIncludeScheduled] = useState(false)
  const [emailDelivery, setEmailDelivery] = useState(false)

  const handleConfirm = () => {
    onConfirm?.({ format, includeScheduled, emailDelivery })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Export options</DialogTitle>
          <DialogDescription>
            Confirm export format and delivery options.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as 'CSV' | 'PDF')}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="include-scheduled" className="flex-1">
              Include scheduled report config
            </Label>
            <Switch
              id="include-scheduled"
              checked={includeScheduled}
              onCheckedChange={setIncludeScheduled}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-delivery" className="flex-1">
              Email delivery
            </Label>
            <Switch
              id="email-delivery"
              checked={emailDelivery}
              onCheckedChange={setEmailDelivery}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="rounded-full bg-[#111111] text-white hover:bg-[#2B2B2B]"
          >
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
