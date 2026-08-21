import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  ArrowRight,
  FileCheck,
  Layers,
  FileDown,
  Printer,
  X,
  Check,
  Building2,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Sparkles,
  Edit3,
  User,
  Mail,
  Phone,
  FileText,
  DollarSign,
  ChevronDown,
  Save,
  Ruler,
  MapPin,
  Eye,
  ShieldAlert,
  CheckCircle2,
  PlusCircle,
  Palette,
} from 'lucide-react';
import { Job, PrintItem } from '../../types';
import { INITIAL_CUSTOMERS } from '../../data/mockData';
import { BrandingPreviewCanvas } from '../BrandingPreviewCanvas';
import { triggerQuotationNotification } from '../../utils/notificationHelper';
import { EmailLink } from '../EmailLink';

interface QuotationsModuleProps {
  job: Job;
  allJobs?: Job[];
  onSaveJob?: (updatedJob: Job) => void;
  onSelectJob?: (job: Job) => void;
  isEditing?: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
}

// Master list of industry-standard and specialty branding methods & techniques
export const BRANDING_METHODS_OPTIONS = [
  {
    id: 'dtf_printing',
    name: 'DTF (Direct To Film Transfers)',
    category: 'Apparel & Fabric Transfers',
    group: 'Apparel & Transfers',
    defaultUnitPrice: 95.0,
    icon: '🎨',
    description: 'High-stretch full color transfers with white underbase for any fabric color.',
    defaultStock: 'PET Transfer Film + TPU Hot Melt Adhesive Powder',
    defaultColor: 'CMYK + Opaque White High-Stretch',
    defaultFinishes: ['Matt Powder Finish', 'Precision Contour Plotter Cut'],
    defaultPlacement: 'Left Chest (Pocket Area)',
    placements: ['Left Chest (Pocket Area)', 'Center Chest (Full Front)', 'Upper Back (Yoke / Neck)', 'Right Sleeve (Bicep)'],
    defaultWidthMm: 100,
    defaultHeightMm: 100,
    maxPhysicalWidthMm: 300,
    maxPhysicalHeightMm: 420,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
  },
  {
    id: 'embroidery_flat',
    name: 'Embroidery (Flat Stitch & Badges)',
    category: 'Threadwork & Needlework',
    group: 'Embroidery & Threadwork',
    defaultUnitPrice: 85.0,
    icon: '🪡',
    description: 'High-density computerized multi-color thread embroidery with sharp edge definition.',
    defaultStock: 'High-Density 100% Polyester / Rayon Thread',
    defaultColor: 'Pantone Thread Matched (Up to 15 Colors)',
    defaultFinishes: ['Heat-Seal Iron-on Backing', 'Merrowed Overlocked Border'],
    defaultPlacement: 'Left Chest (Pocket Area)',
    placements: ['Left Chest (Pocket Area)', 'Cap Front Panel', 'Right Sleeve (Bicep)', 'Upper Back (Yoke / Neck)'],
    defaultWidthMm: 90,
    defaultHeightMm: 90,
    maxPhysicalWidthMm: 250,
    maxPhysicalHeightMm: 250,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
  },
  {
    id: 'embroidery_3d_puff',
    name: '3D Puff Embroidery (Raised High-Density)',
    category: 'Threadwork & Needlework',
    group: 'Embroidery & Threadwork',
    defaultUnitPrice: 115.0,
    icon: '🧵',
    description: 'High-density dimensional foam underlay creating pronounced 3D raised stitching on caps and apparel.',
    defaultStock: '3D High-Density EVA Foam + Poly Thread',
    defaultColor: 'Solid Spot Thread Tones',
    defaultFinishes: ['3D Raised Foam Core', 'Laser Trimmed Stitch Tolerance'],
    defaultPlacement: 'Cap Front Panel',
    placements: ['Cap Front Panel', 'Left Chest (Pocket Area)', 'Center Chest (Full Front)'],
    defaultWidthMm: 120,
    defaultHeightMm: 60,
    maxPhysicalWidthMm: 150,
    maxPhysicalHeightMm: 75,
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80',
  },
  {
    id: 'silk_screen_printing',
    name: 'Silk Screening / Screen Printing',
    category: 'Screen Printing',
    group: 'Apparel & Transfers',
    defaultUnitPrice: 75.0,
    icon: '🖨️',
    description: 'Traditional stencil screen printing with high-opacity plastisol or discharge inks for bulk runs.',
    defaultStock: 'High-Density Plastisol / Water-Based Discharge Inks',
    defaultColor: 'Spot Color Pantone (1 to 6 Colors)',
    defaultFinishes: ['Flash Cured', 'Soft-Hand Additive Finish'],
    defaultPlacement: 'Center Chest (Full Front)',
    placements: ['Center Chest (Full Front)', 'Left Chest (Pocket Area)', 'Upper Back (Yoke / Neck)', 'All Over Pattern (AOP)'],
    defaultWidthMm: 280,
    defaultHeightMm: 350,
    maxPhysicalWidthMm: 350,
    maxPhysicalHeightMm: 450,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
  },
  {
    id: 'hot_foil_stamping',
    name: 'Hot Stamped Foiling (Gold, Silver, Metallic)',
    category: 'Specialty Finishes',
    group: 'Specialty Dies & Luxury Finishes',
    defaultUnitPrice: 65.0,
    icon: '✨',
    description: 'Heated precision metal die stamping ultra-reflective mirror foil onto packaging, leather, or stationery.',
    defaultStock: 'Mirror Metallic Hot Stamping Foil (Gold / Silver / Rose / Copper)',
    defaultColor: 'Mirror Metallic Specular Reflection',
    defaultFinishes: ['Heated Die Stamping', 'Deep Impression Emboss'],
    defaultPlacement: 'Front Cover Center',
    placements: ['Front Cover Center', 'Bottom Right Corner', 'Center Front Face'],
    defaultWidthMm: 120,
    defaultHeightMm: 60,
    maxPhysicalWidthMm: 200,
    maxPhysicalHeightMm: 250,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  },
  {
    id: 'embossing',
    name: 'Embossing (Raised 3D Blind / Foil Relief)',
    category: 'Specialty Finishes',
    group: 'Specialty Dies & Luxury Finishes',
    defaultUnitPrice: 70.0,
    icon: '🏷️',
    description: 'Precision-machined male and female counter dies pressing raised tactile dimensional relief.',
    defaultStock: 'Heavyweight 400gsm Board / Genuine Leather / Hardcover PU',
    defaultColor: 'Blind Tactile (No Ink) or Micro-Emboss Pattern',
    defaultFinishes: ['Multi-Level 3D Sculpted Die Relief'],
    defaultPlacement: 'Center Front Face',
    placements: ['Center Front Face', 'Front Cover Center', 'Bottom Right Corner'],
    defaultWidthMm: 100,
    defaultHeightMm: 80,
    maxPhysicalWidthMm: 220,
    maxPhysicalHeightMm: 250,
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
  },
  {
    id: 'debossing',
    name: 'Debossing (Recessed Stamped Imprint)',
    category: 'Specialty Finishes',
    group: 'Specialty Dies & Luxury Finishes',
    defaultUnitPrice: 70.0,
    icon: '🔲',
    description: 'Heat and pressure pressing the graphic recessed below the substrate surface for a luxury feel.',
    defaultStock: 'Top Grain Leather / Synthetic PU / Suede / Velvet Board',
    defaultColor: 'Natural Tone-on-Tone Burnish',
    defaultFinishes: ['Heat Burnished Edge Impression'],
    defaultPlacement: 'Front Cover Center',
    placements: ['Front Cover Center', 'Bottom Right Corner', 'Center Front Face'],
    defaultWidthMm: 90,
    defaultHeightMm: 60,
    maxPhysicalWidthMm: 200,
    maxPhysicalHeightMm: 200,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  },
  {
    id: 'uv_flatbed_printing',
    name: 'LED UV Full Colour Printing (Direct Flatbed)',
    category: 'Industrial Direct Print',
    group: 'Direct Industrial & Signage',
    defaultUnitPrice: 110.0,
    icon: '💎',
    description: 'Instant UV-cured digital printing on acrylic, wood, metals, glass, drinkware, and rigid media.',
    defaultStock: 'Rigid Substrates (Cast Acrylic, Aluminum, Wood, Glass)',
    defaultColor: 'CMYK + Opaque White + High-Build Gloss Varnish',
    defaultFinishes: ['Raised 3D Spot Gloss Texture', 'Adhesion Primer Layer'],
    defaultPlacement: 'Center Signboard Face',
    placements: ['Center Signboard Face', 'Center Front Face', 'Full Surface Area'],
    defaultWidthMm: 250,
    defaultHeightMm: 180,
    maxPhysicalWidthMm: 600,
    maxPhysicalHeightMm: 900,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
  },
  {
    id: 'sublimation_textile',
    name: 'Dye Sublimation & Roll-to-Roll Textile Printing',
    category: 'Textile & Apparel',
    group: 'Apparel & Transfers',
    defaultUnitPrice: 140.0,
    icon: '🎽',
    description: 'Gas-infused dye sublimation for vibrant all-over sportswear, gazebos, flags, and exhibition graphics.',
    defaultStock: '100% Polyester / Lycra Stretch / Poly-Cotton Blend',
    defaultColor: 'High-Definition CMYK Dye Sublimation',
    defaultFinishes: ['Calender Heat Fixation', 'Hemmed Seams & Reinforced Eyelets'],
    defaultPlacement: 'All Over Pattern (AOP)',
    placements: ['All Over Pattern (AOP)', 'Center Panel Focus', 'Full Surface Area'],
    defaultWidthMm: 1200,
    defaultHeightMm: 800,
    maxPhysicalWidthMm: 1600,
    maxPhysicalHeightMm: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
  },
  {
    id: 'heat_press_vinyl',
    name: 'Heat Press Vinyl & Thermal Transfer (PU / Flock / Reflective)',
    category: 'Thermal Transfers',
    group: 'Apparel & Transfers',
    defaultUnitPrice: 75.0,
    icon: '🔥',
    description: 'Contour plotted thermal PU vinyl for personalized names, jersey numbers, and reflective high-vis.',
    defaultStock: 'PU Heat Transfer Film / Flock / 3M Reflective Vinyl',
    defaultColor: 'Single Solid Color / Metallic / Neon / Hi-Vis Silver',
    defaultFinishes: ['High-Pressure Thermal Bonding', 'Peel Finish'],
    defaultPlacement: 'Center Chest Name/Number',
    placements: ['Center Chest Name/Number', 'Lower Back Band', 'Shoulder Stripe'],
    defaultWidthMm: 220,
    defaultHeightMm: 150,
    maxPhysicalWidthMm: 400,
    maxPhysicalHeightMm: 500,
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
  },
  {
    id: 'laser_engraving',
    name: 'Laser Cutting & Engraving (Wood, Acrylic, Metal)',
    category: 'Fabrication & Engraving',
    group: 'Direct Industrial & Signage',
    defaultUnitPrice: 80.0,
    icon: '⚡',
    description: 'High-precision CO2 and fiber laser etching creating sharp permanent burnt or oxidized markings.',
    defaultStock: 'Anodized Aluminum / Cast Acrylic / Hardwood / Leather',
    defaultColor: 'Natural Etched Surface Contrast',
    defaultFinishes: ['Precision Vector Cut Edge', 'Deep Raster Engraved Relief'],
    defaultPlacement: 'Center Front Face',
    placements: ['Center Front Face', 'Center Signboard Face', 'Bottom Right Corner'],
    defaultWidthMm: 120,
    defaultHeightMm: 80,
    maxPhysicalWidthMm: 600,
    maxPhysicalHeightMm: 400,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
  },
  {
    id: 'pad_printing',
    name: 'Pad Printing (Tampo Print for Drinkware & Pens)',
    category: 'Promotional Items',
    group: 'Promotional & Commercial Print',
    defaultUnitPrice: 45.0,
    icon: '🖊️',
    description: 'Silicone pad transfer transferring sharp ink impressions onto 3D curved surfaces, pens, mugs, and dials.',
    defaultStock: 'Plastic / Metal / Glass / Ceramic / Silicone Substrates',
    defaultColor: 'Spot Pantone (1 to 4 Colors)',
    defaultFinishes: ['Solvent Cured Inks', 'Hardener Chemical Bond'],
    defaultPlacement: 'Curved Barrel / Handle Face',
    placements: ['Curved Barrel / Handle Face', 'Center Front Face'],
    defaultWidthMm: 50,
    defaultHeightMm: 25,
    maxPhysicalWidthMm: 70,
    maxPhysicalHeightMm: 40,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80',
  },
  {
    id: 'signage_acrylic_plaque',
    name: 'Signage & Standoff Wall Plaques (ACM / Cast Acrylic)',
    category: 'Signage & Display',
    group: 'Direct Industrial & Signage',
    defaultUnitPrice: 280.0,
    icon: '🪧',
    description: 'Corporate entrance plaques, wayfinding, cut-out 3D channel letters, and architectural signage.',
    defaultStock: '5mm Cast Acrylic / 3mm Brushed Aluminum ACM',
    defaultColor: 'CMYK + Reverse UV Print + Flame Polished Edges',
    defaultFinishes: ['Stainless Steel Standoff Spacers', 'Beveled Polished Edges'],
    defaultPlacement: 'Center Signboard Face',
    placements: ['Center Signboard Face', 'Center Front Face'],
    defaultWidthMm: 600,
    defaultHeightMm: 400,
    maxPhysicalWidthMm: 1200,
    maxPhysicalHeightMm: 800,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
  },
  {
    id: 'vinyl_plotter_decals',
    name: 'Vinyl Cut-Out Decals & Vehicle Graphics',
    category: 'Signage & Decals',
    group: 'Direct Industrial & Signage',
    defaultUnitPrice: 85.0,
    icon: '✂️',
    description: 'Cast or polymeric vinyl cut lettering and graphics with application transfer tape.',
    defaultStock: '5-7 Year Cast / Polymeric Adhesive Vinyl',
    defaultColor: 'Solid Gloss / Matt / Reflective / Frosted Glass',
    defaultFinishes: ['Weeded & Masked with Application Tape'],
    defaultPlacement: 'Window / Panel Center',
    placements: ['Window / Panel Center', 'Center Signboard Face', 'Full Surface Area'],
    defaultWidthMm: 400,
    defaultHeightMm: 300,
    maxPhysicalWidthMm: 1200,
    maxPhysicalHeightMm: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80',
  },
  {
    id: 'commercial_offset_print',
    name: 'Commercial Digital & Offset Litho Printing',
    category: 'Commercial Print',
    group: 'Promotional & Commercial Print',
    defaultUnitPrice: 2.5,
    icon: '📄',
    description: 'High-speed CMYK printing for brochures, flyers, catalogues, letterheads, and presentation folders.',
    defaultStock: '130gsm - 400gsm Art Paper & Velvet Board',
    defaultColor: 'CMYK 4/4 Full Color High Gamut',
    defaultFinishes: ['Matt / Gloss Laminate', 'Machine Varnish', 'Score & Fold'],
    defaultPlacement: 'Front & Back Full Bleed',
    placements: ['Front & Back Full Bleed', 'Front Cover Center', 'Inside Panel Spread'],
    defaultWidthMm: 210,
    defaultHeightMm: 297,
    maxPhysicalWidthMm: 320,
    maxPhysicalHeightMm: 450,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  },
];

