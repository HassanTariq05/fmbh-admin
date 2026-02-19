import { useRef, useState } from 'react'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Upload, FileText, X } from 'lucide-react'
import { useUploadLodgeCsv } from '@/hooks/use-lodges'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type UploadEventsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadEventsDialog({
  open,
  onOpenChange,
}: UploadEventsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Integrate the upload hook
  const uploadMutation = useUploadLodgeCsv()

  const validateFile = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are allowed.')
      setFile(null)
      return false
    }
    setError(null)
    setFile(selectedFile)
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    validateFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    validateFile(droppedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSaveConfirm = async () => {
    if (!file) {
      setError('Please select a CSV file before saving.')
      return
    }

    try {
      await uploadMutation.mutateAsync(file)
      setFile(null)
      onOpenChange(false)
    } catch (err) {
      // error is already handled in hook via toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Add Events</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add events.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Label>CSV File</Label>

          <input
            ref={fileInputRef}
            type='file'
            accept='.csv'
            className='hidden'
            onChange={handleFileChange}
          />

          {!file ? (
            <div
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 hover:bg-muted/50'
              } `}
            >
              <Upload className='text-muted-foreground mb-2 h-6 w-6' />
              <p className='text-sm font-medium'>
                {isDragging
                  ? 'Drop your CSV file here'
                  : 'Click or drag & drop CSV'}
              </p>
              <p className='text-muted-foreground text-xs'>
                Only .csv files are supported
              </p>
            </div>
          ) : (
            <div className='flex items-center justify-between rounded-xl border p-3'>
              <div className='flex items-center gap-2'>
                <FileText className='text-primary h-5 w-5' />
                <span className='max-w-[200px] truncate text-sm font-medium'>
                  {file.name}
                </span>
              </div>
              <Button size='icon' variant='ghost' onClick={handleRemoveFile}>
                <X className='h-4 w-4' />
              </Button>
            </div>
          )}

          {error && <p className='text-destructive text-sm'>{error}</p>}
        </div>

        <DialogFooter className='mt-4 gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button
            onClick={handleSaveConfirm}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
