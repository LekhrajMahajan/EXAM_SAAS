var fso = new ActiveXObject("Scripting.FileSystemObject");
var ForReading = 1;
var ForWriting = 2;
var ts = fso.OpenTextFile("src/modules/result/result.service.ts", ForReading);
var content = ts.ReadAll();
ts.Close();

// 1. Line 191
content = content.replace(
    /answerItems: Array<\{ questionId: string; candidateAnswer: any; isAnswered: boolean; status\?: string; options\?: any\[\]; correctAnswer\?: any\[\]; questionType\?: string; marks\?: number; negativeMarks\?: number; \}>,/,
    'answerItems: Array<{ questionId: string; candidateAnswer: any; isAnswered: boolean; status?: string; options?: any[]; correctAnswer?: any[]; questionType?: string; marks?: number; negativeMarks?: number; subjectId?: any; }>,'
);

// 2. Lines 291-311 (handling both \n and \r\n to be safe)
var target2 = '            const subIdStr = question.subjectId ? String(question.subjectId) : "";\n' +
'            let subjCfg = subIdStr ? examSubjectConfigMap.get(subIdStr) : undefined;\n\n' +
'            // Fallback: if no subject config found (embedded questions have no subjectId),\n' +
'            // use the per-item marks or the first subject config as default\n' +
'            let marksForQ: number;\n' +
'            let penaltyForQ: number;\n' +
'            let se: any = null;\n\n' +
'            if (subjCfg) {\n' +
'                marksForQ = subjCfg.marksPerQuestion;\n' +
'                penaltyForQ = subjCfg.negativeMarksPerQuestion;\n' +
'                se = subjectBreakdownMap.get(subIdStr);\n' +
'            } else {\n' +
'                // Use marks embedded in the answer item, or fall back to exam-level defaults\n' +
'                marksForQ = (item.marks !== undefined && item.marks !== null) ? Number(item.marks) : (exam.marksPerQuestion || 1);\n' +
'                penaltyForQ = (item.negativeMarks !== undefined && item.negativeMarks !== null) ? Number(item.negativeMarks) : (exam.negativeMarksPerQuestion || 0);\n' +
'                // Try to assign to the first subject breakdown entry for aggregation\n' +
'                const firstSubId = subjectBreakdownMap.keys().next().value;\n' +
'                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);\n' +
'            }';
target2 = target2.replace(/\n/g, '\r\n'); // ensure CRLF since file is likely CRLF

var target2LF = target2.replace(/\r\n/g, '\n');

var replacement2 = '            const subIdStr = question.subjectId ? String(question.subjectId) : "";\r\n' +
'            let subjCfg = subIdStr ? examSubjectConfigMap.get(subIdStr) : undefined;\r\n\r\n' +
'            if (!subjCfg) {\r\n' +
'                const pq = await mongoose.models.PaperQuestion?.findOne({ questionId: item.questionId }).lean() as any;\r\n' +
'                if (pq && pq.sectionCode) {\r\n' +
'                    const secCodeLower = String(pq.sectionCode).toLowerCase().trim();\r\n' +
'                    for (const cfg of examSubjectConfigMap.values()) {\r\n' +
'                        if (String(cfg.subjectName).toLowerCase().trim() === secCodeLower || String(cfg.subjectId).toLowerCase().trim() === secCodeLower) {\r\n' +
'                            subjCfg = cfg; break;\r\n' +
'                        }\r\n' +
'                    }\r\n' +
'                }\r\n' +
'            }\r\n\r\n' +
'            let marksForQ: number;\r\n' +
'            let penaltyForQ: number;\r\n' +
'            let se: any = null;\r\n\r\n' +
'            if (subjCfg) {\r\n' +
'                marksForQ = subjCfg.marksPerQuestion;\r\n' +
'                penaltyForQ = subjCfg.negativeMarksPerQuestion;\r\n' +
'                se = subjectBreakdownMap.get(String(subjCfg.subjectId));\r\n' +
'            } else {\r\n' +
'                marksForQ = (exam.marksPerQuestion !== undefined && exam.marksPerQuestion !== null && Number(exam.marksPerQuestion) > 0) ? Number(exam.marksPerQuestion) : (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marksPerQuestion : 1);\r\n' +
'                penaltyForQ = (exam.negativeMarksPerQuestion !== undefined && exam.negativeMarksPerQuestion !== null) ? Number(exam.negativeMarksPerQuestion) : (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarksPerQuestion : 0);\r\n' +
'                const firstSubId = subjectBreakdownMap.keys().next().value;\r\n' +
'                if (firstSubId) se = subjectBreakdownMap.get(firstSubId);\r\n' +
'            }';
if (content.indexOf(target2) !== -1) {
    content = content.replace(target2, replacement2);
} else {
    content = content.replace(target2LF, replacement2);
}

// 3. Line 479
content = content.replace(
    /return \{\r?\n            attemptedQuestions,/,
    'return {\r\n            totalQuestions: totalQuestionsConfig || (exam.totalQuestions || 0),\r\n            attemptedQuestions,'
);

// 4. Lines 1718-1720
content = content.replace(
    /marks: isCorrect \? \(question\?\.subjectId && examSubjectConfigMap\.has\(String\(question\.subjectId\)\) \? examSubjectConfigMap\.get\(String\(question\.subjectId\)\)\.marks : 0\) : 0,\r?\n                    negativeMarks: \(!isCorrect && answer\.isAnswered\) \? \(question\?\.subjectId && examSubjectConfigMap\.has\(String\(question\.subjectId\)\) \? examSubjectConfigMap\.get\(String\(question\.subjectId\)\)\.negativeMarks : 0\) : 0/,
    'marks: isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : (Number(examObj?.marksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marks : 1))) : 0,\r\n                    negativeMarks: (!isCorrect && answer.isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : (Number(examObj?.negativeMarksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarks : 0))) : 0'
);

// 5. Lines 1773-1776
content = content.replace(
    /if \(isAnswered\) \{\r?\n                     marks = isCorrect \? \(question\?\.subjectId && examSubjectConfigMap\.has\(String\(question\.subjectId\)\) \? examSubjectConfigMap\.get\(String\(question\.subjectId\)\)\.marks : 0\) : 0;\r?\n                     negativeMarks = \(!isCorrect && isAnswered\) \? \(question\?\.subjectId && examSubjectConfigMap\.has\(String\(question\.subjectId\)\) \? examSubjectConfigMap\.get\(String\(question\.subjectId\)\)\.negativeMarks : 0\) : 0;\r?\n                \}/,
    'if (isAnswered) {\r\n                     const fallbackMarks = Number(examObj?.marksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].marks : 1);\r\n                     const fallbackNegMarks = Number(examObj?.negativeMarksPerQuestion) || (examSubjectConfigMap.size > 0 ? Array.from(examSubjectConfigMap.values())[0].negativeMarks : 0);\r\n                     marks = isCorrect ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).marks : fallbackMarks) : 0;\r\n                     negativeMarks = (!isCorrect && isAnswered) ? (question?.subjectId && examSubjectConfigMap.has(String(question.subjectId)) ? examSubjectConfigMap.get(String(question.subjectId)).negativeMarks : fallbackNegMarks) : 0;\r\n                }'
);

ts = fso.OpenTextFile("src/modules/result/result.service.ts", ForWriting);
ts.Write(content);
ts.Close();
WScript.Echo("Done");
