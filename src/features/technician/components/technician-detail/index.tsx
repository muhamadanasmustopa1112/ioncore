"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  User, 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  Circle,
  FileText,
  Image as ImageIcon,
  Plus,
  ArrowLeft,
  Search,
  ExternalLink,
  Map,
  Settings,
  MoreVertical,
  Activity,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPinned,
  Info,
  Check,
  Camera,
  Maximize2
} from "lucide-react";
import { paths } from "@/config/paths";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TechnicianWorkOrderDetail({ id }: { id: string }) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Equipment Check", completed: true },
    { id: "2", label: "Arrived at site", completed: true },
    { id: "3", label: "Attenuation Test", completed: false },
    { id: "4", label: "Speed Test", completed: false },
    { id: "5", label: "Customer Approval", completed: false },
  ]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleCheck = (itemId: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCiPmCenqCyl8NF7vFeVlHQWH30I5SyhnMeHUvfwJBFzNZpisvcvrKFpH-PrbtuWR6KSDIoAjxbRA6vF8XWO0-oFrD5wN2jMrzoWKlj3qz245yWWT-jzkftVRC-QEhrsWi61aMPEZMYNJsaI67E--BbiQJlJ7A3fP1FnaSxytluxoTvqoExetbbkznAANUt1EJggYOjpED1PUhnZN0iggFYwzyOoxg-6XVqveJjn0GoPj6iIzYDlFjzpZVpyKrZhGV_SzM-m2UjFHyA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTs6OzUAExDMTWsqDFRBROsETnhYcZek2USdRS_hSxMQiBp3SsDKsHt_K5r7Z07GVe1wVYWIJELgh4hqSYBa0x4ooshglSRVix37FDCTMvhjFHyWG12sNJJ_LW_-8VW2jn87g3XyD0mrxNj8IXMWPfohvXElh5FHOh-ts7FSjW6F1QTBMRGtrJJ07vH5siR9dIIY5zBPqE6meMxCIbH7mAu3wShSiPwI5Ll_12ES2rdiHrvLZu_bOs6q392zZj1sayB4M4_86tJTUV",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9_5o3P-D4WQsVQ2vGyfWBp0zMN0qZNJUBdZqyxX7ZrjVC3Le7UF9KKrIB1nkDCYyxKZTr1-cqB_iM2fBjhyDtNAQbMs-WI4FasPWKXAnh8Ar06InZ7KZ72kP5Ci1l-I5RjrY4P5JN_r3k6VEhTNX7x9NgLu-Z7QaovQgsDBQt-mtPfSPBTitLc4aRmun3WBjhGuIMtHKzIBdAMLMbkhH1E16HStCAJNMUM5L4E1GZAPy5t6JJ4BaT3dPX6eXesuBLLUMETSSg9fW",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASDM5q0NXtvMc25de5qqW1Og-13_t1oe2ANgE_OSAtmQF6Nf2yd5dOAelYZrdyjQHJUDcNpUlydMDv-73V75qac4zoJKmiOtWUCad0JTu37NidHT4_OpR8oEcusDFvkS-l_TrpL14JRkRCe5_atg8564WKVc8LctJ2RXLuuCCYuwqP97V9_SHKNBscQdvvGnEh9U6wVYx2U01pDjtfTLyrIZipyiM7FFh9mzINiPOmFdwT77SbnWQwnlJxXAUdVsbbNRjXTMZuyVhM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB__o4SlY8BfwCHRgoP9EYJLnVF2l2NlVPUS0FU682BF-mOTP5TsZx2Mjws0w4hcFcsEi-7Kxi5LLtb7ejHV93d6_W_WnUpR8ybY6n7a6T6nBzF3VSe5uNBGOnGNmNX_C0UG0Tfw6r0hWJB8VoPp0jgYXNOJEZKwv7ZTep9xeEQ1hpBzA1RzugnnEmXfEBl0E09QKqmNR2VAa9OXTg54HYHXB2o_lUGDgzunYk3vlz8zQWKj4FHn-7FOLJa6ya3OhqRzalTyi0mxPph",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBAr28y4NMa6KchzJzyEBvOVhg1FahB6BSBx8JOIuCPTVFi2z69_ecXvcQdXwqRhI8VTLftm3MPnCirODtc5QEw0-O9WYLWvSq7CcHs0IxAJWg7nRisy6sDHl1KQKRKeIDNskqTsK9n9rUkFJmo_bZRYPTVQDAh9-Gi_jZoRbKooIveL-xIOcUm2rBKmWJsM2CKeOhcJBzkfHZxZUiNElYiy3w9zrUQee_sq7R1FDvrVq5DfrT31XsI8nf082JC5RAYKCCYK6eg6yvo",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyAoP-tqut-MIZOPwOtzupMFLKV7yQwo1VgpvwYRKGrUWVBhYj8NJHALHnzsXyduPEgd8AS4Yid6GFxJSh1PA4ZclGQk8HWF-rlObbsgTfR-gZ7CC5s3YPGk34_47k5HeBn0RpLU9ryEDQDz6ngk7B1IsUs2qQse2Exz7_dCqUA8x3-jK_JPZow7mFIIdR6US8cJqiGeZx7Q0Ub4IFuyVVCan5rsEN1m5HrjQs03f2w05hXalpFKYoHzjKoipKuipsq8F56cndbSW9",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDuLYpotmAoNQkjFX5SdFtmxnC9JvWxnFU-xfua2gwjnUcF4ZJfII14d2FsN-epdaoGXfaDJGcPAh8gbR9Almern6dOauvvGiuMTHV7QQ8pOX3PBDKdUkl-3upQUZHdCizbzutBo2oo-plDVpzoZk9OJ2LOHDD9OrfpMOI-A4WWKnM5h9MTZBb0bMypXODTmzBBtd2_zmNPzI54E1JQCxYXrS1ca3HpnSfFg7dADJXoD3sXrpiJw4fNaCqtJpoYclHNC52AfTIuRDvL",
  ];

  return (
    <div className="flex-1 p-8 bg-background relative min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root.getHref()}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.technician.root.getHref()}>Technician & Field</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.technician.root.getHref()}>Work Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">New Fiber Installation</h2>
          <p className="text-sm text-slate-500">Scheduled for today, 14:00 PM</p>
        </div>
        <Badge variant="primary" appearance="light" size="lg" className="uppercase tracking-widest font-bold">
          In Progress
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User className="size-4 text-primary" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Full Name</p>
                  <p className="text-sm font-semibold">Budi Santoso</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Contact Number</p>
                  <p className="text-sm font-semibold">+62 812-3456-7890</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Installation Address</p>
                  <p className="text-sm font-semibold">Jl. Pangeran Antasari No. 45, Jakarta Selatan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technician Details */}
          <Card>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Settings className="size-4 text-primary" /> Technician Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="size-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tight">Senior Engineer</p>
                    <p className="text-sm font-bold">Budi Santoso</p>
                    <p className="text-[10px] text-slate-500">+62 811-0000-111</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-400">
                  <div className="size-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="size-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Junior Engineer</p>
                    <p className="text-sm font-bold">Agus Prasetyo</p>
                    <p className="text-[10px] text-slate-500">+62 811-2222-333</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="size-4 text-primary" /> Location - Jakarta Selatan
                </CardTitle>
                <Link 
                  href="https://maps.google.com/maps?q=-6.2088,106.8456" 
                  target="_blank"
                  className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline"
                >
                  Open in Google Maps
                </Link>
              </div>
            </CardHeader>
            <div className="h-80 bg-slate-100 dark:bg-slate-800 relative">
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                allowFullScreen 
                src="https://maps.google.com/maps?q=-6.2088,106.8456&hl=en&z=15&output=embed"
                className="grayscale dark:invert-[0.9] dark:hue-rotate-180"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative">
                  <MapPin className="size-10 text-red-500 fill-red-500 drop-shadow-lg" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest text-center">Installation Site</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Infrastructure Specs */}
          <Card>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Infrastructure Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ODP Location</p>
                  <p className="text-xs font-bold">-6.2088, 106.8456</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ODP ID</p>
                  <p className="text-sm font-bold">ODP-K01-A</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Slot Number</p>
                  <p className="text-sm font-bold">04</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Distance</p>
                  <p className="text-sm font-bold">124 meters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technician Notes */}
          <Card>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="size-4 text-primary" /> Technician Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Add installation notes, site difficulties, or specific equipment IDs here..." 
                className="min-h-[120px] bg-slate-50 dark:bg-slate-800 border-none resize-none"
              />
              <div className="mt-4 flex justify-end">
                <Button variant="primary" size="sm" className="font-bold uppercase tracking-widest text-[10px]">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Checklist */}
          <Card>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> Installation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer ${
                    item.completed 
                      ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30" 
                      : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-primary"
                  }`}
                >
                  <div className={`size-6 rounded flex items-center justify-center mr-4 transition-colors ${
                    item.completed ? "bg-emerald-500" : "border-2 border-slate-300 dark:border-slate-600"
                  }`}>
                    {item.completed && <Check className="size-4 text-white font-bold" />}
                  </div>
                  <span className={`text-sm font-semibold transition-all ${
                    item.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 flex items-start gap-3 mt-4">
                <Info className="size-4 text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-primary font-medium leading-relaxed">
                  Complete all checklist items to finalize this work order. Updates are synced in real-time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" /> Photo Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer group relative"
                    onClick={() => setPreviewImage(src)}
                  >
                    <img 
                      src={src} 
                      alt={`Site photo ${i+1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="size-5 text-white" />
                    </div>
                  </div>
                ))}
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group">
                  <Camera className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Upload</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />
            <Button 
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
              variant="ghost"
              onClick={() => setPreviewImage(null)}
            >
              Close [Esc]
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
