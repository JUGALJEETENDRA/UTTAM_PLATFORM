import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { fetchGAS } from "@/lib/apiClient";

export function useViewerData() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId') || '';
  const moduleId = searchParams.get('moduleId') || '';
  const subtopicId = searchParams.get('subtopicId') || '';

  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState("Subject");
  const [moduleData, setModuleData] = useState<any>(null);

  useEffect(() => {
    if (subjectId && moduleId) {
      const loadData = async () => {
        try {
          const [modResult, subjectsResult] = await Promise.all([
            fetchGAS("getModule", { moduleId, userId: "anonymous" }),
            fetchGAS("getSubjects")
          ]);
          
          if (Array.isArray(subjectsResult)) {
            const sub = subjectsResult.find(s => s.id === subjectId);
            if (sub) setSubjectName(sub.name || "Subject");
          }
          
          if (modResult && modResult.subtopics) {
            modResult.subtopics = modResult.subtopics.filter((st: any) => st.isVisible !== false);
          }
          setModuleData(modResult);
        } catch (err) {
          console.error("Failed to load viewer data:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [subjectId, moduleId]);

  const activeSubtopicIndex = useMemo(() => {
    if (!moduleData?.subtopics || !subtopicId) return -1;
    return moduleData.subtopics.findIndex((st: any) => st.id === subtopicId);
  }, [moduleData, subtopicId]);

  const activeSubtopic = activeSubtopicIndex !== -1 ? moduleData.subtopics[activeSubtopicIndex] : null;

  return {
    subjectId,
    moduleId,
    subtopicId,
    loading,
    subjectName,
    moduleData,
    activeSubtopicIndex,
    activeSubtopic
  };
}
