import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/providers/ConfirmProvider";
import { Loader2, Settings, ListChecks, MessageSquare, Shield, Clock, Send, Award, Save, RefreshCw } from "lucide-react";
import {
  useExamSettings,
  useUpdateExamSettings,
  useResetExamSettings,
} from "../../hooks/system-settings.hooks";

export const ExamConfigurationPage = () => {
  const { toast } = useToast();
  const confirm = useConfirm();

  const { data: settingsData, isLoading: isLoadingSettings } = useExamSettings();
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateExamSettings();
  const { mutateAsync: resetSettings, isPending: isResetting } = useResetExamSettings();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [prevSettingsData, setPrevSettingsData] = useState<any>(null);

  if (settingsData !== prevSettingsData) {
    setPrevSettingsData(settingsData);
    if (settingsData?.data) {
      const initialData: Record<string, any> = {};
      settingsData.data.forEach((setting) => {
        initialData[setting.key] = setting.value;
      });
      setFormData(initialData);
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(formData);
      toast({ title: "Success", description: "Exam configurations updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update configurations.", variant: "destructive" });
    }
  };

  const handleReset = async () => {
    if (await confirm("Are you sure you want to restore default exam configurations? This action cannot be undone.")) {
      try {
        await resetSettings();
        toast({ title: "Success", description: "Configurations restored to defaults." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to restore configurations.", variant: "destructive" });
      }
    }
  };

  const handleToggle = async (key: string, checked: boolean, title: string) => {
    handleChange(key, checked);
    try {
      await updateSettings({ [key]: checked });
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch (error) {
      handleChange(key, !checked);
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
    }
  };

  const handleBlur = async (key: string, title: string) => {
    const value = formData[key];
    try {
      await updateSettings({ [key]: value });
      toast({ title: "Success", description: `${title} updated successfully.` });
    } catch (error) {
      toast({ title: "Error", description: `Failed to update ${title.toLowerCase()}.`, variant: "destructive" });
    }
  };

  const cardStyle = "border border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card text-card-foreground";

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Exam Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure system-wide defaults and policies for all examinations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border hover:border-primary hover:bg-primary hover:text-secondary transition-colors" onClick={handleReset} disabled={isResetting || isUpdating}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restore Defaults
          </Button>
          <Button 
            variant="outline"
            onClick={handleSave} 
            disabled={isUpdating || isResetting}
            className="border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="general"><Settings className="w-4 h-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="question"><ListChecks className="w-4 h-4 mr-2" />Question</TabsTrigger>
          <TabsTrigger value="answer"><MessageSquare className="w-4 h-4 mr-2" />Answer</TabsTrigger>
          <TabsTrigger value="proctoring"><Shield className="w-4 h-4 mr-2" />Proctoring</TabsTrigger>
          <TabsTrigger value="start"><Clock className="w-4 h-4 mr-2" />Start Settings</TabsTrigger>
          <TabsTrigger value="submission"><Send className="w-4 h-4 mr-2" />Submission</TabsTrigger>
          <TabsTrigger value="result"><Award className="w-4 h-4 mr-2" />Result</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>General Exam Settings</CardTitle>
              <CardDescription>Configure baseline bounds for exam durations and marks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Default Exam Duration (mins)</Label>
                  <Input type="number" value={formData.EXAM_DEFAULT_DURATION || ""} onChange={(e) => handleChange("EXAM_DEFAULT_DURATION", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_DEFAULT_DURATION", "Default Exam Duration")} />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Exam Duration (mins)</Label>
                  <Input type="number" value={formData.EXAM_MIN_DURATION || ""} onChange={(e) => handleChange("EXAM_MIN_DURATION", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_MIN_DURATION", "Minimum Exam Duration")} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Exam Duration (mins)</Label>
                  <Input type="number" value={formData.EXAM_MAX_DURATION || ""} onChange={(e) => handleChange("EXAM_MAX_DURATION", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_MAX_DURATION", "Maximum Exam Duration")} />
                </div>
                <div className="space-y-2">
                  <Label>Default Passing Percentage (%)</Label>
                  <Input type="number" value={formData.EXAM_DEFAULT_PASSING_PERCENTAGE || ""} onChange={(e) => handleChange("EXAM_DEFAULT_PASSING_PERCENTAGE", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_DEFAULT_PASSING_PERCENTAGE", "Default Passing Percentage")} />
                </div>
                <div className="space-y-2">
                  <Label>Default Total Marks</Label>
                  <Input type="number" value={formData.EXAM_DEFAULT_TOTAL_MARKS || ""} onChange={(e) => handleChange("EXAM_DEFAULT_TOTAL_MARKS", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_DEFAULT_TOTAL_MARKS", "Default Total Marks")} />
                </div>
                <div className="space-y-2">
                  <Label>Default Negative Marking</Label>
                  <Input type="number" step="0.25" value={formData.EXAM_DEFAULT_NEGATIVE_MARKING || ""} onChange={(e) => handleChange("EXAM_DEFAULT_NEGATIVE_MARKING", parseFloat(e.target.value))} onBlur={() => handleBlur("EXAM_DEFAULT_NEGATIVE_MARKING", "Default Negative Marking")} />
                </div>
                <div className="space-y-2">
                  <Label>Default Grace Marks</Label>
                  <Input type="number" value={formData.EXAM_DEFAULT_GRACE_MARKS || ""} onChange={(e) => handleChange("EXAM_DEFAULT_GRACE_MARKS", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_DEFAULT_GRACE_MARKS", "Default Grace Marks")} />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={formData.EXAM_DEFAULT_LANGUAGE || ""} onValueChange={(v) => { handleChange("EXAM_DEFAULT_LANGUAGE", v); setTimeout(() => handleBlur("EXAM_DEFAULT_LANGUAGE", "Default Language"), 0); }}>
                    <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="question" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Question Settings</CardTitle>
              <CardDescription>Configure how questions are presented and navigated.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Questions Per Page</Label>
                  <Input type="number" value={formData.QUESTIONS_PER_PAGE || ""} onChange={(e) => handleChange("QUESTIONS_PER_PAGE", parseInt(e.target.value))} onBlur={() => handleBlur("QUESTIONS_PER_PAGE", "Questions Per Page")} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "SHUFFLE_QUESTIONS", label: "Shuffle Questions" },
                  { key: "SHUFFLE_OPTIONS", label: "Shuffle Options" },
                  { key: "RANDOMIZE_QUESTION_ORDER", label: "Randomize Question Order" },
                  { key: "ALLOW_QUESTION_REVIEW", label: "Allow Question Review" },
                  { key: "ALLOW_SKIP_QUESTION", label: "Allow Skip Question" },
                  { key: "ALLOW_BOOKMARK", label: "Allow Bookmark" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer">{item.label}</Label>
                    <Switch checked={formData[item.key] ?? false} onCheckedChange={(c) => handleToggle(item.key, c, item.label)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answer" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Answer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auto Save Interval (seconds)</Label>
                  <Input type="number" value={formData.AUTO_SAVE_INTERVAL || ""} onChange={(e) => handleChange("AUTO_SAVE_INTERVAL", parseInt(e.target.value))} onBlur={() => handleBlur("AUTO_SAVE_INTERVAL", "Auto Save Interval")} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "AUTO_SUBMIT_ON_TIMEOUT", label: "Auto Submit on Timeout" },
                  { key: "ALLOW_ANSWER_CHANGE", label: "Allow Answer Change" },
                  { key: "ALLOW_MULTIPLE_ATTEMPTS", label: "Allow Multiple Attempts" },
                  { key: "ALLOW_RESUME", label: "Allow Resume" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer">{item.label}</Label>
                    <Switch checked={formData[item.key] ?? false} onCheckedChange={(c) => handleToggle(item.key, c, item.label)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proctoring" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Proctoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "PROCTORING_BROWSER_LOCK", label: "Enable Browser Lock" },
                  { key: "PROCTORING_FULL_SCREEN", label: "Enable Full Screen" },
                  { key: "PROCTORING_TAB_SWITCH_DETECTION", label: "Enable Tab Switch Detection" },
                  { key: "PROCTORING_WEBCAM_MONITORING", label: "Enable Webcam Monitoring" },
                  { key: "PROCTORING_MICROPHONE_MONITORING", label: "Enable Microphone Monitoring" },
                  { key: "PROCTORING_SCREEN_RECORDING", label: "Enable Screen Recording" },
                  { key: "PROCTORING_COPY_PASTE_BLOCK", label: "Enable Copy Paste Block" },
                  { key: "PROCTORING_RIGHT_CLICK_BLOCK", label: "Enable Right Click Block" },
                  { key: "PROCTORING_FACE_VERIFICATION", label: "Enable Face Verification" },
                  { key: "PROCTORING_BIOMETRIC_VERIFICATION", label: "Enable Biometric Verification" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <Label className="cursor-pointer text-foreground">{item.label}</Label>
                    <Switch checked={formData[item.key] ?? false} onCheckedChange={(c) => handleToggle(item.key, c, item.label)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="start" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Exam Start Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Early Entry Minutes</Label>
                  <Input type="number" value={formData.EARLY_ENTRY_MINUTES || ""} onChange={(e) => handleChange("EARLY_ENTRY_MINUTES", parseInt(e.target.value))} onBlur={() => handleBlur("EARLY_ENTRY_MINUTES", "Early Entry Minutes")} />
                </div>
                <div className="space-y-2">
                  <Label>Late Entry Minutes</Label>
                  <Input type="number" value={formData.LATE_ENTRY_MINUTES || ""} onChange={(e) => handleChange("LATE_ENTRY_MINUTES", parseInt(e.target.value))} onBlur={() => handleBlur("LATE_ENTRY_MINUTES", "Late Entry Minutes")} />
                </div>
                <div className="space-y-2">
                  <Label>Exam Buffer Time (mins)</Label>
                  <Input type="number" value={formData.EXAM_BUFFER_TIME || ""} onChange={(e) => handleChange("EXAM_BUFFER_TIME", parseInt(e.target.value))} onBlur={() => handleBlur("EXAM_BUFFER_TIME", "Exam Buffer Time")} />
                </div>
                <div className="space-y-2">
                  <Label>Verification Time (mins)</Label>
                  <Input type="number" value={formData.VERIFICATION_TIME || ""} onChange={(e) => handleChange("VERIFICATION_TIME", parseInt(e.target.value))} onBlur={() => handleBlur("VERIFICATION_TIME", "Verification Time")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Submission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "SUBMISSION_AUTO_SUBMIT", label: "Auto Submit" },
                  { key: "SUBMISSION_MANUAL_SUBMIT", label: "Manual Submit" },
                  { key: "SUBMISSION_CONFIRMATION", label: "Submission Confirmation" },
                  { key: "SUBMISSION_LOCK", label: "Submission Lock" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <Label className="cursor-pointer text-foreground">{item.label}</Label>
                    <Switch checked={formData[item.key] ?? false} onCheckedChange={(c) => handleToggle(item.key, c, item.label)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle>Result Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "RESULT_AUTO_PUBLISH", label: "Auto Publish Results" },
                  { key: "RESULT_MANUAL_APPROVAL", label: "Manual Approval Required" },
                  { key: "RESULT_AUTO_MERIT", label: "Generate Merit Automatically" },
                  { key: "RESULT_AUTO_RANK", label: "Auto Rank Calculation" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <Label className="cursor-pointer text-foreground">{item.label}</Label>
                    <Switch checked={formData[item.key] ?? false} onCheckedChange={(c) => handleToggle(item.key, c, item.label)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};
