import Link from "next/link";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@deftai/deft-components";
import type { Subfeature } from "@/mocks/feature-page";

type SubfeaturePanelProps = {
  subfeatures: Subfeature[];
  shouldSuggestSplit: boolean;
  splitConfirmed: boolean;
  parentComplete: boolean;
  onConfirmSplit: () => void;
};

export function SubfeaturePanel({
  subfeatures,
  shouldSuggestSplit,
  splitConfirmed,
  parentComplete,
  onConfirmSplit,
}: SubfeaturePanelProps) {
  return (
    <Card aria-label="Subfeature orchestration">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Subfeatures</CardTitle>
        <Badge variant={parentComplete ? "success" : "outline"}>
          Parent {parentComplete ? "complete" : "incomplete"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {shouldSuggestSplit && !splitConfirmed ? (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Complexity threshold reached</p>
            <p className="mt-1">
              Split this feature into subfeatures to reduce implementation risk.
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onConfirmSplit}>
              Confirm split suggestion
            </Button>
          </div>
        ) : null}

        <ul className="space-y-2">
          {subfeatures.map((subfeature) => (
            <li key={subfeature.id} className="rounded-md border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {subfeature.title} {subfeature.required ? "(Required)" : "(Optional)"}
                </p>
                <Badge variant={subfeature.completed ? "success" : "outline"}>
                  {subfeature.completed ? "Complete" : "Open"}
                </Badge>
              </div>
              <Link
                href={subfeature.route}
                className="mt-1 inline-flex text-xs font-semibold text-accent hover:underline"
              >
                Open subfeature
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
