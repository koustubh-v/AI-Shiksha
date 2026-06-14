import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PLACEHOLDERS } from '@/types/certificate';
import { cn } from '@/lib/utils';
import {
    Type, Image as ImageIcon, QrCode, Square, Circle, Minus,
    Settings, LayoutTemplate, Palette, Trash2
} from 'lucide-react';

interface CertificateSidebarProps {
    onAddText: (text: string) => void;
    onAddImage: (file: File) => void;
    onAddQrCode: () => void;
    onAddShape?: (shapeType: 'rectangle' | 'circle' | 'line') => void;
    onUploadBackground: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveBackground: () => void;
    canvasBackgroundColor: string;
    onUpdateCanvasBackground: (color: string) => void;
    canvasBorderWidth?: number;
    canvasBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
    canvasBorderColor?: string;
    onUpdateCanvasBorder: (updates: { borderWidth?: number, borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none', borderColor?: string }) => void;
    onLoadTemplate: (templateId: string) => void;
}

export function CertificateSidebar({
    onAddText,
    onAddImage,
    onAddQrCode,
    onAddShape,
    onUploadBackground,
    onRemoveBackground,
    canvasBackgroundColor,
    onUpdateCanvasBackground,
    canvasBorderWidth,
    canvasBorderStyle,
    canvasBorderColor,
    onUpdateCanvasBorder,
    onLoadTemplate
}: CertificateSidebarProps) {
    const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'elements' | 'images' | 'bg'>('templates');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onAddImage(e.target.files[0]);
        }
    };

