import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';


// Setup PDF worker
import 'pdfjs-dist/build/pdf.worker.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PDFFlipbookProps {
    pdfUrl: string;
}

export default function PDFFlipbook({ pdfUrl }: PDFFlipbookProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div className="w-full flex flex-col items-center gap-4 bg-slate-100 p-8 rounded-xl shadow-inner min-h-[600px] justify-center relative">

            {/* Controls */}
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
                    <HTMLFlipBook
                        width={400 * scale}
                        height={570 * scale} // A4 aspect ratio roughly
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
                        usePortrait={false} // Double page view on desktop
                        startZIndex={0}
                        autoSize={true}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={true}
                        disableFlipByClick={false}
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <div key={`page_${index + 1}`} className="bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="h-full w-full relative">
                                    <Page
                                        pageNumber={index + 1}
                                        width={400 * scale}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                        className="h-full w-full object-contain"
                                    />
                                    <div className="absolute bottom-2 w-full text-center text-[10px] text-gray-400">
                                        Page {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </HTMLFlipBook>
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
