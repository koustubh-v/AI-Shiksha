import React from "react";

interface CertificatePreviewProps {
    templateConfig: {
        layout?: string;
        background_color?: string;
        background_image_url?: string;
        border_style?: string;
        border_color?: string;
        title_text?: string;
        title_font?: string;
        title_color?: string;
        body_font?: string;
        body_color?: string;
        logo_url?: string;
        signature_slots?: Array<{
            name: string;
            title: string;
            signature_image_url?: string;
        }>;
    };
    studentName?: string;
    courseName?: string;
    completionDate?: string;
    className?: string;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
    templateConfig,
    studentName = "John Doe",
    courseName = "Sample Course",
    completionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }),
    className = "",
}) => {
    const {
        layout = "classic",
        background_color = "#ffffff",
        background_image_url,
        border_style = "double",
        border_color = "#000000",
        title_text = "Certificate of Completion",
        title_font = "Georgia",
        title_color = "#1a1a1a",
        body_font = "Arial",
        body_color = "#333333",
        logo_url,
        signature_slots = [],
    } = templateConfig;

    const getBorderWidth = () => {
        switch (border_style) {
            case "double":
                return "8px";
            case "solid":
                return "4px";
            case "dashed":
                return "3px";
            case "none":
                return "0";
            default:
                return "4px";
        }
    };

    const layoutStyles = {
        classic: "py-16 px-12",
        modern: "py-12 px-16",
        elegant: "py-20 px-14",
    };

    return (
        <div
            className={`relative w-full aspect-[1.414/1] ${className}`}
            style={{
                backgroundColor: background_color,
                backgroundImage: background_image_url ? `url(${background_image_url})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderStyle: border_style === "none" ? "none" : border_style,
                borderWidth: getBorderWidth(),
                borderColor: border_color,
            }}
        >
            <div className={`flex flex-col items-center justify-center h-full ${layoutStyles[layout as keyof typeof layoutStyles] || layoutStyles.classic}`}>
                {/* Logo */}
                {logo_url && (
                    <div className="mb-8">
                        <img src={logo_url} alt="Logo" className="h-16 w-auto object-contain" />
                    </div>
                )}

                {/* Title */}
                <h1
                    className="text-4xl md:text-5xl font-bold mb-8 text-center"
                    style={{
                        fontFamily: title_font,
                        color: title_color,
                    }}
                >
                    {title_text}
                </h1>

                {/* Decorative line */}
                <div
                    className="w-32 h-1 mb-8"
                    style={{ backgroundColor: border_color }}
                />

                {/* Body text */}
                <div
                    className="text-center space-y-4 mb-8"
                    style={{
                        fontFamily: body_font,
                        color: body_color,
                    }}
                >
                    <p className="text-lg">This is to certify that</p>
                    <p className="text-3xl md:text-4xl font-bold my-4">{studentName}</p>
                    <p className="text-lg">has successfully completed</p>
                    <p className="text-2xl md:text-3xl font-semibold my-4">{courseName}</p>
                    <p className="text-base mt-6">on {completionDate}</p>
                </div>

                {/* Signatures */}
                {signature_slots.length > 0 && (
                    <div className="flex justify-around w-full mt-12 gap-8">
                        {signature_slots.map((slot, index) => (
                            <div key={index} className="text-center">
                                {slot.signature_image_url && (
                                    <img
                                        src={slot.signature_image_url}
                                        alt={`${slot.name} signature`}
                                        className="h-12 w-auto mx-auto mb-2"
                                    />
                                )}
                                <div
                                    className="border-t-2 pt-2 min-w-[150px]"
                                    style={{ borderColor: border_color }}
                                >
                                    <p className="font-semibold" style={{ fontFamily: body_font, color: body_color }}>
                                        {slot.name}
                                    </p>
                                    <p className="text-sm opacity-70" style={{ fontFamily: body_font, color: body_color }}>
                                        {slot.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