    return (
        <div className="flex h-full bg-white border-r">
            {/* Slim Icon Bar */}
            <div className="w-16 flex flex-col border-r bg-gray-50 py-4 items-center gap-4 z-20">
                <button
                    onClick={() => setActiveTab('templates')}
                    className={cn(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                        activeTab === 'templates' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-200"
                    )}
                >
                    <LayoutTemplate className="h-5 w-5" />
                    <span className="text-[10px] mt-1 font-medium">Templates</span>
                </button>

                <button
                    onClick={() => setActiveTab('text')}
                    className={cn(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                        activeTab === 'text' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-200"
                    )}
                >
                    <Type className="h-5 w-5" />
                    <span className="text-[10px] mt-1 font-medium">Text</span>
                </button>

                <button
                    onClick={() => setActiveTab('elements')}
                    className={cn(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                        activeTab === 'elements' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-200"
                    )}
                >
                    <Square className="h-5 w-5" />
                    <span className="text-[10px] mt-1 font-medium">Elements</span>
                </button>

                <button
                    onClick={() => setActiveTab('images')}
                    className={cn(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                        activeTab === 'images' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-200"
                    )}
                >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-[10px] mt-1 font-medium">Uploads</span>
                </button>

                <button
                    onClick={() => setActiveTab('bg')}
                    className={cn(
                        "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                        activeTab === 'bg' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-200"
                    )}
                >
                    <Palette className="h-5 w-5" />
                    <span className="text-[10px] mt-1 font-medium">Bkground</span>
                </button>
            </div>

            {/* Expandable Drawer Panel */}
            <div className="w-64 bg-white flex flex-col h-full shadow-sm z-10">
                <div className="p-4 border-b shrink-0">
                    <h3 className="font-semibold text-sm capitalize">
                        {activeTab === 'bg' ? 'Background' : activeTab}
                    </h3>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                    {activeTab === 'templates' && (
                        <div className="space-y-4">
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Predefined Templates</Label>
                            <p className="text-xs text-muted-foreground mb-4">Loading a template will overwrite your current design.</p>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <Button variant="outline" className="h-16 flex flex-col items-center justify-center border-2 border-blue-500/20 hover:border-blue-500 hover:bg-blue-50" onClick={() => onLoadTemplate('coursera')}>
                                    <span className="font-bold text-blue-600">Template 1</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">Minimal, Professional</span>
                                </Button>
                                
                                <Button variant="outline" className="h-16 flex flex-col items-center justify-center border-2 border-purple-500/20 hover:border-purple-500 hover:bg-purple-50" onClick={() => onLoadTemplate('udemy')}>
                                    <span className="font-bold text-purple-600">Template 2</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">Modern, Left-aligned</span>
                                </Button>
                                
                                <Button variant="outline" className="h-16 flex flex-col items-center justify-center border-2 border-slate-700/20 hover:border-slate-700 hover:bg-slate-50" onClick={() => onLoadTemplate('cisco')}>
                                    <span className="font-bold text-slate-800">Template 3</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">Formal, Heavy Border</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Button className="w-full justify-start h-12 text-lg font-bold" variant="secondary" onClick={() => onAddText("Add a heading")}>
                                    Add a heading
                                </Button>
                                <Button className="w-full justify-start h-10 text-base font-semibold" variant="secondary" onClick={() => onAddText("Add a subheading")}>
                                    Add a subheading
                                </Button>
                                <Button className="w-full justify-start h-8 text-sm" variant="secondary" onClick={() => onAddText("Add a little bit of body text")}>
                                    Add body text
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Dynamic Variables</Label>
                                <div className="grid grid-cols-1 gap-1">
                                    {PLACEHOLDERS.map((p) => (
                                        <Button
                                            key={p.value}
                                            variant="ghost"
                                            className="justify-start h-8 text-xs font-normal"
                                            onClick={() => onAddText(p.value)}
                                        >
                                            {p.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'elements' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Shapes</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button 
                                        className="aspect-square border rounded-md flex items-center justify-center hover:bg-gray-50 hover:border-primary transition-all group"
                                        onClick={() => onAddShape?.('rectangle')}
                                    >
                                        <Square className="h-8 w-8 text-gray-400 group-hover:text-primary" />
                                    </button>
                                    <button 
                                        className="aspect-square border rounded-md flex items-center justify-center hover:bg-gray-50 hover:border-primary transition-all group"
                                        onClick={() => onAddShape?.('circle')}
                                    >
                                        <Circle className="h-8 w-8 text-gray-400 group-hover:text-primary" />
                                    </button>
                                    <button 
                                        className="aspect-square border rounded-md flex items-center justify-center hover:bg-gray-50 hover:border-primary transition-all group"
                                        onClick={() => onAddShape?.('line')}
                                    >
                                        <Minus className="h-8 w-8 text-gray-400 group-hover:text-primary" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Advanced</Label>
                                <Button className="w-full justify-start border-dashed" variant="outline" onClick={onAddQrCode}>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Add QR Code Validation
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="img-elem-upload" className="w-full">
                                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer text-primary">
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-sm font-medium">Upload Image or Logo</span>
                                    </div>
                                    <input
                                        id="img-elem-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </Label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bg' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Solid Color</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="color"
                                        value={canvasBackgroundColor}
                                        onChange={(e) => onUpdateCanvasBackground(e.target.value)}
                                        className="w-12 h-12 p-1 cursor-pointer rounded-md"
                                    />
                                    <span className="text-sm font-medium">{canvasBackgroundColor}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Background Image</Label>
                                <Label htmlFor="bg-upload" className="w-full cursor-pointer block">
                                    <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                            <ImageIcon className="h-6 w-6" />
                                            <span className="text-xs font-medium">Upload Background Image</span>
                                        </div>
                                    </div>
                                    <input
                                        id="bg-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onUploadBackground}
                                    />
                                </Label>

                                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onRemoveBackground}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Background Image
                                </Button>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Canvas Border</Label>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-normal">Style</Label>
                                        <select 
                                            className="h-8 text-xs border rounded px-2 w-32"
                                            value={canvasBorderStyle || 'none'}
                                            onChange={(e) => onUpdateCanvasBorder({ borderStyle: e.target.value as any })}
                                        >
                                            <option value="none">None</option>
                                            <option value="solid">Solid</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="dotted">Dotted</option>
                                            <option value="double">Double</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-normal">Width</Label>
                                        <Input
                                            type="number"
                                            value={canvasBorderWidth || 0}
                                            onChange={(e) => onUpdateCanvasBorder({ borderWidth: parseInt(e.target.value) || 0 })}
                                            className="h-8 w-32 text-xs"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-normal">Color</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground uppercase w-16 text-right">{canvasBorderColor || '#000000'}</span>
                                            <Input
                                                type="color"
                                                value={canvasBorderColor || '#000000'}
                                                onChange={(e) => onUpdateCanvasBorder({ borderColor: e.target.value })}
                                                className="w-8 h-8 p-1 cursor-pointer border-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
