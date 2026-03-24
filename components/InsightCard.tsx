import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InsightCardProps {
    section: string;
    severity: "High" | "Medium" | "Low";
    description: string;
    actionable_step: string;
}

export function InsightCard({ section, severity, description, actionable_step }: InsightCardProps) {
    // Determine badge variant based on severity
    const getBadgeVariant = (sev: string) => {
        switch (sev) {
            case "High": return "destructive";
            case "Medium": return "default"; // Primary/Black
            case "Low": return "secondary"; // Gray
            default: return "outline";
        }
    };

    return (
        <Card className={cn(
            "h-full overflow-hidden transition-all hover:shadow-md",
            severity === "High" ? "border-l-4 border-l-red-500" :
                severity === "Medium" ? "border-l-4 border-l-black" : // or yellow
                    "border-l-4 border-l-gray-300"
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section}
                </CardTitle>
                <Badge variant={getBadgeVariant(severity)}>{severity}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    {description.split('\n').map((line, i) => (
                        <p key={i} className="text-sm text-foreground leading-relaxed">
                            {line}
                        </p>
                    ))}
                </div>
                <div className="bg-muted/40 p-3 rounded-md text-sm text-foreground/90">
                    <span className="font-bold block mb-2 text-primary">💡 Solution</span>
                    {actionable_step.split('\n').map((line, i) => (
                        <p key={i} className="leading-relaxed">
                            {line}
                        </p>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
