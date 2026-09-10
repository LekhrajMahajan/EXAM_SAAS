$lines = Get-Content ".\src\modules\result\result.service.ts"
$out = @()
$inBlock = $false
for ($i=0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    
    if ($line -match "answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status\?: string; options\?: any\[\]; correctAnswer\?: any\[\]; questionType\?: string; marks\?: number; negativeMarks\?: number; }>,") {
        $out += '        answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status?: string; options?: any[]; correctAnswer?: any[]; questionType?: string; marks?: number; negativeMarks?: number; subjectId?: any; }>,'
    }
    elseif ($line -match "let marksForQ: number;" -and $i -gt 290 -and $i -lt 300) {
        $out += '            if (!subjCfg) {'
        $out += '                const pq = await mongoose.models.PaperQuestion?.findOne({ questionId: item.questionId }).lean() as any;'
        $out += '                if (pq && pq.sectionCode) {'
        $out += '                    const secCodeLower = String(pq.sectionCode).toLowerCase().trim();'
        $out += '                    for (const cfg of examSubjectConfigMap.values()) {'
        $out += '                        if (String(cfg.subjectName).toLowerCase().trim() === secCodeLower || String(cfg.subjectId).toLowerCase().trim() === secCodeLower) {'
        $out += '                            subjCfg = cfg; break;'
        $out += '                        }'
        $out += '                    }'
        $out += '                }'
        $out += '            }'
        $out += ''
        $out += '            let marksForQ: number;'
        $out += '            let penaltyForQ: number;'
        $out += '            let se: any = null;'
        $out += ''
        $out += '            if (subjCfg) {'
        $out += '                marksForQ = subjCfg.marksPerQuestion;'
        $out += '                penaltyForQ = subjCfg.negativeMarksPerQuestion;'
        $out += '                se = subjectBreakdownMap.get(String(subjCfg.subjectId));'
        $out += '            } else {'
        $out += '                marksForQ = (exam.marksPerQuestion !== undefined && exam.marksPerQuestion !== null && Number(exam.marksPerQuestion) > 0) ? Number(exam.marksPerQuestion) : (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marksPerQuestion : 1);'
        $out += '                penaltyForQ = (exam.negativeMarksPerQuestion !== undefined && exam.negativeMarksPerQuestion !== null) ? Number(exam.negativeMarksPerQuestion) : (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarksPerQuestion : 0);'
        $out += '                const firstSubId = subjectBreakdownMap.keys().next().value;'
        $out += '                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);'
        $out += '            }'
        
        $inBlock = $true # skip the original lines
    }
    elseif ($inBlock -and $line -match "if \(notAttempted\) \{") {
        $inBlock = $false
        $out += $line
    }
    elseif ($inBlock) {
        # skip lines inside the block
    }
    elseif ($line -match "return \{" -and $i -eq 478) {
        $out += '        return {'
        $out += '            totalQuestions: totalQuestionsConfig || (exam.totalQuestions || 0),'
    }
    elseif ($line -match "marks: isCorrect \? \(question\?\.subjectId" -and $i -gt 1700 -and $i -lt 1730) {
        $out += '                    marks: isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : (Number(examObj?.marksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marks : 1))) : 0,'
    }
    elseif ($line -match "negativeMarks: \(!isCorrect && answer.isAnswered\) \?" -and $i -gt 1700 -and $i -lt 1730) {
        $out += '                    negativeMarks: (!isCorrect && answer.isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : (Number(examObj?.negativeMarksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarks : 0))) : 0'
    }
    elseif ($line -match "marks = isCorrect \? \(question\?\.subjectId" -and $i -gt 1760) {
        $out += '                     const fallbackMarks = Number(examObj?.marksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marks : 1);'
        $out += '                     marks = isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : fallbackMarks) : 0;'
    }
    elseif ($line -match "negativeMarks = \(!isCorrect && isAnswered\) \?" -and $i -gt 1760) {
        $out += '                     const fallbackNegMarks = Number(examObj?.negativeMarksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarks : 0);'
        $out += '                     negativeMarks = (!isCorrect && isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : fallbackNegMarks) : 0;'
    }
    else {
        $out += $line
    }
}
$out | Set-Content ".\src\modules\result\result.service.ts"
