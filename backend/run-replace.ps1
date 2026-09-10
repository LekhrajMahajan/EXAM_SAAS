$content = Get-Content ".\src\modules\result\result.service.ts" -Raw

# 1. Update line 191
$target1 = 'answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status?: string; options?: any[]; correctAnswer?: any[]; questionType?: string; marks?: number; negativeMarks?: number; }>,'
$rep1 = 'answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status?: string; options?: any[]; correctAnswer?: any[]; questionType?: string; marks?: number; negativeMarks?: number; subjectId?: any; }>,'
$content = $content.Replace($target1, $rep1)

# 2. Block 291-311
$target2 = '            const subIdStr = question.subjectId ? String(question.subjectId) : "";
            let subjCfg = subIdStr ? examSubjectConfigMap.get(subIdStr) : undefined;

            // Fallback: if no subject config found (embedded questions have no subjectId),
            // use the per-item marks or the first subject config as default
            let marksForQ: number;
            let penaltyForQ: number;
            let se: any = null;

            if (subjCfg) {
                marksForQ = subjCfg.marksPerQuestion;
                penaltyForQ = subjCfg.negativeMarksPerQuestion;
                se = subjectBreakdownMap.get(subIdStr);
            } else {
                // Use marks embedded in the answer item, or fall back to exam-level defaults
                marksForQ = (item.marks !== undefined && item.marks !== null) ? Number(item.marks) : (exam.marksPerQuestion || 1);
                penaltyForQ = (item.negativeMarks !== undefined && item.negativeMarks !== null) ? Number(item.negativeMarks) : (exam.negativeMarksPerQuestion || 0);
                // Try to assign to the first subject breakdown entry for aggregation
                const firstSubId = subjectBreakdownMap.keys().next().value;
                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);
            }'
$rep2 = '            const subIdStr = question.subjectId ? String(question.subjectId) : "";
            let subjCfg = subIdStr ? examSubjectConfigMap.get(subIdStr) : undefined;

            if (!subjCfg) {
                const pq = await mongoose.models.PaperQuestion?.findOne({ questionId: item.questionId }).lean() as any;
                if (pq && pq.sectionCode) {
                    const secCodeLower = String(pq.sectionCode).toLowerCase().trim();
                    for (const cfg of examSubjectConfigMap.values()) {
                        if (String(cfg.subjectName).toLowerCase().trim() === secCodeLower || String(cfg.subjectId).toLowerCase().trim() === secCodeLower) {
                            subjCfg = cfg; break;
                        }
                    }
                }
            }

            let marksForQ: number;
            let penaltyForQ: number;
            let se: any = null;

            if (subjCfg) {
                marksForQ = subjCfg.marksPerQuestion;
                penaltyForQ = subjCfg.negativeMarksPerQuestion;
                se = subjectBreakdownMap.get(String(subjCfg.subjectId));
            } else {
                marksForQ = (exam.marksPerQuestion !== undefined && exam.marksPerQuestion !== null && Number(exam.marksPerQuestion) > 0) ? Number(exam.marksPerQuestion) : (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marksPerQuestion : 1);
                penaltyForQ = (exam.negativeMarksPerQuestion !== undefined && exam.negativeMarksPerQuestion !== null) ? Number(exam.negativeMarksPerQuestion) : (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarksPerQuestion : 0);
                const firstSubId = subjectBreakdownMap.keys().next().value;
                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);
            }'
$content = $content.Replace($target2, $rep2)
$content = $content.Replace($target2.Replace("`r`n", "`n"), $rep2)

# 3. Line 479
$target3 = '        return {
            attemptedQuestions,'
$rep3 = '        return {
            totalQuestions: totalQuestionsConfig || (exam.totalQuestions || 0),
            attemptedQuestions,'
$content = $content.Replace($target3, $rep3)
$content = $content.Replace($target3.Replace("`r`n", "`n"), $rep3)

# 4. Lines 1718-1720
$target4 = '                    marks: isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : 0) : 0,
                    negativeMarks: (!isCorrect && answer.isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : 0) : 0'
$rep4 = '                    marks: isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : (Number(examObj?.marksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marks : 1))) : 0,
                    negativeMarks: (!isCorrect && answer.isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : (Number(examObj?.negativeMarksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarks : 0))) : 0'
$content = $content.Replace($target4, $rep4)
$content = $content.Replace($target4.Replace("`r`n", "`n"), $rep4)

# 5. Lines 1773-1776
$target5 = '                if (isAnswered) {
                     marks = isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : 0) : 0;
                     negativeMarks = (!isCorrect && isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : 0) : 0;
                }'
$rep5 = '                if (isAnswered) {
                     const fallbackMarks = Number(examObj?.marksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marks : 1);
                     const fallbackNegMarks = Number(examObj?.negativeMarksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarks : 0);
                     marks = isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : fallbackMarks) : 0;
                     negativeMarks = (!isCorrect && isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : fallbackNegMarks) : 0;
                }'
$content = $content.Replace($target5, $rep5)
$content = $content.Replace($target5.Replace("`r`n", "`n"), $rep5)

Set-Content -Path ".\src\modules\result\result.service.ts" -Value $content
