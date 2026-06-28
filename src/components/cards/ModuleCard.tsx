import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ChevronRight } from "lucide-react";

export interface ModuleWithSubtopics {
  id: string;
  co: string;
  title: string;
  description: string;
  hours: number;
  subtopics: {
    id: string;
  }[];
  xpEarned?: number;
  totalXpAvailable?: number;
}

export function ModuleCard({ module, href }: { module: ModuleWithSubtopics; href: string }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-zinc-200">
      <CardHeader>
        <div className="flex justify-start items-start mb-2">
          <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 whitespace-normal h-auto py-1 text-left">
            {module.co}
          </Badge>
        </div>
        <CardTitle className="text-xl line-clamp-2">{module.title}</CardTitle>
        <CardDescription className="line-clamp-2">{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex items-center space-x-4 text-sm text-zinc-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{module.hours} Hours</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{module.subtopics.length} Subtopics</span>
          </div>
        </div>


      </CardContent>
      <CardFooter className="pt-4 border-t border-zinc-100 mt-auto">
        <Link href={href} className="w-full flex items-center justify-between text-primary font-medium hover:text-primary/80 transition-colors">
          <span>View Module</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
