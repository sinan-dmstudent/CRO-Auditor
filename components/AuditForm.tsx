"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface AuditFormProps {
    onAudit: (url: string) => void;
    isLoading: boolean;
}

export function AuditForm({ onAudit, isLoading }: AuditFormProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        // 1. Strip protocol for validation
        const cleanUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

        // 2. Strict Domain Regex
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;

        if (!domainRegex.test(cleanUrl)) {
            setError("Invalid URL");
            return;
        }

        setError(null);
        // Auto-prepend https:// if missing
        let finalUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            finalUrl = `https://${url}`;
        }

        onAudit(finalUrl);
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <form onSubmit={handleSubmit} className={`flex w-full flex-col gap-4 sm:flex-row shadow-sm p-1 rounded-lg border transition-all ${error ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-transparent"}`}>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Enter store URL (e.g. brand.com)"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        disabled={isLoading}
                        className="h-12 w-full pl-10 text-base"
                        autoFocus
                    />
                </div>
                <Button type="submit" size="lg" disabled={isLoading} className="h-12 px-8 font-semibold">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Audit Store"
                    )}
                </Button>
            </form>
            {error && (
                <div className="text-red-500 text-sm font-bold pl-2">
                    {error} - Please enter a valid domain (e.g. brand.com)
                </div>
            )}
        </div>
    );
}
