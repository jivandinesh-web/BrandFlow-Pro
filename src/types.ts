export type UserRole = 'Admin' | 'Designer' | 'Sales' | 'Production' | 'QC' | 'Accounts';

export type ModuleType =
  | 'Dashboard'
  | 'Customers'
  | 'Quotations'
  | 'ClientQuote'
  | 'Approval'
  | 'ArtworkUpload'
  | 'Design'
  | 'PdfProofApproval'
  | 'Production'
  | 'QualityControl'
  | 'Accounts'
  | 'PaymentTracking'
  | 'Dispatch'
  | 'Reports'
  | 'AssetLibrary'
  | 'UserManagement'
  | 'Settings';

export type WorkflowStage =
  | 'Quotation'
  | 'Approval'
  | 'Artwork'
  | 'Design'
  | 'Proofing'
  | 'Production'
  | 'QualityControl'
  | 'Invoicing'
  | 'Dispatch'
  | 'Completed';

export interface Customer {
  id: string;
  code: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  accountType: 'Corporate' | 'Agency' | 'Retail' | 'VIP';
  creditLimit: number;
  balanceDue: number;
  discountRate: number;
  contactPerson: string;
  address: string;
  taxNumber: string;
  totalOrders: number;
  status: 'Active' | 'On Hold' | 'Credit Review';
}

export interface PrintItem {
  description: string;
  category: 'Commercial Print' | 'Packaging' | 'Large Format' | 'Apparel/Embroidery' | 'Stationery' | string;
  quantity: number;
  paperStock: string;
  colorProfile: 'CMYK 4/4' | 'CMYK 4/0' | 'PMS Spot + CMYK' | 'Monochrome' | string;
  finishes: string[];
  unitCost: number;
  totalCost: number;
  imageUrl?: string;
  brandingPlacement?: string;
  brandingWidthMm?: number;
  brandingHeightMm?: number;
  maxPhysicalWidthMm?: number;
  maxPhysicalHeightMm?: number;
  brandingMethod?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  projectName: string;
  dateCreated: string;
  validUntil: string;
  items: PrintItem[];
  subtotal: number;
  discountAmount: number;
  vatTax: number;
  totalAmount: number;
  marginPercent: number;
  status: 'Draft' | 'Sent to Client' | 'Approved' | 'Rejected' | 'Expired';
  salesRep: string;
  notes: string;
}

export interface ArtworkVersion {
  version: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  colorSpace: string;
  resolutionDpi: number;
  hasBleed: boolean;
  fontsEmbedded: boolean;
  status: 'Preflight Passed' | 'Preflight Warnings' | 'Rejected' | 'Approved for Print';
  previewUrl: string;
}

export interface AnnotationPin {
  id: string;
  x: number;
  y: number;
  author: string;
  role: string;
  text: string;
  date: string;
  resolved: boolean;
}

export interface ProofApproval {
  id: string;
  jobId: string;
  artworkVersion: string;
  clientApproverName: string;
  clientApproverEmail: string;
  signatureDataUrl?: string;
  signedAt?: string;
  status: 'Pending Review' | 'Changes Requested' | 'Signed & Approved';
  annotations: AnnotationPin[];
  rejectionReason?: string;
}

export interface ProductionJobCard {
  jobId: string;
  jobNumber: string;
  clientName: string;
  title: string;
  quantity: number;
  printProcess: 'Heidelberg Offset Press 1' | 'HP Indigo Digital 7K' | 'Roland Large Format UV' | 'Tajima Embroidery 8-Head' | 'Automatic Screen Press';
  paperStockDetails: string;
  finishingOps: string[];
  plateNumber?: string;
  scheduledStart: string;
  estimatedCompletion: string;
  progressPercent: number;
  status: 'Queued' | 'Pre-Press / Plates' | 'Running Press' | 'Finishing & Binding' | 'Completed';
  operator: string;
  scrapPercentage: number;
}

export interface QualityControlCheck {
  id: string;
  jobId: string;
  inspectorName: string;
  inspectionDate: string;
  deltaEColorMatch: number; // e.g. 1.2 (Pass < 2.5)
  trimAccuracyMm: number;
  registrationStatus: 'Perfect' | 'Acceptable' | 'Misaligned';
  finishingCheck: 'Passed' | 'Minor Flaws' | 'Failed';
  packagingCheck: 'Passed' | 'Failed';
  overallResult: 'PASS - Sealed' | 'REJECT - Recalibrate' | 'CONDITIONAL PASS';
  notes: string;
  samplePhotoTag: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';
  syncedToSage: boolean;
  syncedToXero: boolean;
  syncedToQuickbooks: boolean;
  syncTimestamp?: string;
}

export interface DispatchNote {
  id: string;
  dispatchNumber: string;
  jobId: string;
  customerName: string;
  shippingAddress: string;
  courierName: 'Courier Guy Express' | 'RAM Hand-to-Hand Couriers' | 'DHL South Africa' | 'DHL Express' | 'FedEx Freight' | 'Local BrandFlow Courier' | 'Client Pickup' | string;
  trackingNumber: string;
  boxCount: number;
  weightKg: number;
  dispatchDate: string;
  estimatedDelivery: string;
  receiverSignatureName?: string;
  status: 'Preparing Boxes' | 'Dispatched' | 'In Transit' | 'Delivered & Signed';
}

export interface DigitalAsset {
  id: string;
  title: string;
  category: 'Vector Logo' | 'Print Die-Line' | 'Brand Manual' | 'Hi-Res Mockup' | 'Production Template';
  clientName: string;
  fileFormat: 'AI' | 'PDF/X-4' | 'EPS' | 'PSD' | 'TIFF';
  fileSize: string;
  dimensions: string;
  tags: string[];
  lastModified: string;
  downloadUrl: string;
}

export interface SystemActivity {
  id: string;
  timestamp: string;
  category: 'Job Update' | 'Proof Approval' | 'Artwork Upload' | 'Invoicing' | 'QC Inspection' | 'Dispatch' | 'Quotation' | 'Press Status';
  description: string;
  user: string;
  jobNumber?: string;
  statusBadge?: string;
  timeAgo?: string;
  priority?: 'High' | 'Medium' | 'Low' | 'Urgent';
}

export type PopularMailProgram =
  | 'Gmail'
  | 'Outlook (Office 365)'
  | 'Yahoo Mail'
  | 'Apple / iCloud Mail'
  | 'Default Mail Client';

export interface ClientEmailLog {
  id: string;
  clientId?: string;
  clientName: string;
  company: string;
  clientEmail: string;
  jobNumber?: string;
  quoteNumber?: string;
  projectName?: string;
  subject: string;
  bodySnippet: string;
  mailProgram: PopularMailProgram | string;
  status: 'Sent' | 'Dispatched' | 'Delivered';
  timestamp: string;
  isoTimestamp: string;
  sentBy: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  customerName: string;
  customerEmail?: string;
  companyName: string;
  projectName: string;
  category: string;
  quantity: number;
  totalValue: number;
  stage: WorkflowStage;
  priority: 'Normal' | 'High' | 'URGENT - Express';
  dateCreated: string;
  deadline: string;
  assignedDesigner: string;
  artworkVersions: ArtworkVersion[];
  quote: Quote;
  proofApproval?: ProofApproval;
  productionCard?: ProductionJobCard;
  qcCheck?: QualityControlCheck;
  invoice?: Invoice;
  dispatch?: DispatchNote;
}
