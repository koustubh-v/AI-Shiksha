import { useState, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const options = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    wasmUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/wasm/`,
};

const RENDER_WINDOW = 4;

interface PDFFlipbookProps {
    pdfUrl: string;
    onReachEnd?: () => void;
}

export default function PDFFlipbook({ pdfUrl, onReachEnd }: PDFFlipbookProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const onFlip = useCallback((e: any) => {
        setCurrentPage(e.data);
        if (e.data >= numPages - 2 && onReachEnd) {
            // Trigger onReachEnd if they reached the last or second to last page (since it's a 2-page spread)
            onReachEnd();
        }
    }, [numPages, onReachEnd]);

    const shouldRender = (index: number) =>
        Math.abs(index - currentPage) <= RENDER_WINDOW;

    return (
        <div className="w-full flex flex-col items-center gap-4 bg-slate-100 p-8 rounded-xl shadow-inner min-h-[600px] justify-center relative">

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 p-2 rounded-lg shadow-sm backdrop-blur-sm">
                <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.1))} title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(2, s + 0.1))} title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                </Button>
            </div>

            <Document
                file={pdfUrl}
                options={options}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-muted-foreground animate-pulse">Loading Book...</span>
                    </div>
                }
                error={
                    <div className="text-red-500 font-medium">
                        Unable to load PDF. Please check the URL or try downloading it.
                    </div>
                }
                className="flex justify-center"
            >
                {numPages > 0 && (
                <div className="w-full max-w-[100vw] overflow-auto flex justify-center py-4 hide-scrollbar">
                    <HTMLFlipBook
                        width={400 * scale}
                        height={570 * scale}
                        size="fixed"
                        minWidth={300}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1414}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        className="shadow-2xl"
                        style={{ margin: '0 auto' }}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={1000}
                        usePortrait={true}
                        startZIndex={0}
                        autoSize={true}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={true}
                        disableFlipByClick={false}
                        onFlip={onFlip}
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <div key={`page_${index + 1}`} className="bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="h-full w-full relative">
                                    {shouldRender(index) ? (
                                        <Page
                                            pageNumber={index + 1}
                                            width={400 * scale}
                                            devicePixelRatio={typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio) : 1}
                                            renderAnnotationLayer={true}
                                            renderTextLayer={true}
                                            className="h-full w-full object-contain bg-white"
                                        />
                                    ) : (
                                        <div
                                            className="bg-white"
                                            style={{ width: 400 * scale, height: 570 * scale }}
                                        />
                                    )}
                                    <div className="absolute bottom-2 w-full text-center text-[10px] text-gray-400 pointer-events-none">
                                        Page {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </HTMLFlipBook>
                </div>
                )}
            </Document>

            {numPages > 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                    Click page corners or drag to flip • {numPages} Pages
                </p>
            )}
        </div>
    );
}
