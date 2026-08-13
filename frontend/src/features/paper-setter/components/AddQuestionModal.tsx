import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import api from "@/services/api";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: string;
  subjectName: string;
  onSuccess: () => void;
  editData?: any;
}

export function AddQuestionModal({ isOpen, onClose, paperId, subjectName, onSuccess, editData }: AddQuestionModalProps) {
  const q = editData?.questionId || editData;
  const initialText = q?.question || q?.text || "";
  
  const initialOptionsArr = ["", "", "", "", ""];
  let initialCorrectIdx: number | null = null;
  
  if (q?.options) {
    q.options.forEach((opt: any, index: number) => {
       const mappedIndex = opt.optionId ? opt.optionId.charCodeAt(0) - 65 : index;
       if (mappedIndex >= 0 && mappedIndex < 5) {
         initialOptionsArr[mappedIndex] = opt.optionText || opt.text || "";
         if (opt.isCorrect) {
           initialCorrectIdx = mappedIndex;
         }
       }
    });
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionText, setQuestionText] = useState(initialText);
  const [questionType, setQuestionType] = useState("MCQ");
  
  // 5 Fixed options A, B, C, D, E
  const [options, setOptions] = useState(initialOptionsArr);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(initialCorrectIdx);

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
    
    // If we clear the text of the currently selected correct option, deselect it
    if (!text.trim() && correctOptionIndex === index) {
      setCorrectOptionIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return alert("Question text is required");
    
    // Filter out empty options
    const filledOptions = options.map((text, i) => ({ text: text.trim(), originalIndex: i })).filter(o => o.text !== "");
    
    if (![2, 4, 5].includes(filledOptions.length)) {
      return alert("You must provide exactly 2, 4, or 5 options.");
    }
    
    if (correctOptionIndex === null || !options[correctOptionIndex].trim()) {
      return alert("Please select a valid correct option.");
    }

    try {
      setIsSubmitting(true);
      
      const payloadOptions = filledOptions.map(o => ({
        optionId: String.fromCharCode(65 + o.originalIndex),
        optionLabel: String.fromCharCode(65 + o.originalIndex),
        optionText: o.text,
        isCorrect: o.originalIndex === correctOptionIndex
      }));

      const payload = {
        questionType: "SINGLE_CHOICE",
        question: questionText,
        options: payloadOptions,
        subjectName,
        difficulty: "MEDIUM",
        isMandatory: true,
      };

      if (editData) {
        const questionId = editData.questionId?._id || editData.questionId || editData._id;
        await api.patch(`/papers/${paperId}/questions/${questionId}`, payload);
      } else {
        await api.post(`/papers/${paperId}/questions`, payload);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${editData ? 'update' : 'add'} question`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Question' : 'Add Question'} - {subjectName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          <div className="space-y-2">
            <Label>Question Type</Label>
            <RadioGroup defaultValue={questionType} onValueChange={setQuestionType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MCQ" id="mcq" />
                <Label htmlFor="mcq">Multiple Choice (Single Correct)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Question Text</Label>
            <Input 
              placeholder="Enter question text here..." 
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Options (Fill 2, 4, or 5 options)</Label>
            </div>
            
            <div className="space-y-3">
              {options.map((opt, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${correctOptionIndex === index ? 'border-green-500 bg-green-50/10' : 'border-border'}`}>
                  <input 
                    type="radio" 
                    name="correct-option" 
                    checked={correctOptionIndex === index}
                    onChange={() => setCorrectOptionIndex(index)}
                    disabled={!opt.trim()} // disable if empty
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <Input 
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