// Preset branding items catalog with Accounts sync pricing
export const BRANDED_ITEMS_CATALOG = [
  {
    id: 'embroidery',
    name: 'EMBROIDERY (Custom Threadwork, Badges & Apparel)',
    category: 'Apparel & Embroidery',
    defaultUnitPrice: 85.0,
    defaultStock: 'High-Density Polyester / Metallic Thread',
    defaultColor: 'PMS Thread Matching (Up to 12 Colors)',
    defaultFinishes: ['3D Puff Embroidery', 'Heat-Seal Backing', 'Merrowed Border'],
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    placements: ['Left Chest Logo', 'Right Sleeve Bicep', 'Cap Front Panel', 'Jacket Back Center'],
    defaultPlacement: 'Left Chest Logo',
    defaultWidthMm: 90,
    defaultHeightMm: 90,
    maxPhysicalWidthMm: 250,
    maxPhysicalHeightMm: 250,
    brandingMethod: 'EMBROIDERY',
  },
  {
    id: 'textile_printing',
    name: 'TEXTILE PRINTING (Fabric & Roll-to-Roll Sublimation)',
    category: 'Textile & Apparel',
    defaultUnitPrice: 140.0,
    defaultStock: 'Poly-Cotton & Lycra Stretch Fabric',
    defaultColor: 'CMYK Roll-to-Roll Sublimation',
    defaultFinishes: ['Heat Calender Fixation', 'Hemmed Edge Finish'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
    placements: ['All Over Pattern (AOP)', 'Center Panel Focus', 'Border Running Repeat'],
    defaultPlacement: 'All Over Pattern (AOP)',
    defaultWidthMm: 1500,
    defaultHeightMm: 1000,
    maxPhysicalWidthMm: 1600,
    maxPhysicalHeightMm: 5000,
    brandingMethod: 'TEXTILE PRINTING',
  },
  {
    id: 'dtf_printing',
    name: 'DTF PRINTING (Direct To Film Transfers)',
    category: 'Apparel & Transfers',
    defaultUnitPrice: 95.0,
    defaultStock: 'PET Transfer Film + TPU Powder',
    defaultColor: 'CMYK + White Underbase High Stretch',
    defaultFinishes: ['Matt Powder Finish', 'Precision Contour Cut'],
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    placements: ['Chest Print', 'Full Back Print', 'Sleeve Accent', 'Pocket Brand Tag'],
    defaultPlacement: 'Chest Print',
    defaultWidthMm: 280,
    defaultHeightMm: 350,
    maxPhysicalWidthMm: 300,
    maxPhysicalHeightMm: 420,
    brandingMethod: 'DTF PRINTING',
  },
  {
    id: 'heat_press',
    name: 'HEAT PRESS (Vinyl & Thermal Transfers)',
    category: 'Thermal Transfers',
    defaultUnitPrice: 75.0,
    defaultStock: 'PU Thermal Transfer Vinyl',
    defaultColor: 'Flock / Metallic / Neon Single Color',
    defaultFinishes: ['High Pressure Thermal Bonding', 'Peel Finish'],
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
    placements: ['Center Chest Name/Number', 'Lower Back Band', 'Shoulder Stripe'],
    defaultPlacement: 'Center Chest Name/Number',
    defaultWidthMm: 200,
    defaultHeightMm: 150,
    maxPhysicalWidthMm: 400,
    maxPhysicalHeightMm: 500,
    brandingMethod: 'HEAT PRESS',
  },
  {
    id: 'led_uv_printing',
    name: 'LED UV FULL COLOUR PRINTING (Flatbed & Curved Direct)',
    category: 'Direct Industrial Print',
    defaultUnitPrice: 110.0,
    defaultStock: 'Rigid Substrates (Acrylic, Wood, Metal, Glass)',
    defaultColor: 'CMYK + White + Gloss Varnish',
    defaultFinishes: ['Raised 3D Varnish Texture', 'Scratch Resistant Primer'],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    placements: ['Full Surface Print', 'Centered Logo', 'Selective Spot Gloss Zone'],
    defaultPlacement: 'Full Surface Print',
    defaultWidthMm: 300,
    defaultHeightMm: 200,
    maxPhysicalWidthMm: 600,
    maxPhysicalHeightMm: 900,
    brandingMethod: 'LED UV FULL COLOUR PRINTING',
  },
  {
    id: 'business_cards',
    name: 'BUSINESS CARDS (400gsm Velvet + Foil/UV)',
    category: 'Corporate Stationery',
    defaultUnitPrice: 1.85,
    defaultStock: '400gsm Premium Velvet Artboard',
    defaultColor: 'CMYK 4/4 Double Sided',
    defaultFinishes: ['Spot UV Coating', 'Hot Copper Foil Edges', 'Round Corners'],
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    placements: ['Front Side Centered', 'Back Side Monogram', 'Edge Foiling'],
    defaultPlacement: 'Front Side Centered',
    defaultWidthMm: 90,
    defaultHeightMm: 50,
    maxPhysicalWidthMm: 90,
    maxPhysicalHeightMm: 50,
    brandingMethod: 'BUSINESS CARDS',
  },
  {
    id: 'leaflets',
    name: 'LEAFLETS & Pamphlets (A5 / A4 Folded Gloss)',
    category: 'Commercial Print',
    defaultUnitPrice: 2.20,
    defaultStock: '150gsm Gloss Art Paper',
    defaultColor: 'CMYK 4/4 Full Color',
    defaultFinishes: ['Half Fold / Z-Fold', 'Gloss Varnish'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    placements: ['Front & Back Full Bleed', 'Inside Panel Spread', 'Back Contact Block'],
    defaultPlacement: 'Front & Back Full Bleed',
    defaultWidthMm: 148,
    defaultHeightMm: 210,
    maxPhysicalWidthMm: 210,
    maxPhysicalHeightMm: 297,
    brandingMethod: 'LEAFLETS',
  },
  {
    id: 'posters',
    name: 'POSTERS (A2 / A1 / A0 High Gloss Advertising)',
    category: 'Large Format Printing',
    defaultUnitPrice: 45.0,
    defaultStock: '200gsm Premium Gloss Synthetic',
    defaultColor: 'CMYK 4/0 High Density',
    defaultFinishes: ['UV Protective Overlaminate', 'Precision Trim'],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80',
    placements: ['Full Page Area (A2)', 'Bottom Sponsor Band', 'Top Right Brand Badge'],
    defaultPlacement: 'Full Page Area (A2)',
    defaultWidthMm: 420,
    defaultHeightMm: 594,
    maxPhysicalWidthMm: 841,
    maxPhysicalHeightMm: 1189,
    brandingMethod: 'POSTERS',
  },
  {
    id: 'digital_banners',
    name: 'DIGITAL BANNERS (Heavy Duty Weatherproof PVC)',
    category: 'Large Format & Display',
    defaultUnitPrice: 220.0,
    defaultStock: '510gsm Reinforced Weatherproof PVC',
    defaultColor: 'CMYK Eco-Solvent High Resolution',
    defaultFinishes: ['Welded Hems', 'Brass Eyelets Every 500mm', 'Rope'],
    imageUrl: 'https://images.unsplash.com/photo-1588694926280-3ae414d06ccb?w=600&q=80',
    placements: ['Full Face High Impact Print', 'Centered Event Banner', 'Sponsor Logo Grid'],
    defaultPlacement: 'Full Face High Impact Print',
    defaultWidthMm: 2000,
    defaultHeightMm: 1000,
    maxPhysicalWidthMm: 3200,
    maxPhysicalHeightMm: 10000,
    brandingMethod: 'DIGITAL BANNERS',
  },
  {
    id: 'popups',
    name: 'POP-UPS (Pop-Up Banners & Exhibition Walls)',
    category: 'Exhibition & Events',
    defaultUnitPrice: 1450.0,
    defaultStock: 'Anti-Curl Film / Tension Fabric Frame',
    defaultColor: 'CMYK High Precision Display',
    defaultFinishes: ['Magnetic Hardware Frame', 'Padded Carry Case'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    placements: ['Full Front Face Wall', 'Side Endcap Branding', 'Top Header Accent'],
    defaultPlacement: 'Full Front Face Wall',
    defaultWidthMm: 3000,
    defaultHeightMm: 2250,
    maxPhysicalWidthMm: 3000,
    maxPhysicalHeightMm: 2250,
    brandingMethod: 'POP-UPS',
  },
  {
    id: 'labels',
    name: 'LABELS & Custom Stickers (Roll / Sheet Die-Cut)',
    category: 'Packaging & Labels',
    defaultUnitPrice: 1.50,
    defaultStock: 'Gloss Vinyl / Waterproof Polypropylene',
    defaultColor: 'CMYK + Metallic Foil Accent',
    defaultFinishes: ['Custom Shape Die-Cut', 'UV Gloss Lamination', 'Supplied on Rolls'],
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80',
    placements: ['Front Bottle Label', 'Product Box Seal', 'Jar Lid Circle'],
    defaultPlacement: 'Front Bottle Label',
    defaultWidthMm: 70,
    defaultHeightMm: 100,
    maxPhysicalWidthMm: 150,
    maxPhysicalHeightMm: 200,
    brandingMethod: 'LABELS',
  },
  {
    id: 'correx_boards',
    name: 'CORREX BOARDS (4mm Exterior Weatherproof)',
    category: 'Signage & Display',
    defaultUnitPrice: 180.0,
    defaultStock: '4mm Heavy-Duty Fluted Correx Board',
    defaultColor: 'CMYK Direct UV Flatbed',
    defaultFinishes: ['UV Direct Flatbed Print', 'Brass Eyelets'],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    placements: ['Full Board Center Face', 'Top Directional Header', 'Estate Agent Layout'],
    defaultPlacement: 'Full Board Center Face',
    defaultWidthMm: 600,
    defaultHeightMm: 400,
    maxPhysicalWidthMm: 1200,
    maxPhysicalHeightMm: 2400,
    brandingMethod: 'CORREX BOARDS',
  },
  {
    id: 'signboards',
    name: 'SIGNBOARDS (Chromadek & ACM Exterior Signs)',
    category: 'Architectural Signage',
    defaultUnitPrice: 650.0,
    defaultStock: '3mm Aluminum Composite Material (ACM) / Chromadek',
    defaultColor: 'CMYK Direct UV + Liquid Lamination',
    defaultFinishes: ['Anti-Graffiti Clear Laminate', 'Pre-Drilled Mounting Holes'],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    placements: ['Full Sign Face', 'Building Header Band', 'Entrance Gate Sign'],
    defaultPlacement: 'Full Sign Face',
    defaultWidthMm: 1220,
    defaultHeightMm: 2440,
    maxPhysicalWidthMm: 1500,
    maxPhysicalHeightMm: 3000,
    brandingMethod: 'SIGNBOARDS',
  },
  {
    id: 'vehicle_signage',
    name: 'VEHICLE SIGNAGE (Car Wraps & Door Magnets)',
    category: 'Automotive & Fleet',
    defaultUnitPrice: 1250.0,
    defaultStock: 'Cast Wrap Vinyl + Conformable Overlaminate',
    defaultColor: 'CMYK High Durability UV Outdoor',
    defaultFinishes: ['Cast Conformable Lamination', 'Precision Vehicle Trim'],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
    placements: ['Side Door Panels Both Sides', 'Rear Window Perforated Mesh', 'Bonnet Center Logo', 'Full Vehicle Wrap'],
    defaultPlacement: 'Side Door Panels Both Sides',
    defaultWidthMm: 1500,
    defaultHeightMm: 600,
    maxPhysicalWidthMm: 3000,
    maxPhysicalHeightMm: 1500,
    brandingMethod: 'VEHICLE SIGNAGE',
  },
  {
    id: 'vinyl_cutouts',
    name: 'VINYL CUT-OUTS (Plotter Cut Lettering & Decals)',
    category: 'Window & Wall Decals',
    defaultUnitPrice: 120.0,
    defaultStock: '5-Year Polymeric Cut Vinyl',
    defaultColor: 'Solid Color (White/Black/Frosted/Metallic)',
    defaultFinishes: ['Computerized Plotter Cutting', 'Pre-Masked Transfer Tape'],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    placements: ['Storefront Window Glass', 'Office Wall Decal', 'Vehicle Door Lettering'],
    defaultPlacement: 'Storefront Window Glass',
    defaultWidthMm: 800,
    defaultHeightMm: 400,
    maxPhysicalWidthMm: 1200,
    maxPhysicalHeightMm: 5000,
    brandingMethod: 'VINYL CUT-OUTS',
  },
  {
    id: 'laser_cutting',
    name: 'METAL, PERSPEX AND PLASTIC LASER CUTTING',
    category: 'Industrial Fabrication',
    defaultUnitPrice: 480.0,
    defaultStock: 'Stainless Steel / Perspex / Acrylic Sheets',
    defaultColor: 'Precision Fiber / CO2 Laser Engrave',
    defaultFinishes: ['Flame Polished Edges', 'Countersunk Holes', 'Deburred Edge'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    placements: ['Full Plate Precision Cutout', '3D Stand-off Signage Letters', 'Engraved Logo Badge'],
    defaultPlacement: 'Full Plate Precision Cutout',
    defaultWidthMm: 600,
    defaultHeightMm: 400,
    maxPhysicalWidthMm: 1300,
    maxPhysicalHeightMm: 2500,
    brandingMethod: 'METAL, PERSPEX AND PLASTIC LASER CUTTING',
  },
  {
    id: 'tshirts',
    name: 'T-Shirts (100% Cotton Screenprinted / DTG)',
    category: 'Apparel & Branding',
    defaultUnitPrice: 120.0,
    defaultStock: '180gsm Ring-Spun Comb Cotton',
    defaultColor: 'CMYK + White Underbase',
    defaultFinishes: ['3-Color Screen Print', 'Custom Neck Tag', 'Polybagged'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
    placements: ['Left Chest (Pocket Area)', 'Center Chest (Full Front)', 'Upper Back Neck', 'Right Sleeve (Bicep)'],
    defaultPlacement: 'Left Chest (Pocket Area)',
    defaultWidthMm: 100,
    defaultHeightMm: 100,
    maxPhysicalWidthMm: 300,
    maxPhysicalHeightMm: 400,
    brandingMethod: '3-Color Screen Printing',
  },
  {
    id: 'diaries',
    name: 'Diaries & Executive Notebooks (A5 Leatherette)',
    category: 'Stationery & Corporate',
    defaultUnitPrice: 150.0,
    defaultStock: '100gsm Cream Acid-Free Paper + Leatherette Cover',
    defaultColor: 'CMYK + Metallic Accent',
    defaultFinishes: ['Blind Debossing', 'Hot Stamped Gold Foil', 'Ribbon Marker'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    placements: ['Front Cover Center', 'Front Cover Bottom Right', 'Spine & Edge Accent'],
    defaultPlacement: 'Front Cover Center',
    defaultWidthMm: 120,
    defaultHeightMm: 60,
    maxPhysicalWidthMm: 140,
    maxPhysicalHeightMm: 200,
    brandingMethod: 'Hot Stamped Gold Foil / Debossing',
  },
  {
    id: 'mugs',
    name: 'Branded Ceramic Mugs & Drinkware',
    category: 'Promotional Gifts',
    defaultUnitPrice: 65.0,
    defaultStock: '330ml Premium Grade White Ceramic',
    defaultColor: 'Full Wrap Sublimation',
    defaultFinishes: ['Sublimation Full Wrap Print', 'Individual Gift Box'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    placements: ['Front Face (Right Handed)', 'Back Face (Left Handed)', 'Full 360° Wrap Sublimation'],
    defaultPlacement: 'Front Face (Right Handed)',
    defaultWidthMm: 80,
    defaultHeightMm: 80,
    maxPhysicalWidthMm: 200,
    maxPhysicalHeightMm: 90,
    brandingMethod: 'Full Wrap Dye Sublimation',
  },
  {
    id: 'lanyards',
    name: 'Lanyards & VIP Event Badges',
    category: 'Event Merchandise',
    defaultUnitPrice: 22.0,
    defaultStock: '20mm Smooth Satin Polyester Strap',
    defaultColor: 'Full Color Sublimation Both Sides',
    defaultFinishes: ['Safety Breakaway Clip', 'Metal Swivel Hook', 'Pouch'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    placements: ['Continuous Both Straps', 'Badge Pouch Header Card'],
    defaultPlacement: 'Continuous Both Straps',
    defaultWidthMm: 20,
    defaultHeightMm: 450,
    maxPhysicalWidthMm: 20,
    maxPhysicalHeightMm: 450,
    brandingMethod: 'Rotary Dye Sublimation',
  },
  {
    id: 'custom',
    name: '+ INSERT NEW CUSTOM ITEM / BRANDING SPEC...',
    category: 'Custom Specialty',
    defaultUnitPrice: 100.0,
    defaultStock: 'Custom Specified Material',
    defaultColor: 'CMYK 4/4',
    defaultFinishes: ['Custom Finish'],
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    placements: ['Custom Specified Location', 'Center Front Face', 'All Over Pattern'],
    defaultPlacement: 'Custom Specified Location',
    defaultWidthMm: 100,
    defaultHeightMm: 100,
    maxPhysicalWidthMm: 500,
    maxPhysicalHeightMm: 500,
    brandingMethod: 'Custom Press Method',
  },
];

export const QuotationsModule: React.FC<QuotationsModuleProps> = ({
  job,
  allJobs = [],
  onSaveJob,
  onSelectJob,
  isEditing = false,
  onSaveNotification,
  onNavigate,
}) => {
  // Current quote items & calculations state
  const [items, setItems] = useState<PrintItem[]>(job.quote.items);
  const [discountPercent, setDiscountPercent] = useState<number>(5);

  // Modals state
  const [showCreateNewQuoteModal, setShowCreateNewQuoteModal] = useState(false);
  const [showEditQuoteModal, setShowEditQuoteModal] = useState(false);
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [showPdfExportModal, setShowPdfExportModal] = useState(false);

  // Synchronize items and discount when active job changes
  useEffect(() => {
    if (job) {
      setItems(job.quote.items || []);
      setEditProjectName(job.projectName);
      setEditCompanyName(job.companyName);
      setEditCustomerName(job.customerName);
      setEditSalesRep(job.salesRep || job.quote.salesRep || 'David Miller');
    }
  }, [job.id, job.quote.items]);

  // Edit Quote Header State
  const [editProjectName, setEditProjectName] = useState(job.projectName);
  const [editCompanyName, setEditCompanyName] = useState(job.companyName);
  const [editCustomerName, setEditCustomerName] = useState(job.customerName);
  const [editSalesRep, setEditSalesRep] = useState(job.salesRep || 'David Miller');
  const [editDiscountPercent, setEditDiscountPercent] = useState(discountPercent);

  // New Quote Modal Form State
  const [newQuoteClientCompany, setNewQuoteClientCompany] = useState<string>(INITIAL_CUSTOMERS[0]?.company || 'Nexus Global Brands');
  const [newQuoteCustomCompany, setNewQuoteCustomCompany] = useState<string>('');
  const [newQuoteCustomContact, setNewQuoteCustomContact] = useState<string>('');
  const [newQuoteCustomEmail, setNewQuoteCustomEmail] = useState<string>('');
  const [newQuoteCustomPhone, setNewQuoteCustomPhone] = useState<string>('');
  const [newQuoteCustomAddress, setNewQuoteCustomAddress] = useState<string>('Sandton, Johannesburg, Gauteng 2196');
  const [newQuoteProjectName, setNewQuoteProjectName] = useState<string>('Corporate Event Branding Kit');
  const [newQuoteSalesRep, setNewQuoteSalesRep] = useState<string>('David Miller');
  const [newQuoteDiscount, setNewQuoteDiscount] = useState<number>(5);

  // New Quote initial item creation fields
  const [selectedBrandingItemId, setSelectedBrandingItemId] = useState<string>('tshirts');
  const [customItemName, setCustomItemName] = useState<string>('');
  const [selectedQuantityPreset, setSelectedQuantityPreset] = useState<string>('100');
  const [customQuantity, setCustomQuantity] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>(120.0);
  const [paperStock, setPaperStock] = useState<string>('180gsm Ring-Spun Comb Cotton');
  const [colorProfile, setColorProfile] = useState<string>('CMYK + White Underbase');
  const [finishInput, setFinishInput] = useState<string>('3-Color Screen Print, Custom Neck Tag');

  // Branding placement & physical dimension spec state
  const [brandingPlacement, setBrandingPlacement] = useState<string>('Left Chest (Pocket Area)');
  const [brandingWidthMm, setBrandingWidthMm] = useState<number>(100);
  const [brandingHeightMm, setBrandingHeightMm] = useState<number>(100);
  const [maxPhysicalWidthMm, setMaxPhysicalWidthMm] = useState<number>(300);
  const [maxPhysicalHeightMm, setMaxPhysicalHeightMm] = useState<number>(400);
  const [brandingMethod, setBrandingMethod] = useState<string>('3-Color Screen Printing');
  const [availablePlacements, setAvailablePlacements] = useState<string[]>(
    BRANDED_ITEMS_CATALOG[0].placements || ['Left Chest (Pocket Area)']
  );
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    BRANDED_ITEMS_CATALOG[0].imageUrl || ''
  );
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);

  // Multi-item builder for New Quote Modal
  const [newQuoteItems, setNewQuoteItems] = useState<PrintItem[]>([
    {
      description: 'T-Shirts (100% Cotton Screenprinted / DTG)',
      category: 'Apparel & Branding',
      quantity: 100,
      paperStock: '180gsm Ring-Spun Comb Cotton',
      colorProfile: 'CMYK + White Underbase',
      finishes: ['3-Color Screen Print', 'Custom Neck Tag', 'Polybagged'],
      unitCost: 120.0,
      totalCost: 12000.0,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
      brandingPlacement: 'Left Chest (Pocket Area)',
      brandingWidthMm: 100,
      brandingHeightMm: 100,
      maxPhysicalWidthMm: 300,
      maxPhysicalHeightMm: 400,
      brandingMethod: '3-Color Screen Printing',
    },
  ]);

  // Dynamic Catalog state supporting live addition of custom branding items
  const [catalogItems, setCatalogItems] = useState(BRANDED_ITEMS_CATALOG);
  const [newCustomCatalogName, setNewCustomCatalogName] = useState<string>('');
  const [newCustomCatalogPrice, setNewCustomCatalogPrice] = useState<number>(0);
  const [selectedBrandingMethodPreset, setSelectedBrandingMethodPreset] = useState<string>('');

  const handleSelectBrandingMethodPreset = (methodId: string) => {
    setSelectedBrandingMethodPreset(methodId);
    if (!methodId) return;
    const methodObj = BRANDING_METHODS_OPTIONS.find((m) => m.id === methodId);
    if (methodObj) {
      setNewCustomCatalogName(methodObj.name);
      setNewCustomCatalogPrice(methodObj.defaultUnitPrice);
      setPaperStock(methodObj.defaultStock);
      setColorProfile(methodObj.defaultColor);
      setFinishInput(methodObj.defaultFinishes.join(', '));
      setBrandingPlacement(methodObj.defaultPlacement);
      setBrandingWidthMm(methodObj.defaultWidthMm);
      setBrandingHeightMm(methodObj.defaultHeightMm);
      setMaxPhysicalWidthMm(methodObj.maxPhysicalWidthMm);
      setMaxPhysicalHeightMm(methodObj.maxPhysicalHeightMm);
      setBrandingMethod(methodObj.name);
      setAvailablePlacements(methodObj.placements);
      setCurrentImageUrl(methodObj.imageUrl);
      setCustomItemName(methodObj.name);
      setUnitPrice(methodObj.defaultUnitPrice);
    }
  };

  const handleInsertNewCatalogItem = () => {
    if (!newCustomCatalogName.trim()) return;
    const newId = `custom_item_${Date.now()}`;
    const matchedMethod = BRANDING_METHODS_OPTIONS.find(
      (m) => m.id === selectedBrandingMethodPreset || m.name.toLowerCase() === newCustomCatalogName.trim().toLowerCase()
    );

    const newItem = {
      id: newId,
      name: newCustomCatalogName.trim().toUpperCase(),
      category: matchedMethod ? matchedMethod.category : 'Custom Specialty',
      defaultUnitPrice: newCustomCatalogPrice > 0 ? newCustomCatalogPrice : (matchedMethod?.defaultUnitPrice || 100.0),
      defaultStock: matchedMethod ? matchedMethod.defaultStock : 'Custom Specified Material',
      defaultColor: matchedMethod ? matchedMethod.defaultColor : 'CMYK / Custom Spot',
      defaultFinishes: matchedMethod ? matchedMethod.defaultFinishes : ['Custom Finish'],
      imageUrl: matchedMethod ? matchedMethod.imageUrl : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      placements: matchedMethod ? matchedMethod.placements : ['Custom Specified Location', 'Center Front Face', 'Full Surface Area'],
      defaultPlacement: matchedMethod ? matchedMethod.defaultPlacement : 'Custom Specified Location',
      defaultWidthMm: matchedMethod ? matchedMethod.defaultWidthMm : 100,
      defaultHeightMm: matchedMethod ? matchedMethod.defaultHeightMm : 100,
      maxPhysicalWidthMm: matchedMethod ? matchedMethod.maxPhysicalWidthMm : 1000,
      maxPhysicalHeightMm: matchedMethod ? matchedMethod.maxPhysicalHeightMm : 1000,
      brandingMethod: matchedMethod ? matchedMethod.name : newCustomCatalogName.trim().toUpperCase(),
    };

    setCatalogItems((prev) => [newItem, ...prev]);
    setSelectedBrandingItemId(newId);
    setUnitPrice(newItem.defaultUnitPrice);
    setPaperStock(newItem.defaultStock);
    setColorProfile(newItem.defaultColor);
    setFinishInput(newItem.defaultFinishes.join(', '));
    setBrandingPlacement(newItem.defaultPlacement);
    setBrandingWidthMm(newItem.defaultWidthMm);
    setBrandingHeightMm(newItem.defaultHeightMm);
    setMaxPhysicalWidthMm(newItem.maxPhysicalWidthMm);
    setMaxPhysicalHeightMm(newItem.maxPhysicalHeightMm);
    setBrandingMethod(newItem.brandingMethod);
    setAvailablePlacements(newItem.placements);
    setCurrentImageUrl(newItem.imageUrl);
    setCustomItemName(newItem.name);
    setNewCustomCatalogName('');
    setNewCustomCatalogPrice(0);
    setSelectedBrandingMethodPreset('');
    onSaveNotification(`Added "${newItem.name}" to branding catalog dropdown!`);
  };

  // Quick insert branding method directly into current quotation
  const handleQuickInsertBrandingMethodToQuote = (methodId: string) => {
    if (!methodId) return;
    const methodObj = BRANDING_METHODS_OPTIONS.find((m) => m.id === methodId);
    if (!methodObj) return;
    const qty = 50;
    const unitCost = methodObj.defaultUnitPrice;
    const totalCost = unitCost * qty;

    const newItem: PrintItem = {
      description: methodObj.name,
      category: methodObj.category,
      quantity: qty,
      paperStock: methodObj.defaultStock,
      colorProfile: methodObj.defaultColor,
      finishes: methodObj.defaultFinishes,
      unitCost: unitCost,
      totalCost: totalCost,
      imageUrl: methodObj.imageUrl,
      brandingPlacement: methodObj.defaultPlacement,
      brandingWidthMm: methodObj.defaultWidthMm,
      brandingHeightMm: methodObj.defaultHeightMm,
      maxPhysicalWidthMm: methodObj.maxPhysicalWidthMm,
      maxPhysicalHeightMm: methodObj.maxPhysicalHeightMm,
      brandingMethod: methodObj.name,
    };

    setItems((prev) => [...prev, newItem]);
    onSaveNotification(`Added "${methodObj.name}" to quotation!`);
  };

  // Cost calculation formulas for active quote
  const rawSubtotal = items.reduce((acc, item) => acc + item.totalCost, 0);
  const discountVal = (rawSubtotal * discountPercent) / 100;
  const taxable = rawSubtotal - discountVal;
  const vatTax = taxable * 0.15; // 15% ZAR VAT
  const grandTotal = taxable + vatTax;

  // Handle Catalog Item Dropdown Change
  const handleBrandingItemChange = (itemId: string) => {
    setSelectedBrandingItemId(itemId);
    const catalogItem =
      catalogItems.find((i) => i.id === itemId) ||
      BRANDED_ITEMS_CATALOG.find((i) => i.id === itemId);
    if (catalogItem) {
      setUnitPrice(catalogItem.defaultUnitPrice);
      setPaperStock(catalogItem.defaultStock);
      setColorProfile(catalogItem.defaultColor);
      setFinishInput(catalogItem.defaultFinishes.join(', '));
      setBrandingPlacement(catalogItem.defaultPlacement);
      setBrandingWidthMm(catalogItem.defaultWidthMm);
      setBrandingHeightMm(catalogItem.defaultHeightMm);
      setMaxPhysicalWidthMm(catalogItem.maxPhysicalWidthMm);
      setMaxPhysicalHeightMm(catalogItem.maxPhysicalHeightMm);
      setBrandingMethod(catalogItem.brandingMethod);
      setAvailablePlacements(catalogItem.placements);
      setCurrentImageUrl(catalogItem.imageUrl);
      if (itemId === 'custom') {
        setCustomItemName('Custom Branded Corporate Merchandise');
      }
    }
  };

  // Handle Quantity Change
  const handleQuantityPresetChange = (qVal: string) => {
    setSelectedQuantityPreset(qVal);
    if (qVal !== 'custom') {
      setCustomQuantity(parseInt(qVal, 10));
    }
  };

  const currentEffectiveQty =
    selectedQuantityPreset === 'custom'
      ? customQuantity
      : parseInt(selectedQuantityPreset, 10) || 1;
  const calculatedLineTotal = currentEffectiveQty * unitPrice;

  // Add Item to existing quote
  const handleAddCustomQuotationItem = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogItem = catalogItems.find((i) => i.id === selectedBrandingItemId) || BRANDED_ITEMS_CATALOG.find((i) => i.id === selectedBrandingItemId);
    const itemTitle =
      selectedBrandingItemId === 'custom'
        ? customItemName || 'Custom Branded Item'
        : catalogItem?.name || 'Branded Item';

    const finishesArray = finishInput
      ? finishInput.split(',').map((f) => f.trim()).filter(Boolean)
      : ['Standard Finish'];

    const newItem: PrintItem = {
      description: itemTitle,
      category: catalogItem?.category || 'Branding & Press',
      quantity: currentEffectiveQty,
      paperStock: paperStock || 'Standard Stock',
      colorProfile: colorProfile || 'CMYK 4/0',
      finishes: finishesArray,
      unitCost: unitPrice,
      totalCost: calculatedLineTotal,
      imageUrl: currentImageUrl || catalogItem?.imageUrl,
      brandingPlacement: brandingPlacement,
      brandingWidthMm: brandingWidthMm,
      brandingHeightMm: brandingHeightMm,
      maxPhysicalWidthMm: maxPhysicalWidthMm,
      maxPhysicalHeightMm: maxPhysicalHeightMm,
      brandingMethod: brandingMethod,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    const updatedSub = updatedItems.reduce((acc, it) => acc + it.totalCost, 0);
    const updatedJob: Job = {
      ...job,
      quote: {
        ...job.quote,
        items: updatedItems,
        subtotal: updatedSub,
        totalAmount: (updatedSub * (1 - discountPercent / 100)) * 1.15,
      },
    };

    if (onSaveJob) onSaveJob(updatedJob);
    onSaveNotification(
      `Added "${itemTitle}" (${currentEffectiveQty} units @ R${unitPrice}/ea) to Quotation #${job.quote.quoteNumber}`
    );
    setShowAddFormModal(false);
  };

  // Add Item inside New Quote Creation Modal
  const handleAddItemToNewQuoteModal = () => {
    const catalogItem = catalogItems.find((i) => i.id === selectedBrandingItemId) || BRANDED_ITEMS_CATALOG.find((i) => i.id === selectedBrandingItemId);
    const itemTitle =
      selectedBrandingItemId === 'custom'
        ? customItemName || 'Custom Branded Item'
        : catalogItem?.name || 'Branded Item';

    const finishesArray = finishInput
      ? finishInput.split(',').map((f) => f.trim()).filter(Boolean)
      : ['Standard Finish'];

    const newItem: PrintItem = {
      description: itemTitle,
      category: catalogItem?.category || 'Branding & Press',
      quantity: currentEffectiveQty,
      paperStock: paperStock || 'Standard Stock',
      colorProfile: colorProfile || 'CMYK 4/0',
      finishes: finishesArray,
      unitCost: unitPrice,
      totalCost: calculatedLineTotal,
      imageUrl: currentImageUrl || catalogItem?.imageUrl,
      brandingPlacement: brandingPlacement,
      brandingWidthMm: brandingWidthMm,
      brandingHeightMm: brandingHeightMm,
      maxPhysicalWidthMm: maxPhysicalWidthMm,
      maxPhysicalHeightMm: maxPhysicalHeightMm,
      brandingMethod: brandingMethod,
    };

    setNewQuoteItems((prev) => [...prev, newItem]);
  };

  const removeNewQuoteModalItem = (idx: number) => {
    setNewQuoteItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeItemFromCurrentQuote = (idx: number) => {
    const updatedItems = items.filter((_, i) => i !== idx);
    setItems(updatedItems);
    const updatedSub = updatedItems.reduce((acc, it) => acc + it.totalCost, 0);

    const updatedJob: Job = {
      ...job,
      quote: {
        ...job.quote,
        items: updatedItems,
        subtotal: updatedSub,
        totalAmount: (updatedSub * (1 - discountPercent / 100)) * 1.15,
      },
    };

    if (onSaveJob) onSaveJob(updatedJob);
    onSaveNotification('Removed line item from quotation');
  };

  // CREATE AND SAVE NEW QUOTE FACILITY
  const handleCreateNewQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCustomerObj = INITIAL_CUSTOMERS.find((c) => c.company === newQuoteClientCompany);
    const clientCompany =
      newQuoteClientCompany === 'NEW'
        ? newQuoteCustomCompany || 'New Corporate Client'
        : newQuoteClientCompany;
    const clientContact =
      newQuoteClientCompany === 'NEW'
        ? newQuoteCustomContact || 'Procurement Officer'
        : selectedCustomerObj?.name || 'Procurement Manager';
    const clientAddress =
      newQuoteClientCompany === 'NEW'
        ? newQuoteCustomAddress || 'Sandton, Johannesburg, Gauteng 2196'
        : selectedCustomerObj?.address || 'Sandton, Johannesburg, Gauteng 2196';

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newJobId = `JOB-${Date.now()}`;
    const newJobNumber = `BF-${randNum}`;
    const newQuoteNumber = `QT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const itemsToSave =
      newQuoteItems.length > 0
        ? newQuoteItems
        : [
            {
              description: 'T-Shirts (100% Cotton Screenprinted / DTG)',
              category: 'Apparel & Branding',
              quantity: 100,
              paperStock: '180gsm Ring-Spun Comb Cotton',
              colorProfile: 'CMYK + White Underbase',
              finishes: ['3-Color Screen Print', 'Custom Neck Tag'],
              unitCost: 120.0,
              totalCost: 12000.0,
            },
          ];

    const rawSub = itemsToSave.reduce((acc, it) => acc + it.totalCost, 0);
    const discAmt = (rawSub * newQuoteDiscount) / 100;
    const tax = rawSub - discAmt;
    const vat = tax * 0.15;
    const grand = tax + vat;

    const newJob: Job = {
      id: newJobId,
      jobNumber: newJobNumber,
      companyName: clientCompany,
      customerName: clientContact,
      projectName: newQuoteProjectName || 'Corporate Branding Project',
      category: itemsToSave[0]?.category || 'Branding & Press',
      quantity: itemsToSave.reduce((acc, it) => acc + it.quantity, 0),
      totalValue: grand,
      stage: 'Quotation',
      priority: 'Normal',
      dateCreated: '2026-07-22',
      deadline: '2026-08-25',
      assignedDesigner: 'Unassigned',
      artworkVersions: [],
      quote: {
        id: `Q-${randNum}`,
        quoteNumber: newQuoteNumber,
        customerId: selectedCustomerObj?.id || 'CUST-001',
        customerName: clientContact,
        projectName: newQuoteProjectName || 'Corporate Branding Project',
        dateCreated: '2026-07-22',
        validUntil: '2026-08-21',
        salesRep: newQuoteSalesRep || 'David Miller',
        items: itemsToSave,
        discountAmount: discAmt,
        vatTax: vat,
        subtotal: rawSub,
        totalAmount: grand,
        marginPercent: 35,
        status: 'Sent to Client',
        notes: 'Commercial print estimate',
      },
      invoice: {
        id: `INV-${randNum}`,
        invoiceNumber: `INV-2026-${randNum}`,
        jobId: newJobId,
        customerName: clientCompany,
        issueDate: '2026-07-22',
        dueDate: '2026-08-21',
        amount: grand,
        paidAmount: 0,
        status: 'Unpaid',
        syncedToSage: true,
        syncedToXero: true,
        syncedToQuickbooks: true,
      },
      dispatch: {
        id: `DSP-${randNum}`,
        dispatchNumber: `DN-2026-${randNum}`,
        jobId: newJobId,
        customerName: clientCompany,
        courierName: 'Courier Guy Express',
        trackingNumber: `TCG-ZA-${randNum}`,
        boxCount: 2,
        weightKg: 10,
        dispatchDate: '2026-08-25',
        estimatedDelivery: '2026-08-27',
        shippingAddress: clientAddress,
        status: 'Preparing Boxes',
      },
    };

    if (onSaveJob) onSaveJob(newJob);
    if (onSelectJob) onSelectJob(newJob);

    onSaveNotification(
      `New Quotation #${newQuoteNumber} saved successfully for ${clientCompany}!`
    );
    setShowCreateNewQuoteModal(false);
  };

  // EDIT AND SAVE ACTIVE QUOTE FACILITY
  const handleSaveQuoteEdits = (e: React.FormEvent) => {
    e.preventDefault();

    const rawSub = items.reduce((acc, it) => acc + it.totalCost, 0);
    const discAmt = (rawSub * editDiscountPercent) / 100;
    const tax = rawSub - discAmt;
    const vat = tax * 0.15;
    const grand = tax + vat;

    setDiscountPercent(editDiscountPercent);

    const updatedJob: Job = {
      ...job,
      companyName: editCompanyName || job.companyName,
      customerName: editCustomerName || job.customerName,
      projectName: editProjectName || job.projectName,
      totalValue: grand,
      quote: {
        ...job.quote,
        salesRep: editSalesRep || job.quote.salesRep || 'David Miller',
        items: items,
        discountAmount: discAmt,
        vatTax: vat,
        subtotal: rawSub,
        totalAmount: grand,
      },
      invoice: job.invoice
        ? {
            ...job.invoice,
            amount: grand,
          }
        : undefined,
    };

    if (onSaveJob) onSaveJob(updatedJob);
    onSaveNotification(`Quotation #${job.quote.quoteNumber} updated and saved successfully!`);
    setShowEditQuoteModal(false);
  };

  // PRINT QUOTE FACILITY
  const handleTriggerPrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    onSaveNotification(`Generated PDF document preview for Quotation #${job.quote.quoteNumber}`);
    setShowPdfExportModal(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-slate-800 bg-transparent min-h-full">
      {/* Top Banner & Primary Action Toolbar */}
      <div className="mirror-card p-4 sm:p-5 rounded-2xl shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Estimating Engine — Quote #{job.quote.quoteNumber}</span>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-bold text-[10px]">
              {job.quote.status || 'Active'}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">{job.projectName}</h2>
          <div className="text-xs text-slate-500 flex items-center space-x-1.5 flex-wrap mt-0.5">
            <span>Client: <strong className="text-slate-800">{job.companyName}</strong> ({job.customerName})</span>
            <span className="text-slate-300">•</span>
            <EmailLink
              email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
              subject={`Quotation #${job.quote.quoteNumber} - ${job.projectName}`}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
              showIcon
            />
            <span className="text-slate-300">•</span>
            <span>Rep: <strong className="text-indigo-700 font-bold">{job.quote.salesRep || job.salesRep}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Active Quote Switcher Dropdown */}
          {allJobs.length > 0 && (
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
              <span className="text-slate-400 font-medium text-[11px]">Select Quote:</span>
              <select
                value={job.id}
                onChange={(e) => {
                  const targetJob = allJobs.find((j) => j.id === e.target.value);
                  if (targetJob && onSelectJob) onSelectJob(targetJob);
                }}
                className="bg-transparent font-bold text-indigo-600 outline-hidden cursor-pointer text-xs"
              >
                {allJobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-white text-slate-800">
                    #{j.quote.quoteNumber} — {j.companyName} ({j.projectName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PRIMARY BUTTON: ADD NEW QUOTE */}
          <button
            onClick={() => setShowCreateNewQuoteModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all border border-white/40"
            title="Create a new quote from scratch for a new or existing client"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Create New Quote</span>
          </button>

          {/* EDIT QUOTE DETAILS BUTTON */}
          <button
            onClick={() => {
              setEditProjectName(job.projectName);
              setEditCompanyName(job.companyName);
              setEditCustomerName(job.customerName);
              setEditSalesRep(job.salesRep || job.quote.salesRep || 'David Miller');
              setEditDiscountPercent(discountPercent);
              setShowEditQuoteModal(true);
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Edit quote client, title, discount rate, and line items"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Edit Quote</span>
          </button>

          {/* PRINT QUOTE BUTTON */}
          <button
            onClick={handleTriggerPrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Print formal quotation document"
          >
            <Printer className="w-4 h-4 text-zinc-950" />
            <span>Print Quote</span>
          </button>

          {/* EXPORT AS PDF BUTTON */}
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
            title="Export official PDF document preview"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => onNavigate('ClientQuote')}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>View Formal View</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Breakdown Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Items Table & Specifications */}
        <div className="lg:col-span-8 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase text-zinc-300 tracking-wider">
                Production Line Item Breakdown & Specs
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddFormModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1 cursor-pointer shadow-sm border border-amber-300/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-950" />
                <span>Configure Custom Item</span>
              </button>
            </div>
          </div>

          {/* Quick Branding Method Quick-Add Dropdown Bar */}
          <div className="p-3 bg-zinc-950/90 border border-zinc-800 rounded-lg space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <span className="font-extrabold text-amber-300 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>QUICK ADD BRANDING METHOD DROPDOWN:</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold">
                Instant 1-Click Insertion into Quote
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-8">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleQuickInsertBrandingMethodToQuote(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg font-bold text-zinc-100 text-xs focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="">⚡ Select Branding Method to Add (DTF, Embroidery, Silk Screen, Foiling, Embossing...)</option>
                  <optgroup label="🔥 Apparel & Fabric Transfers" className="bg-zinc-900 text-zinc-200">
                    <option value="dtf_printing">🎨 DTF (Direct To Film Transfers) — R95.00/ea</option>
                    <option value="silk_screen_printing">🖨️ Silk Screening / Screen Printing — R75.00/ea</option>
                    <option value="heat_press_vinyl">🔥 Heat Press Vinyl & Thermal Transfers — R75.00/ea</option>
                    <option value="sublimation_textile">🎽 Dye Sublimation & Roll-to-Roll — R140.00/ea</option>
                  </optgroup>
                  <optgroup label="🪡 Threadwork & Embroidery" className="bg-zinc-900 text-zinc-200">
                    <option value="embroidery_flat">🪡 Embroidery (Flat Stitch & Badges) — R85.00/ea</option>
                    <option value="embroidery_3d_puff">🧵 3D Puff Raised Embroidery — R115.00/ea</option>
                  </optgroup>
                  <optgroup label="✨ Specialty Dies & Luxury Finishes" className="bg-zinc-900 text-zinc-200">
                    <option value="hot_foil_stamping">✨ Hot Stamped Foiling (Gold/Silver) — R65.00/ea</option>
                    <option value="embossing">🏷️ Embossing (Raised 3D Blind/Foil Relief) — R70.00/ea</option>
                    <option value="debossing">🔲 Debossing (Recessed Stamped Imprint) — R70.00/ea</option>
                  </optgroup>
                  <optgroup label="💎 Direct Industrial & Signage" className="bg-zinc-900 text-zinc-200">
                    <option value="uv_flatbed_printing">💎 LED UV Full Colour Printing (Flatbed) — R110.00/ea</option>
                    <option value="laser_engraving">⚡ Laser Cutting & Engraving — R80.00/ea</option>
                    <option value="signage_acrylic_plaque">🪧 Signboards & Acrylic Standoff Plaques — R280.00/ea</option>
                    <option value="vinyl_plotter_decals">✂️ Vinyl Cut-Out Decals & Lettering — R85.00/ea</option>
                  </optgroup>
                  <optgroup label="🖊️ Promotional & Commercial Print" className="bg-zinc-900 text-zinc-200">
                    <option value="pad_printing">🖊️ Pad Printing (Drinkware & Pens) — R45.00/ea</option>
                    <option value="commercial_offset_print">📄 Commercial Digital & Offset Litho — R2.50/ea</option>
                  </optgroup>
                </select>
              </div>

              <div className="sm:col-span-4 flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddFormModal(true)}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-lg font-extrabold text-xs flex items-center justify-center space-x-1 border border-zinc-700 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Mockup Form</span>
                </button>
              </div>
            </div>

            {/* Quick-add chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-zinc-400">Quick Add:</span>
              {[
                { id: 'dtf_printing', label: '🎨 DTF' },
                { id: 'embroidery_flat', label: '🪡 Embroidery' },
                { id: 'silk_screen_printing', label: '🖨️ Silk Screen' },
                { id: 'hot_foil_stamping', label: '✨ Foiling' },
                { id: 'embossing', label: '🏷️ Embossing' },
                { id: 'debossing', label: '🔲 Debossing' },
                { id: 'uv_flatbed_printing', label: '💎 UV Print' },
                { id: 'laser_engraving', label: '⚡ Laser' },
                { id: 'signage_acrylic_plaque', label: '🪧 Signage' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleQuickInsertBrandingMethodToQuote(chip.id)}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/40 text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const exceedsWidth =
                item.brandingWidthMm && item.maxPhysicalWidthMm && item.brandingWidthMm > item.maxPhysicalWidthMm;
              const exceedsHeight =
                item.brandingHeightMm && item.maxPhysicalHeightMm && item.brandingHeightMm > item.maxPhysicalHeightMm;
              const isOverLimit = exceedsWidth || exceedsHeight;

              return (
                <div
                  key={idx}
                  className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-3 text-xs hover:border-zinc-700 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start space-x-3">
                      {item.imageUrl ? (
                        <div className="w-16 h-16 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-900 shadow-xs shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.description}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 font-bold text-xs">
                          <Tag className="w-5 h-5 text-amber-400" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="text-zinc-100 font-extrabold text-sm flex items-center space-x-2">
                          <span>{item.description}</span>
                          {item.category && (
                            <span className="text-[10px] bg-zinc-800 text-zinc-300 font-semibold px-2 py-0.5 rounded-full border border-zinc-700">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Branding Placement & Machine Limits Metadata */}
                        {(item.brandingPlacement || item.brandingWidthMm) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-0.5">
                            {item.brandingPlacement && (
                              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 font-bold rounded border border-amber-500/30 flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-amber-400 inline" />
                                <span>{item.brandingPlacement}</span>
                              </span>
                            )}

                            {item.brandingWidthMm && item.brandingHeightMm && (
                              <span className="px-2 py-0.5 bg-zinc-800 text-amber-300 font-bold font-mono rounded border border-zinc-700 flex items-center space-x-1">
                                <Ruler className="w-3 h-3 text-amber-400 inline" />
                                <span>
                                  {item.brandingWidthMm}×{item.brandingHeightMm} mm
                                </span>
                              </span>
                            )}

                            {item.maxPhysicalWidthMm && item.maxPhysicalHeightMm && (
                              <span
                                className={`px-2 py-0.5 font-bold rounded border flex items-center space-x-1 text-[10px] ${
                                  isOverLimit
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                }`}
                              >
                                {isOverLimit ? (
                                  <>
                                    <ShieldAlert className="w-3 h-3 text-rose-400 inline" />
                                    <span>Exceeds Machine Max ({item.maxPhysicalWidthMm}×{item.maxPhysicalHeightMm}mm)</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                                    <span>Fits Machine ({item.maxPhysicalWidthMm}×{item.maxPhysicalHeightMm}mm)</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex(activePreviewIndex === idx ? null : idx)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-colors cursor-pointer ${
                          activePreviewIndex === idx
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-400 font-black'
                            : 'bg-zinc-800/80 text-amber-300 border-zinc-700 hover:bg-zinc-800'
                        }`}
                        title="Toggle branding placement visualizer and physical limits inspector"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{activePreviewIndex === idx ? 'Hide Preview' : 'Branding Mockup'}</span>
                      </button>

                      <button
                        onClick={() => removeItemFromCurrentQuote(idx)}
                        className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-zinc-800"
                        title="Delete item from quote"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
                    <div>
                      <span className="text-zinc-500 block">Stock / Material:</span>
                      <span className="font-semibold text-zinc-200">{item.paperStock}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Color Mode:</span>
                      <span className="font-semibold text-zinc-200">{item.colorProfile}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Quantity Run:</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {item.quantity.toLocaleString()} units
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Line Total:</span>
                      <span className="font-extrabold text-zinc-100 font-mono">
                        R {item.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {item.finishes.map((f, fi) => (
                      <span
                        key={fi}
                        className="px-2 py-0.5 bg-zinc-800 text-amber-300 rounded text-[10px] font-semibold border border-zinc-700"
                      >
                        + {f}
                      </span>
                    ))}
                  </div>

                  {/* Inline Branding Visualizer Drawer */}
                  {activePreviewIndex === idx && (
                    <div className="pt-2 animate-fadeIn">
                      <BrandingPreviewCanvas
                        productName={item.description}
                        imageUrl={item.imageUrl}
                        brandingPlacement={item.brandingPlacement}
                        brandingWidthMm={item.brandingWidthMm}
                        brandingHeightMm={item.brandingHeightMm}
                        maxPhysicalWidthMm={item.maxPhysicalWidthMm}
                        maxPhysicalHeightMm={item.maxPhysicalHeightMm}
                        brandingMethod={item.brandingMethod}
                        interactive={true}
                        onUpdatePlacement={(newPlacement, newW, newH, newMethod) => {
                          const updated = [...items];
                          updated[idx] = {
                            ...updated[idx],
                            brandingPlacement: newPlacement,
                            brandingWidthMm: newW,
                            brandingHeightMm: newH,
                            brandingMethod: newMethod || updated[idx].brandingMethod,
                          };
                          setItems(updated);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="p-8 text-center bg-zinc-950/60 border border-dashed border-zinc-800 rounded-xl space-y-2">
                <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs font-bold text-zinc-400">No line items added to this quotation yet.</p>
                <button
                  onClick={() => setShowAddFormModal(true)}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs rounded-lg cursor-pointer shadow-md"
                >
                  Add First Branding Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cost Summary & Save/Print Actions */}
        <div className="lg:col-span-4 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3">
              <h3 className="text-xs font-bold uppercase text-zinc-300">
                Financial Summary & VAT Breakdown
              </h3>
              <button
                onClick={() => {
                  setEditProjectName(job.projectName);
                  setEditCompanyName(job.companyName);
                  setEditCustomerName(job.customerName);
                  setEditSalesRep(job.salesRep || job.quote.salesRep || 'David Miller');
                  setEditDiscountPercent(discountPercent);
                  setShowEditQuoteModal(true);
                }}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Financials</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-zinc-400">
                <span>Production Subtotal:</span>
                <span className="font-mono text-zinc-100 font-bold">
                  R {rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Contract Discount ({discountPercent}%):</span>
                <span className="font-mono text-rose-400 font-bold">
                  -R {discountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Taxable Amount:</span>
                <span className="font-mono text-zinc-100 font-bold">
                  R {taxable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>VAT / Sales Tax (15% ZAR):</span>
                <span className="font-mono text-zinc-100 font-bold">
                  R {vatTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-zinc-700/80 pt-2 flex justify-between items-center text-sm font-black text-zinc-100">
                <span>Grand Total:</span>
                <span className="font-mono text-amber-400 text-base font-black">
                  R {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-zinc-950/80 border border-emerald-500/30 rounded-lg text-xs space-y-1">
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>Accounts Sync Status</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded border border-emerald-500/40">
                  LIVE IN SYNC
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Quotations automatically mirror in Client Approvals, Accounts Ledger, and Invoicing.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowCreateNewQuoteModal(true)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black shadow-md shadow-amber-500/20 cursor-pointer flex justify-center items-center space-x-1.5 transition-all border border-amber-300/30"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>+ Create New Quotation</span>
            </button>

            <button
              onClick={handleTriggerPrint}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg text-xs font-bold shadow-xs cursor-pointer flex justify-center items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-zinc-950" />
              <span>Print Official Quote</span>
            </button>

            <button
              onClick={() => {
                onSaveNotification(`Quotation #${job.quote.quoteNumber} saved and locked for client review.`);
                onNavigate('ClientQuote');
              }}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-bold shadow-xs cursor-pointer flex justify-center items-center space-x-1"
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>Send Quotation to Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. CREATE NEW QUOTE MODAL */}
      {showCreateNewQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden font-sans my-8">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-800 rounded-lg text-white">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Create New Print Quotation</h3>
                  <p className="text-[11px] text-blue-200">
                    Configure client details, project specifications, and line items with automatic tax calculation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateNewQuoteModal(false)}
                className="p-1.5 text-blue-300 hover:text-white hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewQuoteSubmit} className="p-6 space-y-4 text-xs">
              {/* Client Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Select Client Account <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newQuoteClientCompany}
                    onChange={(e) => setNewQuoteClientCompany(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-900"
                  >
                    {INITIAL_CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.company}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                    <option value="NEW">+ Add New Client Account...</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Project / Quote Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newQuoteProjectName}
                    onChange={(e) => setNewQuoteProjectName(e.target.value)}
                    placeholder="e.g. Annual Report & Executive Merchandise"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Custom New Client fields if NEW selected */}
              {newQuoteClientCompany === 'NEW' && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <div className="font-bold text-blue-900 text-xs">New Client Contact Details</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={newQuoteCustomCompany}
                        onChange={(e) => setNewQuoteCustomCompany(e.target.value)}
                        placeholder="e.g. Acme Enterprise SA"
                        className="w-full p-2 bg-white border border-slate-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={newQuoteCustomContact}
                        onChange={(e) => setNewQuoteCustomContact(e.target.value)}
                        placeholder="e.g. Jane Doe (Marketing Director)"
                        className="w-full p-2 bg-white border border-slate-300 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sales Rep & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sales Specialist / Account Manager</label>
                  <input
                    type="text"
                    value={newQuoteSalesRep}
                    onChange={(e) => setNewQuoteSalesRep(e.target.value)}
                    placeholder="e.g. David Miller"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commercial Discount %</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={newQuoteDiscount}
                      onChange={(e) => setNewQuoteDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900"
                    />
                    <span className="absolute right-3 top-2 font-bold text-slate-500">%</span>
                  </div>
                </div>
              </div>

              {/* Line Items Builder Section inside Modal */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center font-bold text-slate-800 border-b border-slate-200 pb-2">
                  <span>Add Line Items To Quote</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {newQuoteItems.length} items configured
                  </span>
                </div>

                {/* List of items added so far */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {newQuoteItems.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-white border border-slate-200 rounded text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{it.description}</span>
                        <span className="text-slate-500 ml-2">
                          ({it.quantity} units @ R{it.unitCost}/ea)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 font-mono">
                          R {it.totalCost.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNewQuoteModalItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new item control box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex justify-between items-center">
                      <span>Branding Product Catalog</span>
                      <span className="text-[10px] text-blue-900 bg-blue-100 font-bold px-1.5 py-0.5 rounded">{catalogItems.length} Items</span>
                    </label>
                    <select
                      value={selectedBrandingItemId}
                      onChange={(e) => handleBrandingItemChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-semibold text-slate-800 text-xs"
                    >
                      {catalogItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — (Est. R{item.defaultUnitPrice.toFixed(2)}/ea)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                    <select
                      value={selectedQuantityPreset}
                      onChange={(e) => handleQuantityPresetChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-slate-900 text-xs"
                    >
                      <option value="25">25 units</option>
                      <option value="50">50 units</option>
                      <option value="100">100 units</option>
                      <option value="250">250 units</option>
                      <option value="500">500 units</option>
                      <option value="1000">1,000 units</option>
                      <option value="2500">2,500 units</option>
                    </select>
                  </div>
                </div>

                {/* Line to insert new custom item directly into catalog */}
                <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 p-3 rounded-lg border border-blue-200 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1 font-extrabold text-blue-950">
                    <span className="flex items-center space-x-1.5">
                      <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
                      <span>BRANDING METHOD & CATALOG INSERT:</span>
                    </span>
                    <span className="text-[10px] text-blue-800 bg-blue-100 font-bold px-2 py-0.5 rounded">
                      Select Technique or Custom
                    </span>
                  </div>

                  {/* Dropdown of Branding Methods */}
                  <div className="space-y-1.5">
                    <select
                      value={selectedBrandingMethodPreset}
                      onChange={(e) => handleSelectBrandingMethodPreset(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-300 rounded font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-700"
                    >
                      <option value="">⚡ Select Branding Method Preset (DTF, Embroidery, Foiling...)</option>
                      <optgroup label="🔥 Apparel & Fabric Transfers">
                        <option value="dtf_printing">🎨 DTF (Direct To Film Transfers) — Est. R95.00</option>
                        <option value="silk_screen_printing">🖨️ Silk Screening / Screen Printing — Est. R75.00</option>
                        <option value="heat_press_vinyl">🔥 Heat Press Vinyl & Transfers — Est. R75.00</option>
                        <option value="sublimation_textile">🎽 Dye Sublimation & Roll-to-Roll — Est. R140.00</option>
                      </optgroup>
                      <optgroup label="🪡 Threadwork & Embroidery">
                        <option value="embroidery_flat">🪡 Embroidery (Flat Stitch & Badges) — Est. R85.00</option>
                        <option value="embroidery_3d_puff">🧵 3D Puff Embroidery (Raised) — Est. R115.00</option>
                      </optgroup>
                      <optgroup label="✨ Specialty Dies & Luxury Finishes">
                        <option value="hot_foil_stamping">✨ Hot Stamped Foiling (Gold/Silver) — Est. R65.00</option>
                        <option value="embossing">🏷️ Embossing (Raised 3D Blind/Foil Relief) — Est. R70.00</option>
                        <option value="debossing">🔲 Debossing (Recessed Stamped Imprint) — Est. R70.00</option>
                      </optgroup>
                      <optgroup label="💎 Direct Industrial & Signage">
                        <option value="uv_flatbed_printing">💎 LED UV Full Colour Printing — Est. R110.00</option>
                        <option value="laser_engraving">⚡ Laser Cutting & Engraving — Est. R80.00</option>
                        <option value="signage_acrylic_plaque">🪧 Signboards & Acrylic Plaques — Est. R280.00</option>
                        <option value="vinyl_plotter_decals">✂️ Vinyl Cut-Out Decals — Est. R85.00</option>
                      </optgroup>
                      <optgroup label="🖊️ Promotional & Commercial Print">
                        <option value="pad_printing">🖊️ Pad Printing (Drinkware & Pens) — Est. R45.00</option>
                        <option value="commercial_offset_print">📄 Commercial Digital & Offset Litho — Est. R2.50</option>
                      </optgroup>
                    </select>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Item Title (e.g. DTF HOODIES, EMBROIDERED CAPS, SIGNBOARDS)..."
                        value={newCustomCatalogName}
                        onChange={(e) => setNewCustomCatalogName(e.target.value)}
                        className="flex-1 p-2 bg-white border border-blue-300 rounded font-semibold text-slate-900 text-xs focus:ring-1 focus:ring-blue-800"
                      />
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-2 font-bold text-slate-400 text-xs">R</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={newCustomCatalogPrice || ''}
                          onChange={(e) => setNewCustomCatalogPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-2 bg-white border border-blue-300 rounded font-mono font-bold text-slate-900 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleInsertNewCatalogItem}
                        className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center space-x-1 whitespace-nowrap cursor-pointer transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insert</span>
                      </button>
                    </div>

                    {/* Quick Pick Buttons */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-extrabold text-blue-900 uppercase">Quick Pick:</span>
                      {[
                        { id: 'dtf_printing', label: 'DTF' },
                        { id: 'embroidery_flat', label: 'Embroidery' },
                        { id: 'silk_screen_printing', label: 'Silk Screen' },
                        { id: 'hot_foil_stamping', label: 'Foiling' },
                        { id: 'embossing', label: 'Embossing' },
                        { id: 'debossing', label: 'Debossing' },
                        { id: 'uv_flatbed_printing', label: 'UV Print' },
                        { id: 'laser_engraving', label: 'Laser' },
                        { id: 'signage_acrylic_plaque', label: 'Signage' },
                        { id: 'heat_press_vinyl', label: 'Heat Press' },
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => handleSelectBrandingMethodPreset(pill.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            selectedBrandingMethodPreset === pill.id
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-white text-blue-950 border-blue-200 hover:border-blue-400'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItemToNewQuoteModal}
                  className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item to Quote List</span>
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateNewQuoteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-extrabold shadow-md flex items-center space-x-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Generate Quote</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT ACTIVE QUOTE MODAL */}
      {showEditQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden font-sans my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-800 rounded-lg text-white">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Edit Quotation #{job.quote.quoteNumber}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Update quote metadata, client details, sales rep, and discount parameters.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditQuoteModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuoteEdits} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Project Name / Title</label>
                  <input
                    type="text"
                    value={editProjectName}
                    onChange={(e) => setEditProjectName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Client Company Name</label>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Sales Specialist</label>
                  <input
                    type="text"
                    value={editSalesRep}
                    onChange={(e) => setEditSalesRep(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Discount Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editDiscountPercent}
                  onChange={(e) => setEditDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                <span className="font-bold block">Live Recalculation Note:</span>
                Saving edits will automatically update the taxable subtotal, 15% ZAR VAT, and total invoice balance across all modules.
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditQuoteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-extrabold shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Quotation Edits</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD LINE ITEM TO CURRENT QUOTE FORM MODAL */}
      {showAddFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden font-sans my-8">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-800 rounded-lg text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Add Branding Item to Quote</h3>
                  <p className="text-[11px] text-blue-200">
                    Configure quantities, stock, and pricing for this quotation line item.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddFormModal(false)}
                className="p-1.5 text-blue-300 hover:text-white hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomQuotationItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-slate-800 mb-1 flex justify-between items-center">
                  <span>Select Item Needing Branding <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-blue-900 bg-blue-100 font-bold px-2 py-0.5 rounded">{catalogItems.length} Catalog Items</span>
                </label>
                <select
                  value={selectedBrandingItemId}
                  onChange={(e) => handleBrandingItemChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 text-xs"
                >
                  {catalogItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — (Est. R{item.defaultUnitPrice.toFixed(2)}/ea)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Line to insert new item into catalog dropdown */}
              <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 p-3 rounded-lg border border-blue-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-extrabold text-blue-950">
                  <span className="flex items-center space-x-1.5">
                    <PlusCircle className="w-4 h-4 text-blue-700" />
                    <span>INSERT A NEW ITEM / BRANDING METHOD TO CATALOG</span>
                  </span>
                  <span className="text-[10px] text-blue-800 bg-blue-100 font-bold px-2 py-0.5 rounded">
                    Select Technique or Add Custom
                  </span>
                </div>

                {/* Dropdown of Branding Methods */}
                <div className="space-y-1.5">
                  <select
                    value={selectedBrandingMethodPreset}
                    onChange={(e) => handleSelectBrandingMethodPreset(e.target.value)}
                    className="w-full p-2 bg-white border border-blue-300 rounded font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-700"
                  >
                    <option value="">⚡ Select Branding Method (DTF, Embroidery, Silk Screening, Embossing, Foiling...)</option>
                    <optgroup label="🔥 Apparel & Fabric Transfers">
                      <option value="dtf_printing">🎨 DTF (Direct To Film Transfers) — Est. R95.00</option>
                      <option value="silk_screen_printing">🖨️ Silk Screening / Screen Printing — Est. R75.00</option>
                      <option value="heat_press_vinyl">🔥 Heat Press Vinyl & Transfers — Est. R75.00</option>
                      <option value="sublimation_textile">🎽 Dye Sublimation & Roll-to-Roll — Est. R140.00</option>
                    </optgroup>
                    <optgroup label="🪡 Threadwork & Embroidery">
                      <option value="embroidery_flat">🪡 Embroidery (Flat Stitch & Badges) — Est. R85.00</option>
                      <option value="embroidery_3d_puff">🧵 3D Puff Embroidery (Raised) — Est. R115.00</option>
                    </optgroup>
                    <optgroup label="✨ Specialty Dies & Luxury Finishes">
                      <option value="hot_foil_stamping">✨ Hot Stamped Foiling (Gold/Silver) — Est. R65.00</option>
                      <option value="embossing">🏷️ Embossing (Raised 3D Blind/Foil Relief) — Est. R70.00</option>
                      <option value="debossing">🔲 Debossing (Recessed Stamped Imprint) — Est. R70.00</option>
                    </optgroup>
                    <optgroup label="💎 Direct Industrial & Signage">
                      <option value="uv_flatbed_printing">💎 LED UV Full Colour Printing — Est. R110.00</option>
                      <option value="laser_engraving">⚡ Laser Cutting & Engraving — Est. R80.00</option>
                      <option value="signage_acrylic_plaque">🪧 Signboards & Acrylic Plaques — Est. R280.00</option>
                      <option value="vinyl_plotter_decals">✂️ Vinyl Cut-Out Decals — Est. R85.00</option>
                    </optgroup>
                    <optgroup label="🖊️ Promotional & Commercial Print">
                      <option value="pad_printing">🖊️ Pad Printing (Drinkware & Pens) — Est. R45.00</option>
                      <option value="commercial_offset_print">📄 Commercial Digital & Offset Litho — Est. R2.50</option>
                    </optgroup>
                  </select>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type new item name (e.g. EMBROIDERY, DTF HOODIES, FOIL PACKAGING, SIGNBOARDS)..."
                      value={newCustomCatalogName}
                      onChange={(e) => setNewCustomCatalogName(e.target.value)}
                      className="flex-1 p-2 bg-white border border-blue-300 rounded font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-blue-700"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-2 font-bold text-slate-400 text-xs">R</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={newCustomCatalogPrice || ''}
                        onChange={(e) => setNewCustomCatalogPrice(parseFloat(e.target.value) || 0)}
                        className="w-full pl-6 pr-2 py-2 bg-white border border-blue-300 rounded font-mono font-bold text-slate-900 text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleInsertNewCatalogItem}
                      className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-extrabold text-xs shadow-xs flex items-center space-x-1 whitespace-nowrap cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert Item</span>
                    </button>
                  </div>

                  {/* Quick selection pills for common branding methods */}
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[10px] font-extrabold text-blue-900 uppercase">Quick Pick:</span>
                    {[
                      { id: 'dtf_printing', label: 'DTF' },
                      { id: 'embroidery_flat', label: 'Embroidery' },
                      { id: 'silk_screen_printing', label: 'Silk Screen' },
                      { id: 'hot_foil_stamping', label: 'Foiling' },
                      { id: 'embossing', label: 'Embossing' },
                      { id: 'debossing', label: 'Debossing' },
                      { id: 'uv_flatbed_printing', label: 'UV Print' },
                      { id: 'laser_engraving', label: 'Laser' },
                      { id: 'signage_acrylic_plaque', label: 'Signage' },
                      { id: 'heat_press_vinyl', label: 'Heat Press' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => handleSelectBrandingMethodPreset(pill.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          selectedBrandingMethodPreset === pill.id
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-white text-blue-950 border-blue-200 hover:border-blue-400'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedBrandingItemId === 'custom' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Item Title / Description</label>
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="e.g. Branded Water Bottles..."
                    className="w-full p-2 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Quantity Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedQuantityPreset}
                    onChange={(e) => handleQuantityPresetChange(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-slate-900"
                  >
                    <option value="25">25 units</option>
                    <option value="50">50 units</option>
                    <option value="100">100 units</option>
                    <option value="250">250 units</option>
                    <option value="500">500 units</option>
                    <option value="1000">1,000 units</option>
                    <option value="2500">2,500 units</option>
                    <option value="5000">5,000 units</option>
                    <option value="custom">Custom Quantity...</option>
                  </select>

                  {selectedQuantityPreset === 'custom' && (
                    <input
                      type="number"
                      min="1"
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2 mt-2 bg-white border border-slate-300 rounded font-bold text-slate-900"
                      placeholder="Enter exact quantity"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Unit Price (ZAR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-500">R</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-2 py-2 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material / Stock Type</label>
                  <input
                    type="text"
                    value={paperStock}
                    onChange={(e) => setPaperStock(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Color Mode / Print Type</label>
                  <input
                    type="text"
                    value={colorProfile}
                    onChange={(e) => setColorProfile(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>

              {/* Branding Placement & Machine Size Limits */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="font-extrabold text-slate-800 text-xs flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-700" />
                    <span>Branding Method, Placement & Physical Machine Specs</span>
                  </span>
                  <span className="text-[10px] text-blue-800 bg-blue-100 font-bold px-2 py-0.5 rounded">
                    Active: {brandingMethod}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Branding Method / Technique <span className="text-red-500">*</span></span>
                      <Palette className="w-3.5 h-3.5 text-blue-700" />
                    </label>
                    <select
                      value={brandingMethod}
                      onChange={(e) => {
                        const newMethod = e.target.value;
                        setBrandingMethod(newMethod);
                        const matched = BRANDING_METHODS_OPTIONS.find(
                          (m) => m.name === newMethod || m.id === newMethod || m.name.toLowerCase() === newMethod.toLowerCase()
                        );
                        if (matched) {
                          setPaperStock(matched.defaultStock);
                          setColorProfile(matched.defaultColor);
                          setFinishInput(matched.defaultFinishes.join(', '));
                          setBrandingPlacement(matched.defaultPlacement);
                          setBrandingWidthMm(matched.defaultWidthMm);
                          setBrandingHeightMm(matched.defaultHeightMm);
                          setMaxPhysicalWidthMm(matched.maxPhysicalWidthMm);
                          setMaxPhysicalHeightMm(matched.maxPhysicalHeightMm);
                          setAvailablePlacements(matched.placements);
                          setCurrentImageUrl(matched.imageUrl);
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-slate-900 text-xs"
                    >
                      <optgroup label="🔥 Apparel & Fabric Transfers">
                        <option value="DTF (Direct To Film Transfers)">🎨 DTF (Direct To Film Transfers)</option>
                        <option value="Silk Screening / Screen Printing">🖨️ Silk Screening / Screen Printing</option>
                        <option value="Heat Press Vinyl & Thermal Transfer (PU / Flock / Reflective)">🔥 Heat Press Vinyl & Thermal Transfers</option>
                        <option value="Dye Sublimation & Roll-to-Roll Textile Printing">🎽 Dye Sublimation & Roll-to-Roll</option>
                      </optgroup>
                      <optgroup label="🪡 Threadwork & Embroidery">
                        <option value="Embroidery (Flat Stitch & Badges)">🪡 Embroidery (Flat Stitch & Badges)</option>
                        <option value="3D Puff Embroidery (Raised High-Density)">🧵 3D Puff Embroidery (Raised High-Density)</option>
                      </optgroup>
                      <optgroup label="✨ Specialty Dies & Luxury Finishes">
                        <option value="Hot Stamped Foiling (Gold, Silver, Metallic)">✨ Hot Stamped Foiling (Gold, Silver, Metallic)</option>
                        <option value="Embossing (Raised 3D Blind / Foil Relief)">🏷️ Embossing (Raised 3D Blind/Foil Relief)</option>
                        <option value="Debossing (Recessed Stamped Imprint)">🔲 Debossing (Recessed Stamped Imprint)</option>
                      </optgroup>
                      <optgroup label="💎 Direct Industrial & Signage">
                        <option value="LED UV Full Colour Printing (Direct Flatbed)">💎 LED UV Full Colour Printing (Flatbed)</option>
                        <option value="Laser Cutting & Engraving (Wood, Acrylic, Metal)">⚡ Laser Cutting & Engraving</option>
                        <option value="Signage & Standoff Wall Plaques (ACM / Cast Acrylic)">🪧 Signage & Standoff Wall Plaques</option>
                        <option value="Vinyl Cut-Out Decals & Vehicle Graphics">✂️ Vinyl Cut-Out Decals & Lettering</option>
                      </optgroup>
                      <optgroup label="🖊️ Promotional & Commercial Print">
                        <option value="Pad Printing (Tampo Print for Drinkware & Pens)">🖊️ Pad Printing (Drinkware & Pens)</option>
                        <option value="Commercial Digital & Offset Litho Printing">📄 Commercial Digital & Offset Litho</option>
                      </optgroup>
                      {/* If current custom value not in list */}
                      {![
                        'DTF (Direct To Film Transfers)',
                        'Silk Screening / Screen Printing',
                        'Heat Press Vinyl & Thermal Transfer (PU / Flock / Reflective)',
                        'Dye Sublimation & Roll-to-Roll Textile Printing',
                        'Embroidery (Flat Stitch & Badges)',
                        '3D Puff Embroidery (Raised High-Density)',
                        'Hot Stamped Foiling (Gold, Silver, Metallic)',
                        'Embossing (Raised 3D Blind / Foil Relief)',
                        'Debossing (Recessed Stamped Imprint)',
                        'LED UV Full Colour Printing (Direct Flatbed)',
                        'Laser Cutting & Engraving (Wood, Acrylic, Metal)',
                        'Signage & Standoff Wall Plaques (ACM / Cast Acrylic)',
                        'Vinyl Cut-Out Decals & Vehicle Graphics',
                        'Pad Printing (Tampo Print for Drinkware & Pens)',
                        'Commercial Digital & Offset Litho Printing',
                      ].includes(brandingMethod) && (
                        <option value={brandingMethod}>{brandingMethod} (Custom)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Placement Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={brandingPlacement}
                      onChange={(e) => setBrandingPlacement(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-bold text-slate-900 text-xs"
                    >
                      {availablePlacements.map((loc, lIdx) => (
                        <option key={lIdx} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Width (mm)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="2000"
                      value={brandingWidthMm}
                      onChange={(e) => setBrandingWidthMm(parseInt(e.target.value) || 10)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Height (mm)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="2500"
                      value={brandingHeightMm}
                      onChange={(e) => setBrandingHeightMm(parseInt(e.target.value) || 10)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs"
                    />
                  </div>
                </div>

                {/* Live Preview Canvas inside modal */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-700 mb-1">
                    Live Placement & Machine Spec Visualizer
                  </div>
                  <BrandingPreviewCanvas
                    productName={
                      selectedBrandingItemId === 'custom'
                        ? customItemName || 'Custom Item'
                        : catalogItems.find((i) => i.id === selectedBrandingItemId)?.name ||
                          BRANDED_ITEMS_CATALOG.find((i) => i.id === selectedBrandingItemId)?.name ||
                          'Branded Item'
                    }
                    imageUrl={currentImageUrl}
                    brandingPlacement={brandingPlacement}
                    brandingWidthMm={brandingWidthMm}
                    brandingHeightMm={brandingHeightMm}
                    maxPhysicalWidthMm={maxPhysicalWidthMm}
                    maxPhysicalHeightMm={maxPhysicalHeightMm}
                    brandingMethod={brandingMethod}
                    interactive={true}
                    onUpdatePlacement={(newPlacement, newW, newH, newMethod) => {
                      setBrandingPlacement(newPlacement);
                      setBrandingWidthMm(newW);
                      setBrandingHeightMm(newH);
                      if (newMethod) setBrandingMethod(newMethod);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Finishing Specs (Comma separated)</label>
                <input
                  type="text"
                  value={finishInput}
                  onChange={(e) => setFinishInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                  <span>Line Total Preview:</span>
                  <span className="font-mono text-emerald-900 font-extrabold">
                    R {calculatedLineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddFormModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white rounded-lg font-extrabold cursor-pointer"
                >
                  Add Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PRINTABLE DOCUMENT & PDF PREVIEW MODAL */}
      {showPdfExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden font-sans my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-600 rounded-lg text-white">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Quotation_{job.quote.quoteNumber}_{job.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Formal printable document view formatted for A4 printing and PDF export.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTriggerPrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Quote</span>
                </button>

                <button
                  onClick={() => setShowPdfExportModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-100 max-h-[75vh] overflow-y-auto">
              <div
                id="printable-quotation-pdf"
                className="bg-white p-8 rounded-lg border border-slate-300 shadow-md max-w-3xl mx-auto space-y-6 text-slate-800"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-6 h-6 text-blue-900" />
                      <span className="text-xl font-black text-slate-900 tracking-tight">BRANDFLOW PRO</span>
                    </div>
                    <div className="text-xs font-bold text-slate-600">Enterprise Printing & Packaging Solutions</div>
                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                      <div>45 Corporate Park Drive, Building 8, Sandton</div>
                      <div>Johannesburg, Gauteng 2196, South Africa</div>
                      <div>Tax Registration: <span className="font-bold text-slate-700">ZA-4982104419</span></div>
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span>Tel: +27 (0)11 555-PRINT • Email:</span>
                        <EmailLink
                          email="quotes@brandflowpro.co.za"
                          subject={`Inquiry regarding Quotation #${job.quote.quoteNumber}`}
                          className="text-blue-900 font-semibold underline decoration-blue-500/60"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="px-3 py-1 bg-red-100 text-red-900 text-xs font-black uppercase rounded inline-block border border-red-200">
                      OFFICIAL QUOTATION
                    </div>
                    <div className="text-lg font-mono font-black text-slate-900 mt-1">
                      #{job.quote.quoteNumber}
                    </div>
                    <div className="text-xs text-slate-500">
                      Date: <span className="font-semibold text-slate-800">2026-07-22</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Valid: <span className="font-semibold text-slate-800">30 Days</span>
                    </div>
                  </div>
                </div>

                {/* Client Grid */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Client Profile</div>
                    <div className="font-extrabold text-slate-900 text-sm">{job.companyName}</div>
                    <div className="font-semibold text-slate-700 mt-0.5">Attn: {job.customerName}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5 flex items-center space-x-1">
                      <span>Email:</span>
                      <EmailLink
                        email={job.customerEmail || `${job.customerName.toLowerCase().replace(/\s+/g, '.')}@${job.companyName.toLowerCase().replace(/\s+/g, '')}.co.za`}
                        subject={`Quotation #${job.quote.quoteNumber} - ${job.projectName}`}
                        className="text-blue-900 font-semibold underline decoration-blue-500/60"
                      />
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {job.dispatch?.shippingAddress || 'Sandton, Johannesburg, Gauteng, 2196'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Manager</div>
                    <div className="font-extrabold text-slate-900 text-sm">{job.quote.salesRep || 'David Miller'}</div>
                    <div className="text-slate-600 font-semibold mt-0.5">Commercial Printing Specialist</div>
                    <div className="text-slate-600 text-[11px] mt-0.5 flex items-center space-x-1">
                      <span>Email:</span>
                      <EmailLink
                        email="d.miller@brandflowpro.co.za"
                        subject={`Quotation #${job.quote.quoteNumber} Inquiry`}
                        className="text-blue-900 font-semibold underline decoration-blue-500/60"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Title</div>
                  <div className="text-sm font-bold text-slate-900">{job.projectName}</div>
                </div>

                {/* Table */}
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="py-2.5">Item Specifications</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price (ZAR)</th>
                      <th className="py-2.5 text-right">Total (ZAR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((item, idx) => (
                      <tr key={idx} className="align-top">
                        <td className="py-3 pr-2">
                          <div className="font-bold text-slate-900">{item.description}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Stock: {item.paperStock} • Color: {item.colorProfile}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.finishes.map((f, fi) => (
                              <span key={fi} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-medium rounded border border-slate-200">
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-slate-800">{item.quantity.toLocaleString()}</td>
                        <td className="py-3 text-right font-mono text-slate-700">R {item.unitCost.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono font-bold text-slate-900">R {item.totalCost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Financial Totals */}
                <div className="flex justify-between items-start border-t-2 border-slate-200 pt-4">
                  <div className="w-1/2 text-[11px] text-slate-500 space-y-1 pr-4">
                    <div className="font-bold text-slate-700">Payment Terms</div>
                    <p className="text-slate-600 text-[10px]">
                      50% deposit required upon proof sign-off prior to production. Balance due strictly within 30 days of dispatch invoice date. Prices quoted in ZAR incl. 15% VAT.
                    </p>
                  </div>

                  <div className="w-64 space-y-1.5 text-xs font-medium">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-bold text-slate-900">R {rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Discount ({discountPercent}%):</span>
                      <span className="font-mono font-bold text-red-600">-R {discountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>VAT (15% ZAR):</span>
                      <span className="font-mono font-bold text-slate-900">R {vatTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-black text-slate-900">
                      <span>Grand Total:</span>
                      <span className="font-mono text-emerald-700">R {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span>BrandFlow Pro ERP • Automated PDF Document Engine</span>
              <button
                onClick={() => setShowPdfExportModal(false)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
