import React from 'react';
import { CertificateElement, FONTS } from '@/types/certificate';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
    Bold, Italic, AlignLeft, AlignCenter, AlignRight,
    ArrowUpToLine, ArrowDownToLine, Copy, Trash2,
    CaseUpper, CaseLower, CaseSensitive
} from 'lucide-react';

interface CertificatePropertiesBarProps {
    selectedElement: CertificateElement;
    onUpdateElement: (id: string, updates: Partial<CertificateElement>) => void;
    onDeleteElement: (id: string) => void;
    onDuplicateElement?: (id: string) => void;
}

export function CertificatePropertiesBar({
    selectedElement,
    onUpdateElement,
    onDeleteElement,
    onDuplicateElement
}: CertificatePropertiesBarProps) {
    const isText = selectedElement.type === 'text' || selectedElement.type === 'variable';
    const isShape = selectedElement.type === 'shape';

    const extractFontName = (fontFamily: string) => {
        return fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    };

    const currentFontValue = selectedElement.style.fontFamily || 'Arial, sans-serif';

    return (
        <div className="flex items-center gap-2 p-2 bg-white border-b overflow-x-auto min-h-[56px] shadow-sm z-10 shrink-0 text-sm">
            
            {isText && (
                <>
                    {/* Font Family */}
                    <div className="w-32 shrink-0">
                        <Select
                            value={currentFontValue}
                            onValueChange={(val) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, fontFamily: val } })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Font" />
                            </SelectTrigger>
                            <SelectContent style={{ zIndex: 99999 }}>
                                <SelectGroup>
                                    {FONTS.map(f => (
                                        <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                            {f.label}
                                        </SelectItem>
                                    ))}
                                    {!FONTS.some(f => f.value === currentFontValue) && (
                                        <SelectItem value={currentFontValue} style={{ fontFamily: currentFontValue }}>
                                            {extractFontName(currentFontValue)}
                                        </SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Font Size */}
                    <div className="flex items-center w-16 shrink-0">
                        <Input
                            type="number"
                            className="h-8 text-xs px-2"
                            value={selectedElement.style.fontSize || 16}
                            onChange={(e) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: parseInt(e.target.value) } })}
                        />
                    </div>

                    {/* Text Color */}
                    <div className="flex items-center shrink-0">
                        <Input
                            type="color"
                            value={selectedElement.style.color || '#000000'}
                            onChange={(e) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, color: e.target.value } })}
                            className="w-8 h-8 p-1 cursor-pointer border-none shadow-none"
                            title="Text Color"
                        />
                    </div>

                    <div className="w-px h-6 bg-border mx-1 shrink-0" />

                    {/* Formatting */}
                    <div className="flex items-center shrink-0 bg-muted/50 rounded-md p-0.5">
                        <Button
                            variant={selectedElement.style.fontWeight === 'bold' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, fontWeight: selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold' } })}
                        >
                            <Bold className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant={selectedElement.style.fontStyle === 'italic' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, fontStyle: selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic' } })}
                        >
                            <Italic className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="flex items-center shrink-0 bg-muted/50 rounded-md p-0.5 ml-1">
                        <Button
                            variant={selectedElement.style.textAlign === 'left' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, textAlign: 'left' } })}
                        >
                            <AlignLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant={selectedElement.style.textAlign === 'center' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, textAlign: 'center' } })}
                        >
                            <AlignCenter className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant={selectedElement.style.textAlign === 'right' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, textAlign: 'right' } })}
                        >
                            <AlignRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="w-px h-6 bg-border mx-1 shrink-0" />

                    {/* Text Transform */}
                    <ToggleGroup
                        type="single"
                        value={selectedElement.style.textTransform || 'none'}
                        onValueChange={(val) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, textTransform: val as any } })}
                        className="shrink-0"
                    >
                        <ToggleGroupItem value="uppercase" aria-label="Uppercase" className="h-7 w-7 p-0"><CaseUpper className="h-3.5 w-3.5" /></ToggleGroupItem>
                        <ToggleGroupItem value="capitalize" aria-label="Capitalize" className="h-7 w-7 p-0"><CaseSensitive className="h-3.5 w-3.5" /></ToggleGroupItem>
                    </ToggleGroup>
                </>
            )}

            {isShape && (
                <>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">Fill</span>
                        <Input
                            type="color"
                            value={selectedElement.style.backgroundColor || '#000000'}
                            onChange={(e) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, backgroundColor: e.target.value } })}
                            className="w-8 h-8 p-1 cursor-pointer border-none"
                            title="Background Color"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs text-muted-foreground">Stroke</span>
                        <Input
                            type="color"
                            value={selectedElement.style.borderColor || '#000000'}
                            onChange={(e) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, borderColor: e.target.value } })}
                            className="w-8 h-8 p-1 cursor-pointer border-none"
                            title="Border Color"
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs text-muted-foreground">Weight</span>
                        <Input
                            type="number"
                            className="h-8 w-16 text-xs px-2"
                            value={selectedElement.style.borderWidth || 0}
                            onChange={(e) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, borderWidth: parseInt(e.target.value) } })}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs text-muted-foreground">Radius</span>
                        <Input
                            type="number"
                            className="h-8 w-16 text-xs px-2"
                            value={selectedElement.style.borderRadius || 0}
                            onChange={(e) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, borderRadius: parseInt(e.target.value) } })}
                        />
                    </div>
                </>
            )}

            <div className="flex-1" />

            {/* Common Tools (Opacity, Layers, Duplicate, Delete) */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-xs shrink-0">
                        Opacity: {Math.round((selectedElement.style.opacity || 1) * 100)}%
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="end" style={{ zIndex: 99999 }}>
                    <Slider
                        value={[selectedElement.style.opacity ?? 1]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={([val]) => onUpdateElement(selectedElement.id, { style: { ...selectedElement.style, opacity: val } })}
                    />
                </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-border mx-1 shrink-0" />

            <div className="flex items-center shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onUpdateElement(selectedElement.id, { zIndex: (selectedElement.zIndex || 1) + 1 })}
                    title="Bring Forward"
                >
                    <ArrowUpToLine className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onUpdateElement(selectedElement.id, { zIndex: Math.max((selectedElement.zIndex || 1) - 1, 0) })}
                    title="Send Backward"
                >
                    <ArrowDownToLine className="h-4 w-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1 shrink-0" />

            {onDuplicateElement && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 shrink-0"
                    onClick={() => onDuplicateElement(selectedElement.id)}
                    title="Duplicate"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            )}

            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                onClick={() => onDeleteElement(selectedElement.id)}
                title="Delete"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
