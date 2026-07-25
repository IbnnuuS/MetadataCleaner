export interface MetadataItem {
  name: string
  category: string
  value: string
  size: number
  status: string
}

export interface AIMetadata {
  found: boolean
  generator?: string
  confidence?: string
  location?: string
  category?: string
  message?: string
}

export interface ScanStageData {
  file_size: number
  metadata_size: number
  metadata_count: number
  dimensions: string
  format: string
  metadata: MetadataItem[]
  ai_metadata: AIMetadata
}

export interface CleanResponse {
  success: boolean
  filename: string
  mime_type: string
  clean_image_b64: string
  before: ScanStageData
  after: ScanStageData
  verification: {
    fully_removed: boolean
    notes: string
  }
}
