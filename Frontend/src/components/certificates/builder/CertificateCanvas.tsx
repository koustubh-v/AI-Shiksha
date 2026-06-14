import React, { useRef, useState } from 'react';
import { CertificateElement, CertificateTemplateConfig } from '@/types/certificate';
import { cn } from '@/lib/utils';
import QRCode from 'react-qr-code';
import { Rnd } from 'react-rnd';

interface CertificateCanvasProps {
    config: CertificateTemplateConfig;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Partial<CertificateElement>) => void;
    zoom?: number;
}

export function CertificateCanvas({
    config,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    zoom = 1,
}: CertificateCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [editingElementId, setEditingElementId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [guides, setGuides] = useState<{type: 'vertical'|'horizontal', position: number}[]>([]);

    const handleDoubleClick = (e: React.MouseEvent, element: CertificateElement) => {
        e.stopPropagation();
        if (element.type === 'text' || element.type === 'variable') {
            setEditingElementId(element.id);
            setEditingContent(element.content);
        }
    };

    const handleEditBlur = () => {
        if (editingElementId) {
            onUpdateElement(editingElementId, { content: editingContent });
            setEditingElementId(null);
            setEditingContent('');
        }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEditBlur();
        } else if (e.key === 'Escape') {
            setEditingElementId(null);
            setEditingContent('');
        }
    };

    // Sort elements by zIndex
    const sortedElements = [...config.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    return (
        <div
            className="relative shadow-2xl bg-white overflow-hidden transition-all duration-200 ease-in-out"
            style={{
                width: config.canvas.width * zoom,
                height: config.canvas.height * zoom,
                backgroundColor: config.canvas.backgroundColor,
                backgroundImage: config.canvas.backgroundImage ? `url(${config.canvas.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderStyle: config.canvas.borderStyle || 'none',
                borderWidth: (config.canvas.borderWidth || 0) * zoom,
                borderColor: config.canvas.borderColor || '#000000',
            }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onSelectElement(null);
                }
            }}
            ref={canvasRef}
        >
            {/* Smart Guides */}
            {guides.map((g, i) => (
                <div
                    key={i}
                    className="absolute bg-[#e91e63] z-50 pointer-events-none"
                    style={{
                        ...(g.type === 'vertical' ? {
                            left: g.position,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            boxShadow: '0 0 2px rgba(233,30,99,0.5)'
                        } : {
                            top: g.position,
                            left: 0,
                            right: 0,
                            height: 1,
                            boxShadow: '0 0 2px rgba(233,30,99,0.5)'
                        })
                    }}
                />
            ))}
            {sortedElements.map((element) => {
                const isSelected = selectedElementId === element.id;

                let elementContent = null;
                
                if (element.type === 'image') {
                    elementContent = (
                        <img
                            src={element.content}
                            alt="Certificate Element"
                            className="w-full h-full object-contain pointer-events-none"
                            draggable={false}
                        />
                    );
                } else if (element.type === 'qrcode') {
                    elementContent = (
                        <div className="bg-white p-1 w-full h-full flex items-center justify-center">
                            <QRCode
                                value={element.content || 'https://example.com'}
                                size={element.width ? element.width * zoom : 64 * zoom}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    );
                } else if (element.type === 'shape') {
                    elementContent = (
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundColor: element.style.backgroundColor || 'transparent',
                                borderColor: element.style.borderColor || 'transparent',
                                borderWidth: element.style.borderWidth ? `${element.style.borderWidth}px` : 0,
                                borderRadius: element.style.borderRadius ? `${element.style.borderRadius}px` : (element.shapeType === 'circle' ? '50%' : 0),
                                borderStyle: 'solid',
                                boxShadow: element.style.boxShadow,
                            }}
                        />
                    );
                } else if (editingElementId === element.id) {
                    elementContent = (
                        <input
                            type="text"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            onBlur={handleEditBlur}
                            onKeyDown={handleEditKeyDown}
                            autoFocus
                            className="bg-transparent border border-primary outline-none px-1 w-full h-full"
                            style={{
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                                fontStyle: 'inherit',
                                color: 'inherit',
                                textAlign: 'inherit' as any,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    );
                } else {
                    // Text or Variable
                    elementContent = (
                        <div className="w-full h-full break-words" style={{ display: 'flex', alignItems: 'center', justifyContent: element.style.textAlign === 'center' ? 'center' : element.style.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                            {element.content}
                        </div>
                    );
                }

                return (
                    <Rnd
                        key={element.id}
                        size={{
                            width: (element.width || 300) * zoom,
                            height: (element.height || 50) * zoom
                        }}
                        position={{
                            x: element.x * zoom,
                            y: element.y * zoom
                        }}
                        onDragStart={(e) => {
                            e.stopPropagation();
                            onSelectElement(element.id);
                        }}
                        onDrag={(e, d) => {
                            const newGuides: {type: 'vertical'|'horizontal', position: number}[] = [];
                            const elWidth = element.width || 300;
                            const elHeight = element.height || 50;
                            const centerX = (d.x / zoom) + elWidth / 2;
                            const centerY = (d.y / zoom) + elHeight / 2;
                            
                            const canvasCenterX = config.canvas.width / 2;
                            const canvasCenterY = config.canvas.height / 2;

                            const TOLERANCE = 5; // px

                            // Canvas center snapping/guides
                            if (Math.abs(centerX - canvasCenterX) < TOLERANCE) {
                                newGuides.push({ type: 'vertical', position: canvasCenterX * zoom });
                            }
                            if (Math.abs(centerY - canvasCenterY) < TOLERANCE) {
                                newGuides.push({ type: 'horizontal', position: canvasCenterY * zoom });
                            }

                            // Element alignment guides (compare against other elements)
                            config.elements.forEach(otherEl => {
                                if (otherEl.id === element.id) return;
                                
                                const otherWidth = otherEl.width || 300;
                                const otherHeight = otherEl.height || 50;
                                const otherCenterX = otherEl.x + otherWidth / 2;
                                const otherCenterY = otherEl.y + otherHeight / 2;

                                if (Math.abs(centerX - otherCenterX) < TOLERANCE) {
                                    newGuides.push({ type: 'vertical', position: otherCenterX * zoom });
                                }
                                if (Math.abs(centerY - otherCenterY) < TOLERANCE) {
                                    newGuides.push({ type: 'horizontal', position: otherCenterY * zoom });
                                }
                            });

                            setGuides(newGuides);
                        }}
                        onDragStop={(e, d) => {
                            setGuides([]);
                            
                            // Snapping logic on drop
                            const elWidth = element.width || 300;
                            const elHeight = element.height || 50;
                            let finalX = d.x / zoom;
                            let finalY = d.y / zoom;
                            const centerX = finalX + elWidth / 2;
                            const centerY = finalY + elHeight / 2;
                            const TOLERANCE = 5;

                            const canvasCenterX = config.canvas.width / 2;
                            const canvasCenterY = config.canvas.height / 2;

                            if (Math.abs(centerX - canvasCenterX) < TOLERANCE) {
                                finalX = canvasCenterX - elWidth / 2;
                            }
                            if (Math.abs(centerY - canvasCenterY) < TOLERANCE) {
                                finalY = canvasCenterY - elHeight / 2;
                            }

                            onUpdateElement(element.id, { x: finalX, y: finalY });
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            onUpdateElement(element.id, {
                                width: parseFloat(ref.style.width) / zoom,
                                height: parseFloat(ref.style.height) / zoom,
                                x: position.x / zoom,
                                y: position.y / zoom
                            });
                        }}
                        bounds="parent"
                        className={cn(
                            "absolute select-none group",
                            isSelected ? "ring-2 ring-primary ring-offset-1 z-50" : "hover:ring-1 hover:ring-primary/50"
                        )}
                        style={{
                            fontFamily: element.style.fontFamily,
                            fontSize: (element.style.fontSize || 16) * zoom,
                            fontWeight: element.style.fontWeight,
                            fontStyle: element.style.fontStyle,
                            color: element.style.color,
                            textAlign: element.style.textAlign,
                            opacity: element.style.opacity,
                            textTransform: element.style.textTransform,
                            letterSpacing: element.style.letterSpacing ? `${element.style.letterSpacing}px` : undefined,
                            lineHeight: element.style.lineHeight,
                            textShadow: element.style.textShadow,
                            zIndex: element.zIndex || 1,
                        }}
                        onDoubleClick={(e: any) => handleDoubleClick(e, element)}
                        disableDragging={editingElementId === element.id}
                        enableResizing={isSelected}
                    >
                        {elementContent}
                    </Rnd>
                );
            })}

            {config.elements.length === 0 && !config.canvas.backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 select-none pointer-events-none">
                    <p>Drag and drop elements or upload a background</p>
                </div>
            )}
        </div>
    );
}
